export type ClaimStatus = "decided" | "changed" | "open";

export type HandoffClaim = {
  topic: string;
  stance: string;
  owner: string;
  status: ClaimStatus;
};

export type HandoffArtifact = {
  id: string;
  source: string;
  owner: string;
  excerpt: string;
  claims: HandoffClaim[];
};

export type DiffFinding = {
  topic: string;
  severity: "critical" | "watch" | "stable";
  findingType: "contradiction" | "missing-owner" | "changed-requirement" | "aligned";
  sources: string[];
  summary: string;
  repairAction: string;
};

export type HandoffReport = {
  findings: DiffFinding[];
  repairMemo: string;
  counts: {
    contradictions: number;
    missingOwners: number;
    changedRequirements: number;
  };
};

const missingOwnerPattern = /unassigned|needed|not named|tbd/i;
const normalise = (value: string) => value.trim().toLowerCase();

export function buildHandoffReport(artifacts: HandoffArtifact[]): HandoffReport {
  const byTopic = new Map<string, Array<HandoffClaim & { source: string }>>();

  for (const artifact of artifacts) {
    for (const claim of artifact.claims) {
      const claims = byTopic.get(claim.topic) ?? [];
      claims.push({ ...claim, source: artifact.source });
      byTopic.set(claim.topic, claims);
    }
  }

  const findings = [...byTopic.entries()].map(([topic, claims]) => classifyTopic(topic, claims));
  const counts = {
    contradictions: findings.filter((item) => item.findingType === "contradiction").length,
    missingOwners: findings.filter((item) => item.findingType === "missing-owner").length,
    changedRequirements: findings.filter((item) => item.findingType === "changed-requirement").length,
  };

  return {
    findings: findings.sort((a, b) => severityRank(b.severity) - severityRank(a.severity)),
    repairMemo: createRepairMemo(findings),
    counts,
  };
}

function classifyTopic(
  topic: string,
  claims: Array<HandoffClaim & { source: string }>,
): DiffFinding {
  const uniqueStances = new Set(claims.map((claim) => normalise(claim.stance)));
  const hasMissingOwner = claims.some((claim) => missingOwnerPattern.test(claim.owner));
  const hasChangedRequirement = claims.some((claim) => claim.status === "changed");

  if (uniqueStances.size > 1 && hasChangedRequirement) {
    return {
      topic,
      severity: "critical",
      findingType: "contradiction",
      sources: claims.map((claim) => `${claim.source}: ${claim.stance}`),
      summary: `${topic} changed across artifacts and now has incompatible implementation expectations.`,
      repairAction: `Run a 15-minute owner decision on ${topic}, then rewrite the PRD and sprint scope with one accepted stance.`,
    };
  }

  if (hasMissingOwner) {
    return {
      topic,
      severity: "watch",
      findingType: "missing-owner",
      sources: claims.map((claim) => `${claim.source}: ${claim.owner}`),
      summary: `${topic} cannot move cleanly because ownership is missing or ambiguous.`,
      repairAction: `Assign one accountable owner for ${topic} before engineering treats it as committed scope.`,
    };
  }

  if (hasChangedRequirement) {
    return {
      topic,
      severity: "watch",
      findingType: "changed-requirement",
      sources: claims.map((claim) => `${claim.source}: ${claim.stance}`),
      summary: `${topic} changed after discovery and needs explicit acceptance.`,
      repairAction: `Mark ${topic} as accepted, deferred, or removed in the handoff memo.`,
    };
  }

  return {
    topic,
    severity: "stable",
    findingType: "aligned",
    sources: claims.map((claim) => `${claim.source}: ${claim.stance}`),
    summary: `${topic} is aligned enough for the current build slice.`,
    repairAction: `Keep ${topic} in scope and preserve the source trail.`,
  };
}

function severityRank(severity: DiffFinding["severity"]): number {
  return severity === "critical" ? 3 : severity === "watch" ? 2 : 1;
}

export function createRepairMemo(findings: DiffFinding[]): string {
  const urgent = findings.filter((finding) => finding.severity !== "stable");
  const lines = urgent.map((finding, index) => `${index + 1}. ${finding.repairAction}`);

  return [
    "Handoff repair memo",
    "Before the build continues, reconcile the artifacts in this order:",
    ...lines,
    "Ship only the scope that has one source of truth, one owner, and one reviewer-visible evidence trail.",
  ].join("\n");
}
