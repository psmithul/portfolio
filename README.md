# Mithul Sourav · Portfolio & Mika’s Life

An academic portfolio for mechanical engineering and robotics, with a personal journal and a private writing desk. Academic and project facts come from the supplied CV. The journal includes four published student-voice notes on OpenAI models and control systems. Research dates and sources are recorded in `docs/journal-sources.md`.

Public website: [psmithul.com](https://psmithul.com/). Vercel fallback: [psmithul-portfolio.vercel.app](https://psmithul-portfolio.vercel.app/).

Source repository: [psmithul/portfolio](https://github.com/psmithul/portfolio). Vercel is connected to this repository; pushes to `main` deploy production and other branches create previews.

## Website routes

- `/` introduces the portfolio and selected projects. `/about` has the full biography, and `/activities` covers experience, leadership, and team work.
- `/work` lists all projects and `/work/[slug]` opens a case study.
- `/blog` lists published notes, and `/write` is the private writing desk.
- Old `/v1` links permanently redirect to the corresponding current paths.

The layout uses `app/academic.css` and `components/academic/`. It uses [Amarna by Ishtar van Looy](https://github.com/ijvanl/Amarna), served locally under the included SIL Open Font License. Project covers use original documentation. Entries without a landscape project image are shown as text in the listings. Image sources are recorded in `docs/current-project-assets.json`.

## Run locally

Use Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open the address printed by the server. The public journal works from the bundled Markdown essays without credentials. To use the writing desk locally, pull the project environment with `vercel env pull .env.local`, then configure the local password hash and session secret. Environment files must remain ignored by Git.

## Write on the website

1. Open **Writing desk** in the footer, or go to `/write`.
2. Choose **New entry**, or open an existing essay.
3. Add a title, a short introduction, topics separated by commas, and your text.
4. Use the toolbar for headings, emphasis, quotations, lists, links, and images. The image button accepts a hosted image URL and a description. You can also type Markdown directly.
5. Switch to **Preview** to read the essay with the journal’s typography.
6. Choose **Publish** when it is ready. For an existing article, use **Update post**.

Drafts save automatically after you pause for 1.5 seconds. **Save draft**, or Cmd/Ctrl+S, saves immediately. The status line confirms whether changes have reached the database. If a save fails, your text stays in the editor and an error explains what to do. If another tab has edited the same post, the server refuses to overwrite its changes; copy your text before reloading.

Saving an edit to a published article does not change the public version. Readers see the previous version until you choose **Update post**. **Unpublish** removes an article from the journal while keeping its draft. Published URLs stay stable after title changes. Dates use UTC, and reading time is estimated at 220 words per minute.

**Download a backup** on the desk exports all saved drafts and published versions as JSON. It does not include text still waiting to save in an open editor.

## Storage and access

Next.js runs the website and API on Vercel. Drafts and published versions live in the private `portfolio-journal` Vercel Blob store, with separate `journal/production.json`, `journal/preview.json`, and `journal/development.json` documents. Source pushes do not overwrite existing posts. Online writing does not create a Git commit; use **Download a backup** to retain your own copy.

The private writing desk uses a strong owner password. The password itself is never stored in the repository or Vercel environment; `JOURNAL_PASSWORD_HASH` contains a salted scrypt hash. `JOURNAL_SESSION_SECRET` signs a seven-day HttpOnly, Secure, SameSite=Strict cookie in production. Every draft page and API checks that signed session on the server. There is no development identity bypass and no reliance on incoming identity headers. Sign-in is limited to six attempts per IP within fifteen minutes; the storage key uses a keyed hash rather than retaining the IP address. All mutations require same-origin JSON requests.

The public portfolio and journal are available without a Vercel login at the production domain. The writing desk remains private even though the website and repository are public. The initial owner password is kept outside the repository at `~/.config/mithul-portfolio/writing-desk-password.txt` with owner-only filesystem permissions. To change it, generate a new salted hash, update the Vercel secret environment variable, and redeploy. Rotate the session secret as well to invalidate existing sessions.

The journal uses conditional writes to prevent one browser tab from overwriting another. Reads bypass Blob's CDN cache and request uncompressed content so the storage ETag remains valid for conditional writes. Published copies are distinct from working drafts, and future-dated or unpublished entries are never returned by the public routes.

The bundled essays in `content/posts/*.md` supply the initial issue. New bundled articles are added by stable ID; existing owner edits and withdrawn articles are preserved. Regular new posts can be written entirely through `/write`.

## Change the portfolio

| Content                                                  | Location                       |
| -------------------------------------------------------- | ------------------------------ |
| Project facts, contribution, method, status, and results | `content/projects.ts`          |
| Selected projects                                        | `content/academic.ts`          |
| Education, experience, skills, and recognition           | `content/profile.ts`           |
| Mobile portfolio and navigation                          | `components/academic/`         |
| CV download                                              | `public/Mithul-Sourav-CV.pdf`  |
| Journal introduction                                     | `app/blog/page.tsx`            |
| Academic layout and reading-page styles                  | `app/academic.css`             |
| Desktop journey and navigation                           | `components/train-journey.tsx` |
| Base typography and reading layouts                      | `app/globals.css`              |
| Owner authorization                                      | `lib/journal-model.ts`         |

The eleven project records generate the portfolio listings and case studies. Keep individual contributions distinct from team work, and simulation results distinct from physical tests. Project images are optional: add an `image` object with `src`, `alt`, `width`, `height`, and an accurate `caption` only when the asset is verified. A `referenceUrl` may credit a paper. Current covers use credited reference photography where original project photographs are unavailable. References are labelled accurately and must not be described as personally built hardware. The source CV filename refers to an MIT application, not an MIT affiliation. The site correctly lists NITK Surathkal, CGPA 7.37/10, and the official Vayu role of Product Intern.

## Verify changes

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run smoke -- http://localhost:3000
npm run smoke:journal -- http://localhost:3000
```

Use the address printed by your actual development server. The journal integration check creates a clearly named local test entry, verifies save/reload, publication, private revisions, conflicts, and unpublishing, then prints its ID. It finishes as an unpublished draft. Run it only against a disposable local preview, never a live site.

`npm start` serves the Next.js production build locally. Next.js output is under `.next/`; credentials, environment files, dependencies, and local verification artifacts are excluded from source control. Historical D1 SQL migrations remain in `drizzle/`; the unused Cloudflare/Vite runtime and generic UI scaffold have been removed. Lint checks every application component.

The editor includes a feature-detected `save_journal_draft` WebMCP action for compatible browsers. The regular writing desk works without it. A supported WebMCP validation context was not available in the development session; no browser integration verification is claimed for this optional action.

## Hosting

The Vercel project is `portfolio` in `psmithulsouravs-projects`, linked to `psmithul/portfolio` with `main` as its production branch. `vercel.json` selects Next.js and `npm run build`. Node.js 22 is specified in `package.json`.

Vercel supplies `BLOB_READ_WRITE_TOKEN`, `JOURNAL_PASSWORD_HASH`, and `JOURNAL_SESSION_SECRET`. Keep all three server-only. The Blob store must remain private. The Hostinger-managed domain `psmithul.com`, its `www` alias, and `psmithul-portfolio.vercel.app` point to the same public production project; deployment-specific preview domains may require Vercel sign-in.

After a push, check that the Vercel deployment is Ready, its commit matches the pushed revision, and the public URL returns the current site without authentication. A successful Git push alone is not a successful deployment.

## Design and credits

The homepage photograph and About illustration were supplied by Mithul. The earlier designs are recorded in the repository history.

- **Earthrise:** Bill Anders / NASA, Apollo 8, 24 December 1968. [NASA source](https://science.nasa.gov/resource/apollo-8s-iconic-earthrise/) and [media-use policy](https://www.nasa.gov/nasa-brand-center/images-and-media/). Used for editorial illustration; no NASA endorsement is implied.
- **Animal Locomotion, Plate 49:** Eadweard Muybridge, 1880s. The Metropolitan Museum of Art, Rogers Fund, transferred from the Library, 1991.1135.7. [Collection record](https://www.metmuseum.org/art/collection/search/266437), public domain / [CC0 Open Access](https://www.metmuseum.org/hubs/open-access).

Current stack: Next.js, React, TypeScript, Vercel Functions, private Vercel Blob, and signed owner sessions. Articles render with react-markdown and remark-gfm; raw HTML and executable link protocols are not rendered.

The public résumé is the exact user-supplied `Mithul _Sourav_CV.pdf`. Its single completed Actuated Knee Assistance System project spans October 2025–September 2026. NeoLeg’s passive mechanism and KneeAssist’s actuated brace are presented as one case study at `/work/kneeassist`; the former NeoLeg URL redirects there. Procurement readiness is distinct from the planned bench tests.

Public routes have production canonical URLs. `sitemap.xml` reads the current published journal, so withdrawals and new posts are reflected without a redeploy; private writing routes, API endpoints, and health checks are excluded. Page errors offer a retry and a return link in the same theme.
