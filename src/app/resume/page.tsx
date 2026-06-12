import { PageHeader } from "@/components/PageHeader";
import { EmailLink } from "@/components/EmailLink";

export default function ResumePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Resume"
        right={
          <a className="btn btnPrimary" href="/resume.pdf" download>
            Download PDF
          </a>
        }
      />

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white/90">Bradley Pfeil</h2>
        <p className="mt-2 text-sm text-white/70">
          Adelaide, SA · <EmailLink email="Brad180795@gmail.com" /> ·{" "}
          <a className="link" href="https://github.com/Brad-Pfeil" target="_blank" rel="noreferrer">
            GitHub
          </a>{" "}
          ·{" "}
          <a className="link" href="https://linkedin.com/in/bradley-pfeil" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Experience</h3>
          <div className="mt-4 space-y-4 text-sm text-white/75">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-semibold text-white/90">
                  Streamline (Lunio) — Data Scientist
                </div>
                <div className="text-white/55">2025 – Current</div>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Worked with a team to build a dynamic pricing platform for enterprise clients that surfaces
                  revenue opportunities through demand modelling and optimisation.
                </li>
                <li>
                  Modelled transition probabilities with a two-stage approach (hurdle classifier + gradient-boosted
                  regressor with uncertainty estimates) and jointly developed a Markov Decision Process solver that
                  recommends optimal prices and forecasts revenue.
                </li>
                <li>
                  Estimated price response with causal inference and added a counterfactual data pipeline so models
                  generalise beyond observed price points.
                </li>
                <li>
                  Currently developing a deep Q-learning agent (PyTorch) that treats commodity-storage pricing as a
                  sequential control problem.
                </li>
                <li>
                  Shipped models to production on AWS with CI/CD pipelines; refactored bottlenecks to halve
                  inference time.
                </li>
                <li>Cut monthly AWS spend by 20%+ via a dedicated cost-monitoring framework.</li>
                <li>
                  Worked closely with clients to explain results, shape reward functions, and keep recommendations
                  grounded in the business; started a paper-reading group.
                </li>
              </ul>
            </div>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-semibold text-white/90">Aurizn — Intern / Graduate Data Scientist</div>
                <div className="text-white/55">2023 – 2025</div>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Built LLM-based recommender systems consuming Shapley values to explain their decisions in terms
                  non-technical stakeholders could act on.
                </li>
                <li>
                  Worked with the team to build client-requested features and model improvements for a dynamic
                  pricing system, including data ingestion and automated retraining that kept accuracy steady as the
                  data shifted and cut manual upkeep.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Education</h3>
          <div className="mt-4 text-sm text-white/75">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="font-semibold text-white/90">The University of Adelaide</div>
              <div className="text-white/55">2022 – 2024</div>
            </div>
            <div className="mt-1">Bachelor of Computer Science (Advanced)</div>
          </div>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-white/70">Languages & tools</h3>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-white/45">Proficient</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                "Python",
                "SQL",
                "GBT",
                "Polars",
                "PyTorch",
                "AWS",
                "Docker",
                "Git",
                "Linux"
              ].map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-white/45">Experienced</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["PySpark", "Rust"].map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-white/70">Additional</h3>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/75">
            <li>Scrum Master Certificate (2025)</li>
          </ul>
        </div>
      </div>

      {/* <div className="card p-6">
        <p className="text-sm text-white/65">
          Note: the <code className="rounded bg-white/5 px-1.5 py-0.5">/resume.pdf</code> link is wired up for
          hosting convenience. Drop your generated PDF into <code className="rounded bg-white/5 px-1.5 py-0.5">public/resume.pdf</code> when ready.
        </p>
      </div> */}
    </div>
  );
}


