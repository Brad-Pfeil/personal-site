import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

export type ProjectFrontmatter = {
  title: string;
  year: string;
  summary: string;
  tags: string[];
};

export type ProjectDoc = {
  slug: string;
  frontmatter: ProjectFrontmatter;
  body: string;
};

const projectsDir = path.join(process.cwd(), "src", "content", "projects");

export async function listProjectSlugs(): Promise<string[]> {
  const entries = await fs.readdir(projectsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""))
    .sort();
}

export async function getProjectBySlug(slug: string): Promise<ProjectDoc> {
  const fullPath = path.join(projectsDir, `${slug}.mdx`);
  const raw = await fs.readFile(fullPath, "utf8");
  const parsed = matter(raw);
  const fm = parsed.data as Partial<ProjectFrontmatter>;
  if (!fm.title || !fm.year || !fm.summary || !Array.isArray(fm.tags)) {
    throw new Error(`Invalid frontmatter for ${slug}.mdx`);
  }
  return {
    slug,
    frontmatter: {
      title: fm.title,
      year: fm.year,
      summary: fm.summary,
      tags: fm.tags
    },
    body: parsed.content
  };
}

export async function listProjects(): Promise<ProjectDoc[]> {
  const slugs = await listProjectSlugs();
  const docs = await Promise.all(slugs.map((s) => getProjectBySlug(s)));
  return docs.sort((a, b) => b.frontmatter.year.localeCompare(a.frontmatter.year));
}


