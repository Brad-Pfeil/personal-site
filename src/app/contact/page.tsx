import { PageHeader } from "@/components/PageHeader";
import { EmailLink } from "@/components/EmailLink";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Contact"
        subtitle="Fastest way to reach me is email. I’m happy to chat about roles in DS/ML, optimization, and data products."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <div className="text-sm font-semibold text-white/90">Email</div>
          <p className="mt-2 text-sm text-white/70">
            <EmailLink email="Brad180795@gmail.com" />
          </p>
        </div>

        <div className="card p-6">
          <div className="text-sm font-semibold text-white/90">Links</div>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>
              GitHub:{" "}
              <a className="link" href="https://github.com/Brad-Pfeil" target="_blank" rel="noreferrer">
                github.com/Brad-Pfeil
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a className="link" href="https://linkedin.com/in/bradley-pfeil" target="_blank" rel="noreferrer">
                linkedin.com/in/bradley-pfeil
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


