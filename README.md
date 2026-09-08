# Mithul Sourav · Portfolio & Mika’s Life

A mechanical engineering and robotics portfolio with a personal journal and a private writing desk. Academic and project facts come from the supplied CV. The three opening essays are original commissioned copy, with credited archival illustrations.

## Run locally

Use Node.js 22.13 or newer and npm.

```sh
npm ci
npm run db:migrate
npm run dev
```

Open the address printed by the server. Visit `/write` and choose **Sign in with ChatGPT**. Local development simulates an account called Seedy; no password or API key is needed. This local sign-in is absent from production builds.

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

The writing desk uses Cloudflare D1 through the `DB` binding. Local data lives in the ignored `.wrangler/state/` directory and survives development-server restarts. Production data belongs to the existing Sites deployment. Posts written online are stored in that database, not committed to GitHub; use the backup button to retain a separate copy.

The public portfolio and journal are readable without sign-in. Writing pages and every draft API enforce an owner allowlist on the server. The production owner is `miastromika@gmail.com`. Only the Sites development identity is additionally allowed during local development. Authenticated requests use the platform’s trusted identity headers; mutations also require a same-origin JSON request.

The auth flow is provided by Sites. Do not expose the raw Worker publicly outside that trusted dispatcher or move it to a different host without implementing the equivalent trusted authentication boundary. GitHub holds the source; GitHub Pages does not run the database or server routes.

The initial essays are bundled from `content/posts/*.md`. On the owner’s first desk visit, the server imports them once. From then on, the database is authoritative. Redeploying source does not overwrite edited posts or restore unpublished essays. The Markdown files are a record of the initial issue, not a second CMS. New regular posts should be written through `/write`.

## Change the portfolio

| Content                                                  | Location                      |
| -------------------------------------------------------- | ----------------------------- |
| Project facts, contribution, method, status, and results | `content/projects.ts`         |
| Homepage introduction                                    | `app/page.tsx`                |
| Education, experience, skills, and recognition           | `app/about/page.tsx`          |
| Name, contacts, and navigation                           | `app/layout.tsx`              |
| CV download                                              | `public/Mithul-Sourav-CV.pdf` |
| Journal introduction                                     | `app/blog/page.tsx`           |
| Colours, typography, spacing, and responsive layout      | `app/globals.css`             |
| Owner authorization                                      | `lib/journal-model.ts`        |

The five project records generate the portfolio listings and case studies. Keep individual contributions distinct from team work, and simulation results distinct from physical tests. The tensegrity illustration is conceptual; the project graphics describe methods. The source CV filename refers to an MIT application, not an MIT affiliation. The site correctly lists NITK Surathkal, CGPA 7.37/10, and the official Vayu role of Product Intern.

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

`npm start` serves the production build locally using the same local database. It checks production rendering but does not simulate Sites sign-in. All built Worker assets are under `dist/`; database files, environment files, and dependency folders are excluded from source control and deployment archives.

The editor includes a feature-detected `save_journal_draft` WebMCP action for compatible browsers. The regular writing desk works without it. A supported WebMCP validation context was not available in the development session; no browser integration verification is claimed for this optional action.

## Database changes and hosting

```sh
npm run db:generate
npm run db:migrate
npm run build
```

Define schema changes in `db/schema.ts`, generate and inspect a new migration, then apply it locally. Never edit an applied migration. Migrations contain schema changes only; initial article import is an authenticated application action.

Reuse the Site registration in `.openai/hosting.json`. It contains only the Site ID and logical bindings. Sites packages the Worker, assets, and `drizzle/` migrations and supplies the production database and sign-in flow. Source pushes and website deployment are separate actions: a GitHub push alone does not publish this website. No site should be called live until deployment succeeds and its URL is verified.

## Design and credits

The engineering pages use Manrope, Fraunces, and Space Mono, locally hosted with their SIL Open Font Licenses in `public/fonts/`. The journal draws on the unhurried editorial reading experience of [The Marginalian](https://www.themarginalian.org/), with its own name, essays, and layout. No articles or images were copied from that site.

- **Earthrise:** Bill Anders / NASA, Apollo 8, 24 December 1968. [NASA source](https://science.nasa.gov/resource/apollo-8s-iconic-earthrise/) and [media-use policy](https://www.nasa.gov/nasa-brand-center/images-and-media/). Used for editorial illustration; no NASA endorsement is implied.
- **Animal Locomotion, Plate 49:** Eadweard Muybridge, 1880s. The Metropolitan Museum of Art, Rogers Fund, transferred from the Library, 1991.1135.7. [Collection record](https://www.metmuseum.org/art/collection/search/266437), public domain / [CC0 Open Access](https://www.metmuseum.org/hubs/open-access).

Stack: React, TypeScript, Vinext, Vite, Cloudflare Workers, Sites, D1, and Drizzle migrations. Articles render with react-markdown and remark-gfm; raw HTML and executable link protocols are not rendered.
