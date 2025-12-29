import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/PageHeader";
import { MdxContent } from "@/components/MdxContent";
import { getProjectBySlug, listProjectSlugs } from "@/lib/content";

export async function generateStaticParams() {
  const slugs = await listProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const doc = await getProjectBySlug(params.slug);
    return {
      title: doc.frontmatter.title,
      description: doc.frontmatter.summary
    };
  } catch {
    return {};
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  let doc;
  try {
    doc = await getProjectBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={doc.frontmatter.title}
        subtitle={doc.frontmatter.summary}
        right={<span className="chip">{doc.frontmatter.year}</span>}
      />

      <div className="card p-6">
        <div className="flex flex-wrap gap-2">
          {doc.frontmatter.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2">
          <MdxContent source={doc.body} />
        </div>
      </div>
    </div>
  );
}


