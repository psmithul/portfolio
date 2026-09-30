# Portfolio asset provenance

Only verified project-specific assets are shown. No generic robot illustration or fabricated hardware photograph is used. When a project has no verified image, omit its `image` object in `content/projects.ts`.

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
