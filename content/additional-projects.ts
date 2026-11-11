import type { Project } from './projects';

export const additionalProjects: (Project & { study: string })[] = [
  {
    slug: 'portfolio-website',
    title: 'Personal Portfolio',
    discipline: 'Web development',
    status: 'Ongoing',
    context: 'Personal project',
    tools: ['Next.js', 'TypeScript', 'Markdown'],
    summary:
      'I built this site to keep my project write-ups, original figures, and notes in one place.',
    scope:
      'The current site has separate About, Projects, and Build Log pages and a private writing desk.',
    study: `
## How it changed

Earlier versions used an interactive 3D journey. I moved to a simpler layout so the original CAD, photos, and results could do more of the work. Older project links still point to the current write-ups.

## How I publish

Project studies are written in Markdown. The writing desk saves drafts separately from published posts so I can revise an entry before sharing an update. [GitHub source](https://github.com/psmithul/portfolio).
`,
  },
  {
    slug: 'dayfold',
    title: 'Dayfold',
    discipline: 'Study and research tools',
    status: 'Ongoing',
    context: 'Personal software project',
    tools: ['Next.js', 'SQLite'],
    summary:
      'A study desk for planning work, reading papers, and keeping research notes connected to the pages they came from.',
    scope:
      'Dayfold has personal and shared desks. Its local preview stores notes and documents on the device.',
    study: `
## Reading and taking notes

Dayfold keeps PDF highlights, handwritten notes, and follow-up tasks close to the paper. Takeaways can point back to the exact source page and link to a project.

## Working together

Personal and shared items have separate desks. Shared focus sessions and notes help collaborators pick up work together and leave a clear next step.
`,
  },
  {
    slug: 'mikaverse',
    title: 'Mikaverse',
    discipline: 'Game development',
    status: 'Ongoing',
    context: 'Personal game project',
    tools: ['Minecraft Java', 'Fabric'],
    summary:
      'A Minecraft Java sandbox built around exploring settlements, travelling by rail, and bringing discoveries back to a shared home.',
    scope: 'The project runs as a Fabric-based world for small-group play.',
    study: `
## Making places worth visiting

Railways, towers, settlements, and old inscriptions give players reasons to leave home and see what is further down the line.

## Bringing things back

Discoveries have a place in the shared home. A rubbing of a script or a book can become part of a library the group builds over time.
`,
  },
  {
    slug: 'shadow-slayer',
    title: 'Shadow Slayer · The First Term',
    discipline: 'Game development',
    status: 'Ongoing',
    context: 'Personal Godot prototype',
    tools: ['Godot'],
    summary:
      'A playable world-generation prototype with two connected realms, seeded terrain and towns, and transport between settlements.',
    scope:
      'The current build is an exploration prototype with procedural geography and a separate first-crossing campaign.',
    study: `
## Building the world from a seed

Terrain and settlements are generated deterministically. The prototype streams nearby terrain and uses coarser geometry at a distance so the same world can extend well beyond the starting area.

## Making the world traversable

Players can walk between buildings, enter furnished rooms, and board trains or buses. Journey saves preserve the world seed and the player’s position so exploration can resume later.
`,
  },
  {
    slug: 'finite-element-beams-and-frames',
    title: 'Finite Element Analysis of Beams and Frames',
    discipline: 'Structural simulation',
    period: 'Nov 2026',
    status: 'Completed',
    context: 'ME311 Finite Element Method · NITK team coursework',
    tools: ['MATLAB', 'ANSYS'],
    summary:
      'We assembled beam and plane-frame models in MATLAB and used ANSYS results to check displacements, mesh convergence, and vibration modes.',
    scope:
      'The report covers static beam bending, free vibration, and plane-frame analysis.',
    study: `
## Assembling the models

We assembled the beam and frame systems from element matrices in MATLAB. We compared displacements and checked how the answers changed as we refined the mesh in ANSYS.

## Checking the vibration modes

We kept the beam span as a parameter in the modal calculation, then picked a 2 m span to compare the calculated modes with the ANSYS model.

![ANSYS result showing the first vibration mode of the two-metre beam.](/images/projects/fem-ansys-mode.png)

_First computed mode at 81.17 Hz for the 2 m check case. Figure 20 from the team report._
`,
  },
  {
    slug: 'nameless-banner',
    title: 'The Nameless Banner',
    discipline: 'Digital storytelling',
    period: 'Oct 2026',
    status: 'Past',
    context: 'Creative web project',
    tools: [],
    summary:
      'A vertical comic reader for a full-colour adaptation of The Nameless Banner.',
    scope: 'The reader contains the first three adapted chapters.',
    study: `
## Adapting the chapters

The comic divides the story at scene breaks that work in a vertical format. That sometimes puts a chapter break in a different place from the novel.

## Building the reader

The site packages the panels in reading order and keeps navigation focused on moving between chapters.
`,
  },
  {
    slug: 'feisteval-registration',
    title: 'FeISTEval Registration',
    discipline: 'Web development',
    period: 'Oct 2026',
    status: 'Past',
    context: 'ISTE NITK engineering festival',
    tools: ['React', 'Vite'],
    summary:
      'A mobile-first team registration flow for the festival, including its Scotland Yard mystery event.',
    scope:
      'Teams choose events, enter participant details, and receive a confirmation when registration goes through.',
    study: `
## Making sign-up easier on a phone

The form starts with the event choice and then asks one question at a time. Teams can choose multiple events in a single registration.

## Connecting to the festival

The page uses the festival’s carnival design. The confirmation gives the team the information it needs after signing up.
`,
  },
  {
    slug: 'iste-project-brochure',
    title: 'ISTE NITK Project Preview Brochure',
    discipline: 'Web development',
    period: 'Aug — Sep 2026',
    status: 'Past',
    context: 'ISTE NITK · Project recruitment',
    tools: ['React', 'TypeScript', 'Vite'],
    summary:
      'A searchable brochure that helps prospective members explore 40 projects across eight ISTE tracks.',
    scope:
      'The brochure gives each project a page for its brief and learning path.',
    study: `
## Organising the project roster

The brochure lets students browse by track or search by a topic or tool. Each result opens a brief that explains the problem, the work involved, and what a new member can learn.

## Keeping the index current

The catalogue follows the published project roster and can mark briefs that are still being written. [Open the brochure](https://club-project-showcase.vercel.app/) · [GitHub source](https://github.com/psmithul/iste-nitk-project-brochure).
`,
  },
  {
    slug: 'restia',
    title: 'Restia',
    discipline: 'Local-first software',
    period: '2026',
    status: 'Past',
    context: 'Self-hosted AI workspace',
    tools: ['Python', 'TypeScript'],
    summary:
      'A self-hosted workspace that brings model chat, projects, study tools, and documents together.',
    scope:
      'The public workspace grew out of separate web, desktop-style frontend, and Python service experiments.',
    study: `
## Bringing the workspace together

The early versions explored a web shell, a desktop-style dashboard, and Python services. Restia combines project boards, documents, study sessions, and AI chat so they can be used from the same workspace.

## Keeping the data close

The workspace is designed for self-hosting. Files and the database stay on the owner’s infrastructure. The published V2 screenshot shows the connection options between installations. [GitHub source](https://github.com/psmithul/restia).
`,
  },
  {
    slug: 'health-sync',
    title: 'Health-Sync',
    discipline: 'Mobile software',
    period: 'Jun 2026',
    status: 'Past',
    context: 'Mobile health-data prototype',
    tools: ['Apple HealthKit'],
    summary:
      'A mobile prototype for tracking activity and recovery using data from Apple HealthKit.',
    scope:
      'The prototype and accompanying research notes explore the data and formulas available for recovery tracking.',
    study: `
## Starting with recorded data

The prototype is designed around readings available through Apple HealthKit. That sets the boundary for what an activity or recovery view can calculate.

## Reviewing the measures

The accompanying notes compare approaches to recovery and strain. They provided a reference for deciding which measures were appropriate to explore in the app.
`,
  },
  {
    slug: 'hermes-memory-workspace',
    title: 'Hermes Memory Workspace',
    discipline: 'Knowledge management',
    period: 'Jun 2026',
    status: 'Past',
    context: 'Personal software experiment',
    tools: ['Obsidian', 'Markdown'],
    summary:
      'An Obsidian-based experiment in giving an assistant structured, long-term project context.',
    scope:
      'The workspace uses ordinary Markdown files and a consistent note structure.',
    study: `
## Structuring context

The workspace keeps short-lived daily context and longer-running notes in separate places so the assistant can find the level of detail a task needs.

## Keeping notes readable

The notes stay in Markdown so they can also be opened and reviewed directly in Obsidian.
`,
  },
  {
    slug: 'alive-workspace',
    title: 'Alive Workspace',
    discipline: 'Creative coding',
    period: 'Jun 2026',
    status: 'Past',
    context: 'Browser animation sketch',
    tools: ['p5.js', 'HTML Canvas'],
    summary:
      'A small animated scene that uses light, smoke, and drifting particles to make a quiet house and desk feel inhabited.',
    scope: 'The sketch draws the scene procedurally in the browser.',
    study: `
## Drawing a scene with a few shapes

The house and desk are assembled from simple geometry. Each window, monitor, and lamp uses a slightly different timing so the whole scene does not pulse together.

## Adding motion

The sketch uses seeded randomness and an animation loop for the drifting particles. The screenshot came from a local preview with the drawing errors fixed. [Original sketch on GitHub](https://github.com/psmithul/alive-workspace).
`,
  },
  {
    slug: 'iste-industry-analysis',
    title: 'Indian Liquor Industry Disruption Analysis',
    discipline: 'Research visualisation',
    period: 'Apr 2026',
    status: 'Past',
    context: 'ISTE NITK · Interactive research site',
    tools: ['React', 'TypeScript', 'Vite'],
    summary:
      'An interactive site presenting the team’s analysis of market dynamics, policy, and disruption in the Indian liquor industry.',
    scope: 'The website turns the research into navigable sections and charts.',
    study: `
## Making the analysis browsable

The site breaks the work into the market overview, disruption index, risk, policy, and team sections so a reader can go straight to the part they want to inspect.

## Presenting the team’s framework

The quantitative disruption index has a dedicated view alongside the qualitative discussion. [Open the site](https://isteproject.vercel.app/) · [GitHub source](https://github.com/psmithul/Isteproject).
`,
  },
  {
    slug: 'bondos',
    title: 'BondOS',
    discipline: 'Web application',
    period: 'Feb 2026',
    status: 'Past',
    context: 'Shared workspace prototype',
    tools: ['React', 'Vite', 'Supabase'],
    summary:
      'A private shared space designed around planning, notes, and check-ins for a pair of users.',
    scope:
      'The public entry screen leads to a prototype with account-based views.',
    study: `
## Designing for two people

The app puts shared items and personal check-ins in one account-based workspace. The design makes room for two people to build a routine together.

## Handling a new account

I replaced the sample content with empty states so a new account can start with its own data. [GitHub source](https://github.com/psmithul/bondos).
`,
  },
  {
    slug: 'connect-med-world',
    title: 'Connect Med World',
    discipline: 'Web prototype',
    period: 'Sep 2025',
    status: 'Past',
    context: 'Healthcare-facing website prototype',
    tools: ['React', 'TypeScript', 'Vite'],
    summary:
      'An early landing page prototype for explaining a healthcare service and helping visitors explore its specialties.',
    scope: 'The prototype focuses on the public information pages.',
    study: `
## Explaining the service

The landing page introduces the idea, highlights features, and gives the specialties a dedicated section.

## Building the page

The layout is made of reusable sections so the introduction, specialties, and feature summaries can be revised independently.
`,
  },
  {
    slug: 'thinkify-website',
    title: 'Thinkify Labs Website',
    discipline: 'Web development',
    period: 'May — Aug 2025',
    status: 'Past',
    context: 'Thinkify Labs · Website iterations',
    tools: ['Next.js', 'TypeScript'],
    summary:
      'A hiring website with separate paths for companies looking for engineering talent and developers looking for work.',
    scope:
      'The public repositories show several iterations of the landing page and talent website.',
    study: `
## Giving both audiences a clear path

The landing page has separate entry points for companies and developers. Each path leads to information and next steps for that audience.

## Iterating on the landing page

The later version reorganises the service and case-study sections around the hiring proposition. [Open the site](https://thinkify-2.vercel.app/) · [Later source](https://github.com/psmithul/thinkify-2) · [Earlier version](https://github.com/psmithul/thinkify).
`,
  },
  {
    slug: 'thinkify-intake',
    title: 'Thinkify Labs Hiring Intake',
    discipline: 'Web development',
    period: 'Jul — Aug 2025',
    status: 'Past',
    context: 'Thinkify Labs · Interactive forms',
    tools: ['Next.js', 'TypeScript', 'Framer Motion'],
    summary:
      'A step-by-step form with separate flows for companies and developers.',
    scope:
      'The form handles role selection, field validation, progress, and submission feedback.',
    study: `
## Choosing a path

The first screen asks whether the visitor is hiring or looking for work. Their choice controls the questions that follow.

## Making a longer form manageable

The form presents one question at a time, shows progress, and lets people return to an earlier answer before submitting. [Open the intake](https://psmithul-github-io.vercel.app/) · [GitHub source](https://github.com/psmithul/psmithul.github.io).
`,
  },
  {
    slug: 'nh66-fund-website',
    title: 'NH66 Fund Website',
    discipline: 'Web development',
    period: 'Jul 2025',
    status: 'Past',
    context: 'NH66 Fund · NITK',
    tools: ['Next.js', 'React', 'Recharts'],
    summary:
      'Website and recruitment work for NITK’s student investment fund, with a dashboard prototype for presenting strategy and performance.',
    scope:
      'The public repository documents the fund-site design. The live screenshot shows the recruitment page.',
    study: `
## Presenting the fund

The website prototype uses charts and sections for the fund’s strategy, team, and research. The charts in the prototype are interface examples.

## Giving recruitment a clear entry point

The recruitment page introduces the fund and gives interested students a starting point. [Open the recruitment page](https://nh66.vercel.app/) · [Website source](https://github.com/psmithul/nh66).
`,
  },
  {
    slug: 'kendraa',
    title: 'Kendraa',
    discipline: 'Web prototype',
    period: 'Jul 2025',
    status: 'Past',
    context: 'Professional networking interface experiment',
    tools: ['Next.js', 'TypeScript'],
    summary:
      'A LinkedIn-style interface prototype exploring how a professional network might be organised.',
    scope:
      'The repository contains a web prototype with separate account and dashboard layouts.',
    study: `
## Sketching the interface

I explored a familiar professional-network layout and set up a separate entry flow and signed-in shell.

## Organising the prototype

The repo keeps the account and dashboard routes in their own layout groups. [GitHub source](https://github.com/psmithul/kendraa).
`,
  },
  {
    slug: 'thinkify-quiz',
    title: 'Thinkify Quiz Platform',
    discipline: 'Learning software',
    period: 'May — Jun 2025',
    status: 'Past',
    context: 'Thinkify Labs · Learning platform',
    tools: ['Next.js', 'TypeScript', 'Supabase'],
    summary:
      'A learning platform that grew from an early quiz app into a site for quizzes, courses, and creator tools.',
    scope:
      'The public build includes learner-facing quiz and course pages alongside tools for creating content.',
    study: `
## Starting with the quiz flow

The first repo focused on creating and taking quizzes. The later build added a course catalogue, learner progress, and tools for creators to manage their material.

## Giving visitors a way to browse

The public entry page lets people explore the learning platform before choosing an account flow. [Open the platform](https://thinkify-quiz.vercel.app/) · [GitHub source](https://github.com/psmithul/thinkify-quiz) · [Early quiz app](https://github.com/psmithul/quiz-app).
`,
  },
  {
    slug: 'number-guessing-game',
    title: 'Number Guessing Game',
    discipline: 'Python exercise',
    period: 'Aug 2023',
    status: 'Past',
    earlierWork: true,
    context: 'Early programming project',
    tools: ['Python'],
    summary:
      'A small command-line guessing game from my early Python practice.',
    scope: 'The program runs in the terminal.',
    study: `
## The idea

The exercise turns a simple number-guessing game into a Python program with a command-line interface.

## The original code

The single-file exercise is preserved in [the original GitHub repository](https://github.com/psmithul/megahome).
`,
  },
];
