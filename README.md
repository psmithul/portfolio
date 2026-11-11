# Mithul Sourav’s portfolio

The site is plain HTML and CSS. Vercel serves the files in `public/` directly and deploys production from `main`. [Live portfolio](https://psmithul.com/)

| Content | File |
| --- | --- |
| About | `public/index.html` |
| Projects | `public/projects.html` |
| Build Log | `public/build-log.html` |
| Project case studies | `public/work/*.html` |
| Published posts | `public/blog/*.html` |
| Shared styles | `public/styles/site.css` |
| Case study styles | `public/styles/project.css` |

To publish a post, add its HTML file to `public/blog/` and link it from Build Log. Add the same URL to `public/sitemap.xml`. For a new case study, add its HTML file to `public/work/` and link it from the appropriate group on Projects. Copy an existing page for the navigation, metadata, and document structure.

Vercel serves `public/projects.html` at `/projects`. The routing rules, legacy redirects, and health endpoint are in `vercel.json`. GitHub branch pushes create previews. Check the preview’s public pages and links before merging.

The former Next.js application and writing desk are available in repository history at `144acf6`. The static site contains the published articles captured at migration. The previous private storage is separate from the deployed files.

Project image sources are recorded in `docs/current-project-assets.json`. Article sources are in `docs/journal-sources.md`. Font and icon licenses are included beside the corresponding assets.
