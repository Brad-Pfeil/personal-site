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
                  Streamline (Aurizn / Lunio) — Data Scientist
                </div>
                <div className="text-white/55">2025 – Current</div>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  Lead Data Scientist owning end-to-end design of a revenue management platform that surfaces
                  pricing improvement opportunities through mathematical modelling and optimisation.
                </li>
                <li>
                  Built a two-stage statistical model (hurdle classifier + gradient-boosted regressor with
                  uncertainty quantification) to estimate demand transitions, and a Markov Decision Process solver
                  that computes optimal pricing policies, revenue forecasts, and scenario analysis via forward
                  simulation.
                </li>
                <li>
                  Applied econometric and causal inference techniques to estimate heterogeneous price
                  elasticities, and designed a counterfactual data augmentation pipeline to improve generalisation
                  beyond observed price variation.
                </li>
                <li>
                  Translated these capabilities into production software on AWS (Docker, ECS, SQS, Lambda), with
                  CI/CD, automated testing, model validation, and code quality governance.
                </li>
                <li>
                  Engaged directly with clients and stakeholders to explain model outputs, define domain-specific
                  reward functions, and align pricing recommendations with business objectives.
                </li>
                <li>
                  Identified and resolved scaling bottlenecks, halving inference time, and implemented a cost
                  monitoring framework that reduced monthly AWS spend by 20%+.
                </li>
                <li>
                  Founded and lead a journal review club, fostering team growth through discussion of AI/ML
                  research.
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
                  Developed LLM-based recommender systems with SHAP-driven explainability to surface model
                  decision logic for non-technical stakeholders.
                </li>
                <li>
                  Engineered data ingestion and automated retraining pipelines for a dynamic pricing system,
                  ensuring consistent model accuracy across changing data distributions while reducing manual
                  maintenance overhead.
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
                "EconML",
                "statsmodels",
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
              {["PySpark", "Rust", "C++"].map((t) => (
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


