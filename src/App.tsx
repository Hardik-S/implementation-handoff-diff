import { handoffArtifacts } from "./data/handoff";
import { buildHandoffReport } from "./lib/handoffDiff";

const report = buildHandoffReport(handoffArtifacts);
const topFinding = report.findings[0];

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Synthetic handoff desk</p>
          <h1>Implementation Handoff Diff</h1>
          <p className="lede">
            Compare discovery notes, PRD copy, and engineering scope before a
            sprint inherits contradictions that should have been repaired in the handoff.
          </p>
        </div>
        <aside className="brief-panel" aria-label="Top handoff risk">
          <span className={`status ${topFinding.severity}`}>{topFinding.findingType}</span>
          <h2>{topFinding.topic}</h2>
          <p>{topFinding.summary}</p>
        </aside>
      </section>

      <section className="summary-grid" aria-label="Handoff diff summary">
        <div>
          <span>Contradictions</span>
          <strong>{report.counts.contradictions}</strong>
        </div>
        <div>
          <span>Missing owners</span>
          <strong>{report.counts.missingOwners}</strong>
        </div>
        <div>
          <span>Changed requirements</span>
          <strong>{report.counts.changedRequirements}</strong>
        </div>
      </section>

      <section className="artifact-grid" aria-label="Source artifacts">
        {handoffArtifacts.map((artifact) => (
          <article className="artifact-card" key={artifact.id}>
            <div>
              <p className="eyebrow">{artifact.id}</p>
              <h2>{artifact.source}</h2>
            </div>
            <p className="owner">{artifact.owner}</p>
            <p>{artifact.excerpt}</p>
          </article>
        ))}
      </section>

      <section className="diff-list" aria-label="Contradictions and repair actions">
        {report.findings.map((finding) => (
          <article className="diff-card" key={finding.topic}>
            <div className="card-header">
              <div>
                <p className="eyebrow">{finding.topic}</p>
                <h2>{finding.summary}</h2>
              </div>
              <span className={`status ${finding.severity}`}>{finding.severity}</span>
            </div>

            <div className="evidence-grid">
              <div>
                <h3>Source trail</h3>
                <ul>
                  {finding.sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Repair action</h3>
                <p>{finding.repairAction}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="memo-panel" aria-label="Handoff repair memo">
        <h2>Repair memo</h2>
        <pre>{report.repairMemo}</pre>
      </section>
    </main>
  );
}

export default App;
