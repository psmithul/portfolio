# Portfolio asset provenance

Verified CAD views are used where available. At the user’s request, nine projects without imagery use temporary vector subject illustrations. These are explicitly identified as illustrations and do not depict the actual build, CAD, or measured results. No fabricated hardware photograph is used.

## Tensegrity joint

Published asset: `public/images/projects/tensegrity-joint-cad.webp` (1200 × 1200).

Source: `/Users/mika/projectd/Major project/output/Tensegrity_Leg_Fusion_V10_Production_Clearance_Actuation_v3/04_Knee_Joint_Fabrication_Clearance.png` (1900 × 1900). The package README and `STATIC_VERIFICATION.json` identify this screenshot. It is an existing CAD reconstruction for mechanism study, based on Mortensen et al., _Tensegrity-based Robot Leg Design with Variable Stiffness_ (2025), https://arxiv.org/abs/2504.19685. It is not a fabricated or tested prototype. Paper laboratory photographs IMG_0952/0953 were excluded because they depict the paper's hardware.

## Reaction-wheel study

Published asset: `public/images/projects/reaction-wheel-reference-cad.webp` (1500 × 1125).

Source: `/Volumes/Mithul/Codex/reaction-wheel-fem-ml/deliverables/client_cad_images/02_satellite_interior.png` (3840 × 2880). The original project's 51-solid STEP assembly and image hashes were checked against `render_manifest.json` and `image_file_checks.json`. The existing CAD render sections the reaction-wheel housing and removes exterior panels for visibility. Surface finishes are illustrative. It is a reference-CAD view, not hardware photography, a manufacturing drawing, or a FEM result.

## Portrait

Published asset: `public/images/mithul-cutout.webp` (1024 × 1536), with its alpha channel preserved. Source: `/Users/mika/Downloads/Candid Courtyard Portrait in Black 2.PNG`.

Edited with the built-in image tool; the edited PNG is retained at `/Users/mika/.codex/generated_images/01a081bf-cea9-7b11-8427-7025f4942b4b/exec-2289bedb-29a7-429c-bb59-42bfcc2e84fb.png`. The website uses a WebP encoding with preserved alpha, plus CSS framing and a small lower-edge fade. This is a portrait cutout, not a 3D scan or rigged avatar.

Exact edit prompt:

> Use case: background-extraction. Asset type: a transparent personal portrait cutout for Mithul's professional mechanical engineering portfolio. Edit target: the provided courtyard photograph. Primary request: Remove the entire courtyard, building, plants, ground, and all environmental background. Keep only the photographed man, exactly as in the source. The source person is the ONLY subject. Preserve his exact face, facial proportions, medium-brown skin, tousled wavy dark hair silhouette, clear rectangular dark-rim glasses, short moustache and beard, smile, body proportions, pose looking to his right, black shirt, black trousers, wristwatch, belt, hands and draped black jacket. Preserve the original photographic pixels and likeness as faithfully as possible; do not regenerate a new face, retouch the face, change his expression, replace clothes, add objects, or invent anatomy. Crop cleanly from just above the hair to mid-thigh with a small transparent margin on all sides; keep all shoulder and arm edges within the frame. Output a genuinely transparent RGBA background with clean, natural hair edges and no matte halo. Do not add a frame, colored card, gradient, ground plane, backdrop, environmental details, shadow outside the subject, text, watermark or extra person. Keep the portrait photographic so the original face remains recognizable; all visual motion will be done by the website.

## Additional gallery views

- `public/images/projects/reaction-wheel-cutaway.webp` is a WebP encoding of `/Volumes/Mithul/Codex/reaction-wheel-fem-ml/deliverables/client_cad_images/04_reaction_wheel_cutaway.png`. It shares the verified STEP source and presentation-image receipts described above.
- `public/images/projects/tensegrity-leg-cad.webp` is a WebP encoding of `/Users/mika/projectd/Major project/output/Tensegrity_Leg_SolidWorks_V11_Photo_Tilt_Print_Ready/Documentation/NATIVE_SOLIDWORKS_FRONT_VIEW.png`. It is the existing native SolidWorks view from the V11 package, a paper-based CAD reconstruction rather than tested hardware.

