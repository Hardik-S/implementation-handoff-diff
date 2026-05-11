import type { HandoffArtifact } from "../lib/handoffDiff";

export const handoffArtifacts: HandoffArtifact[] = [
  {
    id: "DISC-014",
    source: "Discovery note",
    owner: "Maya, Product",
    excerpt:
      "Pilot users only need CSV upload for the first release. Finance wants preview-only exports until the trust review signs off.",
    claims: [
      {
        topic: "Import source",
        stance: "CSV upload only for first release",
        owner: "Maya, Product",
        status: "decided",
      },
      {
        topic: "Export behavior",
        stance: "Preview-only exports until trust review",
        owner: "Finance Ops",
        status: "decided",
      },
      {
        topic: "Reviewer owner",
        stance: "Trust review owner not named",
        owner: "Unassigned",
        status: "open",
      },
    ],
  },
  {
    id: "PRD-022",
    source: "PRD excerpt",
    owner: "Ravi, PM",
    excerpt:
      "The build should support CSV and Google Sheets imports, export a PDF packet, and route unresolved trust questions to the launch checklist.",
    claims: [
      {
        topic: "Import source",
        stance: "CSV plus Google Sheets imports",
        owner: "Ravi, PM",
        status: "changed",
      },
      {
        topic: "Export behavior",
        stance: "Export a PDF packet",
        owner: "Ravi, PM",
        status: "changed",
      },
      {
        topic: "Trust review",
        stance: "Open questions move to launch checklist",
        owner: "Trust lead needed",
        status: "open",
      },
    ],
  },
  {
    id: "SCOPE-009",
    source: "Implementation scope",
    owner: "Noah, Engineering",
    excerpt:
      "Sprint scope includes CSV parsing, contradiction flags, and a Markdown repair memo. Sheets auth and PDF export are out of scope without an owner decision.",
    claims: [
      {
        topic: "Import source",
        stance: "CSV parsing only; Sheets auth out of scope",
        owner: "Noah, Engineering",
        status: "decided",
      },
      {
        topic: "Export behavior",
        stance: "Markdown repair memo instead of PDF export",
        owner: "Noah, Engineering",
        status: "changed",
      },
      {
        topic: "Sheets auth",
        stance: "Needs owner decision before build",
        owner: "Unassigned",
        status: "open",
      },
    ],
  },
];
