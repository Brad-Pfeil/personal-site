# Personal site (Interactive DS portfolio)

Built with **Next.js + TypeScript + Tailwind**, featuring a “data lab” UI and interactive DS demos:

- `/` profile landing page
- `/projects` MDX writeups (`src/content/projects/*.mdx`)
- `/playground` interactive demos (k-means, gradient descent, A/B inference)
- `/resume` resume summary + download link

## Local development

```bash
cd /home/brad-pfeil/projects/personal_site
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content editing

- **Project pages**: add/edit MDX in `src/content/projects/*.mdx` (frontmatter is required).
- **Resume PDF**: place your latest resume at `public/resume.pdf` so the `/resume` download button works.

## SEO / metadata

Set your production URL so `metadataBase`, `sitemap.xml`, and `robots.txt` are correct:

```bash
export NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## Deployment (GitHub Pages)

This repo includes a GitHub Actions workflow that builds a **static export** and deploys it to Pages.

1. Push to `main`
2. In GitHub: **Settings → Pages**
   - **Build and deployment**: select **GitHub Actions**

Notes:
- The workflow assumes project-pages hosting: `https://<user>.github.io/<repo>/`
- If you use a user/organization Pages site (root domain), set `NEXT_PUBLIC_BASE_PATH=""` in the workflow.

## Deployment (Vercel)

- Import the repo in Vercel and deploy.
- Add `NEXT_PUBLIC_SITE_URL` in the Vercel project environment variables.
- Connect your custom domain when ready.

