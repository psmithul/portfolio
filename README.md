# Mithul Sourav — portfolio & The Margins

A mechanical engineering and robotics portfolio, with a personally maintained Markdown journal. The CV provided on 8 September 2026 is the source for all academic and project claims.

## Start the site

Requires Node.js 22.13 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by the server. The portfolio, project pages, and journal are server-rendered and work without client-side JavaScript. Fonts are served locally.

## Write a journal entry

1. Create a draft:

   ```sh
   npm run post -- "What mechanisms can teach us about uncertainty"
   ```

2. Open the new file in `content/posts/`. Edit its title, description, tags, date, and Markdown body.
3. Stop the regular development server, then run `npm run dev:drafts`. Open `/blog` to read the draft in the actual article layout. This mode clearly labels the site as a local draft preview. Editing a Markdown file updates the preview automatically.
4. When the entry is ready, change `draft: true` to `draft: false`. Use a quoted date, such as `date: "2026-09-08"`.
5. Run `npm run build`, then publish the updated version with Sites.

A complete syntax example lives at `content/templates/post.md`; it is excluded from the journal. The blog intentionally starts with zero published posts. No sample essay is presented as your writing.

Production builds exclude drafts and future-dated posts, even if the draft-preview environment variable is set. A future-dated post becomes eligible at the next build on or after that date (UTC); there is no automatic publishing scheduler.

### Front matter

```yaml
---
title: 'Your essay title'
date: '2026-09-08'
description: 'A short, specific introduction for the journal index.'
tags: ['Engineering', 'Reflections']
draft: true
---
```

The filename becomes the URL: `a-small-observation.md` → `/blog/a-small-observation`. Use lowercase letters, digits, and hyphens. Avoid renaming a published file because that changes its URL.

Headings, paragraphs, emphasis, links, blockquotes, lists, code, tables, and footnotes are supported. Raw HTML is deliberately omitted by the renderer. Add your own images to `public/images/` and reference them as `![Useful alt text](/images/filename.webp)`. Ensure referenced files exist before publishing. A post's title is already the page heading; start body headings with `##`.

The homepage automatically links to the newest visible entry. Reading time is estimated from the word count. The article order is newest first.

## Update the portfolio

| What to update                                      | File                          |
| --------------------------------------------------- | ----------------------------- |
| Project facts, methods, outcomes, status, and tools | `content/projects.ts`         |
| Homepage introduction                               | `app/page.tsx`                |
| Education, experience, skills, and recognition      | `app/about/page.tsx`          |
| Name, contact links, and navigation                 | `app/layout.tsx`              |
| Downloadable CV                                     | `public/Mithul-Sourav-CV.pdf` |
| Journal introduction                                | `app/blog/page.tsx`           |
| Colours, typography, spacing, and responsive layout | `app/globals.css`             |
| Actual journal entries                              | `content/posts/*.md`          |

The five main project records generate both index cards and full project pages. Keep your personal contribution distinct from team work, and distinguish modeled outcomes from physical test results. The tensegrity illustration is a conceptual principle schematic. The other graphics describe engineering workflows; they are not prototype images or experimental results.

The primary source is `Mithul_MIT_Mechanical_Engineering_SM_CV_FINAL.pdf`. Its filename does not imply MIT affiliation: the website correctly identifies NITK Surathkal. CGPA is 7.37/10 and the official Vayu role is Product Intern.

## Check and build

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

`npm run smoke -- http://localhost:3000` checks the live local routes, missing-page behavior, metadata, and CV download. Use the address actually printed by the server.

`npm start` serves the built Cloudflare Worker locally. Content is compiled at build time into `lib/posts.generated.ts`; do not edit that generated file. The deployed Worker has no dependency on a writable filesystem and the site needs no database or CMS account.

## Hosting and ownership

The existing Sites registration belongs to the `miastromika` destination and is recorded in `.openai/hosting.json`. Reuse that registration for updates; do not create another Site.

This build is prepared for Sites hosting. Publication requires the explicit confirmation requested by the supplied AGENTS.md. No deployment should be described as live until the Sites deployment-status check succeeds.

To request an update later: “Update my portfolio in Life creative, preview the changes, and publish after I approve.” To add a post: “Add this essay to The Margins as a draft.” You can also maintain all content directly without an assistant.

Draft source files are part of the local project and its private source history; draft exclusion protects the published site output, not the source repository. Keep confidential notes outside the site project.

## Design and implementation

The engineering pages use a structured fieldbook layout, Manrope, Fraunces, and Space Mono. The journal takes its reading-first editorial direction from [The Marginalian](https://www.themarginalian.org/), while using original copy, layout, and identity. No articles or imagery were copied from the reference.

Stack: React, TypeScript, Vinext, Vite, Cloudflare Workers, and the Sites plugin. Journal rendering uses [react-markdown](https://github.com/remarkjs/react-markdown) with remark-gfm, and gray-matter for author-controlled front matter.

Fonts are locally hosted under their SIL Open Font Licenses in `public/fonts/`. The website includes responsive layouts, visible keyboard focus, a skip link, reduced-motion support, a custom 404 page, and print styles.