## Temporary project illustrations

Nine `public/images/projects/illustration-*.svg` files provide the requested temporary visuals for the rover, KneeAssist, leaf robot, NeoLeg, navigation simulation, four-bar linkage, Wallet Shield, smart-home model, and traffic/bus models. They are authored as simple vector subject illustrations and generated reproducibly with `node scripts/project-illustrations.mjs`. The colors are Wada combination 321, white, and an 8% yellow/white surface tint. Each visual says “PROJECT ILLUSTRATION”; the image captions and alt text also identify their scope. They are not source diagrams, CAD reconstructions, prototype photographs, or test plots. Replace the corresponding `illustration(...)` entry in `content/projects.ts` when real imagery becomes available.

## Café portrait

`public/images/mithul-cafe.webp` (1100 × 1375) is a resized WebP encoding of the user-supplied `/Users/mika/Downloads/ChatGPT Image Sep 6, 2026, 10_43_03 PM.PNG`. No semantic image edit, face generation, or retouching was applied. The website crops its display inside the secondary photo frame.

## Work-history folder

`public/images/work-folder.webp` (800 × 800, RGBA) is a generic decorative illustration for the experience section. It does not depict engineering work or a project prototype. Created with one built-in image generation call; the native 1254 × 1254 PNG is at `/Users/mika/.codex/generated_images/01a0f162-677f-7422-a41b-71c1c839f117/exec-9de4e389-1dbb-4eba-998d-93db568ab327.png`. The native alpha range is 0–255 and all corners are transparent. The WebP retains alpha.

Exact prompt:

```text
Use case: stylized-concept
Asset type: compact work-history section illustration for an engineering portfolio
Primary request: One polished 3D open file folder, a generic folder illustration rather than an image of any engineering project.
Scene/backdrop: Completely isolated with real alpha transparency; no visible backdrop or floor.
Subject: An open folder with both front and back visible, rounded corners, and one top-left tab. Two plain paper sheets emerge from the folder: one Pale Yellow #f5f5b8 sheet and one off-white sheet. The folder is Sanzo Wada Blue #96bfe6, with subtle Olive #172713 edge shading.
Style/medium: Polished restrained 3D render, satin material, softly rounded edges.
Composition/framing: Straight-on view with a slight view from above. Compact centered square composition. The complete folder and paper sheets fit comfortably inside the frame with all edges visible.
Lighting/mood: Soft studio lighting and a small natural contact shadow, preserved on the transparent canvas.
Constraints: Real alpha transparency. No text, no logos, no symbols, no floating decorations, no people, no charts, no neon. Single asset only.
```

## Reference fonts and recording

- Tanker regular comes directly from Fontshare's official API and CDN. Self-hosting is permitted in Section 01 of the included `public/fonts/Tanker-FFL.txt`; no font modification or conversion was performed.
- Space Grotesk Latin comes from Google Fonts, with its license in `public/fonts/SpaceGrotesk-OFL.txt`.
- The reference visit is recorded in `outputs/reference-visit/neha-reference-scroll.mp4`; browser screenshots and captured frames are in that same ignored output directory. Timing is adjusted for inspection. These reference captures are review artifacts and are not included in the portfolio or hosting archive.

## Mechanical hero, 30 September 2026

Four independent built-in ImageGen outputs were generated once each and visually inspected: a precision ball bearing, a dark steel compression spring, a rubber rover wheel, and a machined universal joint. They are generic decorative components, not project documentation. Original RGBA PNGs are preserved outside the Site; production copies are 720 px WebP encodings with their alpha retained. [Exact prompts, saved paths, dimensions, and alpha verification](mechanical-hero-assets.json).

The current opening pairs the original photographic cutout with the paper-based tensegrity study. The café portrait remains an unused source asset. Extra tensegrity-leg and reaction-wheel section views are now on the corresponding project pages. Ten labelled subject illustrations use restrained accents on transparent SVG backgrounds; they do not claim to depict built prototypes or measured data.
