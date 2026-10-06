# Mithul Sourav · Portfolio & Mika’s Life

A Minecraft-inspired 3D train journey through a mechanical engineering and robotics portfolio, with a personal journal and a private writing desk. Academic and project facts come from the supplied CV. The journal includes four published student-voice notes on OpenAI models and control systems. Research dates and sources are recorded in `docs/journal-sources.md`.

Public website: [psmithul.com](https://psmithul.com/). Vercel fallback: [psmithul-portfolio.vercel.app](https://psmithul-portfolio.vercel.app/).

Source repository: [psmithul/portfolio](https://github.com/psmithul/portfolio). Vercel is connected to this repository; pushes to `main` deploy production and other branches create previews.

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

| Content                                                  | Location                        |
| -------------------------------------------------------- | ------------------------------- |
| Project facts, contribution, method, status, and results | `content/projects.ts`           |
| Portrait opening and introduction                        | `components/portrait-story.tsx` |
| Education, experience, skills, and recognition           | `app/about/page.tsx`            |
| Name, contacts, and navigation                           | `app/layout.tsx`                |
| CV download                                              | `public/Mithul-Sourav-CV.pdf`   |
| Journal introduction                                     | `app/blog/page.tsx`             |
| Shared palette and reading-page styles                   | `app/flow.css`                  |
| Homepage flow and display typography                     | `app/flow.css`                  |
| Base typography and reading layouts                      | `app/globals.css`               |
| Owner authorization                                      | `lib/journal-model.ts`          |

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

`npm start` serves the Next.js production build locally. Next.js output is under `.next/`; credentials, environment files, dependencies, and local verification artifacts are excluded from source control. The old Cloudflare/D1 migration files are retained as historical source and are not used by the current Vercel runtime.

The editor includes a feature-detected `save_journal_draft` WebMCP action for compatible browsers. The regular writing desk works without it. A supported WebMCP validation context was not available in the development session; no browser integration verification is claimed for this optional action.

## Hosting

The Vercel project is `portfolio` in `psmithulsouravs-projects`, linked to `psmithul/portfolio` with `main` as its production branch. `vercel.json` selects Next.js and `npm run build`. Node.js 22 is specified in `package.json`.

Vercel supplies `BLOB_READ_WRITE_TOKEN`, `JOURNAL_PASSWORD_HASH`, and `JOURNAL_SESSION_SECRET`. Keep all three server-only. The Blob store must remain private. The Hostinger-managed domain `psmithul.com`, its `www` alias, and `psmithul-portfolio.vercel.app` point to the same public production project; deployment-specific preview domains may require Vercel sign-in.

After a push, check that the Vercel deployment is Ready, its commit matches the pushed revision, and the public URL returns the current site without authentication. A successful Git push alone is not a successful deployment.

## The train journey

The homepage is a scroll-driven Three.js voxel world with seven stops: Welcome, About, Current Projects, Past Projects, Experience, Blog, and Contact. A Create-inspired copper-and-oxidized locomotive follows curved rails through pixel-textured terrain and timber stations. Its flywheels and coupling rods move with the train. A block character exits through an opening cab door, follows the inclined gangway onto the near-side visitor platform, and faces the current display. Walking routes follow connected floor surfaces instead of cutting across platform corners. At the archive, the character walks to the launch pad, boards through a sliding hatch, and scrolling launches the same rocket and camera into space. Vayu Aerospace, Thinkify Labs, ILO Consulting, ISTE NITK, and NH66 Fund each have an individual orbital workplace: a hangar, product lab, finance hall, campus stage, and fund observatory; the final chapters visit a lunar library and landing platform. Small navigation dots and a route menu select destinations, with travel through the intervening scenery.

Wheel input, touch swipes, keyboard scrolling, scrollbar drags, navigation and mobile autoplay share a speed limit. Page motion stays below 240 pixels per second and slows further to keep walking below 2.2 world units per second, the train below 8, and rocket/camera travel below 13. Large wheel deltas are reduced and queued manual input is bounded to three quarters of a screen. Reversing direction cancels pending forward travel. There is one scroll surface for the entire journey. Long content is divided into small reading alcoves that the camera and guide visit in order; there are no nested text scrollbars. Open dialogs pause travel.

Visitors can drag the desktop canvas to look around, choose an onboard view, reset the camera, switch between daylight and moonlight, open a close-up reading view, and opt into an original instrumental tune. Sound starts only after a click. On mobile, a rotation screen requires landscape before Start. The scene auto-scrolls between chapters, with a reading pause and camera close-up at each stop and orbital workplace. Autoplay pauses at every reading alcove, including the portrait and each project. Play/pause, next chapter, and route navigation remain available. Touch scrolling pauses playback; turning back to portrait pauses it and restores the rotation screen. Reduced-motion preferences remove decorative motion and camera easing; the complete HTML content remains readable when 3D is unavailable.

Current Projects has the adaptive suspension rover, tensegrity joint, and leaf-collection robot. Each has a clickable mechanical exhibit in the Three.js workshop: the rover responds to a cam-driven bump through a fixed-step spring–damper, the tensegrity assembly shows connected tension and compression members, and the leaf robot uses a closed four-bar linkage, an interactive workbench, and its existing case-study URL. Every project page also includes a 3D laboratory with orbit, animation, assembly separation, and model-specific controls. The rover and flight-controller isolation models use a fixed-step base-excited spring–mass–damper response; the four-bar model solves its closed geometry with circle intersections. These are illustrative concept models, not original CAD, measured results, or numerical validation of the projects.

The Blog station opens the existing two-dimensional journal and article pages. Bundled posts, published owner entries, private writing-desk routes, resume downloads, and project URLs retain their existing sources and behavior.

| Change | Location |
| --- | --- |
| Station order, names, and experience | `content/journey.ts` |
| Journey content and navigation | `components/train-journey.tsx` |
| Voxel terrain, train, station buildings, camera | `lib/voxel-world.ts` |
| Original procedural 16 × 16 block textures | `lib/voxel-textures.ts` |
| Continuous actor/camera choreography and tests | `lib/journey-choreography.ts`, `scripts/journey-choreography.test.ts` |
| Reading alcove order and autoplay pauses | `lib/journey-exhibits.ts` |
| Native scroll mapping | `lib/journey-timeline.ts`, `scripts/journey-timeline.test.ts` |
| Input control and world speed limits | `lib/journey-scroll.ts`, `lib/journey-scroll-speed.ts`, `scripts/journey-scroll-speed.test.ts` |
| Original 53-second instrumental and reproducible source | `public/audio/railway-theme.wav`, `scripts/compose-journey.py` |
| World typography, colors, responsive layouts | `app/world.css` |
| Interactive engineering models | `lib/engineering-scene.ts` |
| Spring response and tests | `lib/suspension-physics.ts`, `scripts/suspension-physics.test.ts` |

On systems with restrictive file-watcher limits, use `WATCHPACK_POLLING=true npm run dev -- --webpack`. The production build uses the standard `npm run build` command.

## Design and credits

Visual references: [Andrew Woan’s Minecraft portfolio](https://github.com/andrewwoan/woan-minecraft-folio), [Arshad’s voxel house](https://www.arshadakl.in/projects/minecraft-portfolio), and [Create-style copper locomotives](https://createmod.com/schematics/copper-locomotive). The reference informed the camera rig, quaternion rotation buffer, and coherent architecture. Geometry, pixel textures, and choreography here are original.

Portfolio text remains selectable semantic HTML, projected with Three.js CSS3DRenderer using the same camera as the small stone-and-copper station alcoves. Each alcove resizes to its full page after fonts and device orientation change. Opaque reading pages rotate on copper spindles as the camera passes, so transitions retain solid text instead of ghosting over scenery. Phone rotation rebases page position to preserve the current actor and camera pose. The About station includes the original portrait and favourite quote; the guide wears a matching black shirt, squared glasses, block curls and short beard. Low, broad voxel clouds drift gently over the railway. One smoothed coordinate drives reversible train, walking, boarding, flight, and docking poses; land and orbit occupy the same world coordinates. Tests check chapter-boundary continuity and equivalent motion at 30, 60, and 144 Hz.

The original 16-bar tune uses synthesized piano, soft sustained chords, and circular echo tails. It is bundled locally, loops, starts only when the visitor enables it, and can be muted at any time. The composition can be regenerated with `python3 scripts/compose-journey.py`; no external recordings are used.

The world and all its block geometry are generated locally in Three.js; no game textures or external 3D assets are required. The design uses pixel grass, timber, copper, blue daylight, and a starfield, and locally hosted Pixelify Sans for pixel display typography. The journal retains its reading typography and image credits. Font licenses are in `public/fonts/`, including the Pixelify Sans SIL Open Font License. The previous project photography remains credited in its case studies and in `docs/project-photo-assets.json`.


- **Earthrise:** Bill Anders / NASA, Apollo 8, 24 December 1968. [NASA source](https://science.nasa.gov/resource/apollo-8s-iconic-earthrise/) and [media-use policy](https://www.nasa.gov/nasa-brand-center/images-and-media/). Used for editorial illustration; no NASA endorsement is implied.
- **Animal Locomotion, Plate 49:** Eadweard Muybridge, 1880s. The Metropolitan Museum of Art, Rogers Fund, transferred from the Library, 1991.1135.7. [Collection record](https://www.metmuseum.org/art/collection/search/266437), public domain / [CC0 Open Access](https://www.metmuseum.org/hubs/open-access).

Current stack: Next.js, React, TypeScript, Vercel Functions, private Vercel Blob, and signed owner sessions. Articles render with react-markdown and remark-gfm; raw HTML and executable link protocols are not rendered.

The public résumé is the exact user-supplied `Mithul_Sourav_MIT_SM_Research_CV (2).pdf`. Its single completed Actuated Knee Assistance System project spans October 2025–September 2026. NeoLeg’s passive mechanism and KneeAssist’s actuated brace are presented as one case study at `/work/kneeassist`; the former NeoLeg URL redirects there. Procurement readiness is distinct from the planned bench tests.
