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
                <div className="font-semibold text-white/90">Streamline (Aurizn / Lunio) — Data Scientist</div>
                <div className="text-white/55">2024 – Current</div>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Optimised a dynamic pricing model; improved inference time by ~80% and enhanced revenue forecast accuracy.</li>
                <li>Owned AWS MLOps + support; implemented cost monitoring/reporting reducing monthly AWS spend by ~$2,000+.</li>
                <li>Founded and led a journal review club to grow team research literacy.</li>
              </ul>
            </div>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="font-semibold text-white/90">Aurizn — Intern Data Scientist</div>
                <div className="text-white/55">2022 – 2024</div>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Built LLM-based recommender systems with SHAP-driven explainability for stakeholders.</li>
                <li>Automated retraining workflows to maintain consistent model accuracy and reduce manual ops.</li>
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
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Python",
              "SQL",
              "PySpark",
              "PyTorch",
              "AWS",
              "IaC",
              "Git",
              "R",
              "Java",
              "C++"
            ].map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-white/70">Additional</h3>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-white/75">
            <li>Scrum Master Certificate (2025)</li>
            <li>Industry liaison — University of Adelaide Competitive Programming Club (2024)</li>
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


