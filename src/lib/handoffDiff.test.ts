import { describe, expect, it } from "vitest";
import { handoffArtifacts } from "../data/handoff";
import { buildHandoffReport } from "./handoffDiff";

describe("buildHandoffReport", () => {
  it("flags incompatible import and export requirements as contradictions", () => {
    const report = buildHandoffReport(handoffArtifacts);

    expect(report.counts.contradictions).toBe(2);
    expect(report.findings[0]).toMatchObject({
      severity: "critical",
      findingType: "contradiction",
    });
  });

  it("keeps missing ownership visible as a separate repair risk", () => {
    const report = buildHandoffReport(handoffArtifacts);
    const missingOwner = report.findings.find((finding) => finding.topic === "Sheets auth");

    expect(missingOwner).toMatchObject({
      severity: "watch",
      findingType: "missing-owner",
    });
    expect(missingOwner?.repairAction).toContain("Assign one accountable owner");
  });

  it("builds an ordered repair memo with one-source-of-truth guidance", () => {
    const report = buildHandoffReport(handoffArtifacts);

    expect(report.repairMemo).toContain("Handoff repair memo");
    expect(report.repairMemo).toContain("rewrite the PRD and sprint scope");
    expect(report.repairMemo).toContain("one source of truth");
  });
});
