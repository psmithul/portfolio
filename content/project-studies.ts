// Project write-ups draw on the original reports, project records, and CV.
export const projectStudies: Record<string, string> = {
  'fireworks-galaxy': String.raw`
## Choosing a comparison galaxy

At CFAL Astronomy Club, I started with an exercise on the centres of nearby galaxies. The restored notebook uses NGC 4826, the Black Eye Galaxy, for the literature survey. It has a dark dust band across one side of its bright centre. Does that band have lower contrast in the near infrared than in visible light? That’s a question I could test with matched images. For the hands-on analysis, I worked with the Fireworks Galaxy, NGC 6946, from the same Hubble survey. [Hubble’s Black Eye Galaxy overview](https://science.nasa.gov/missions/hubble/hubble-looks-at-a-a-black-eye-galaxy/) · [NICMOS survey](https://arxiv.org/abs/astro-ph/9903307).

## Reading the Hubble frame

The original notebook pointed to one 256 × 256 F160W exposure taken on 19 January 1998. The science plane gives counts per second, and the data-quality plane records which pixels are flagged. I kept 65,045 usable pixels out of 65,536. Their count rates ranged widely, with a median of 1.96 counts/s and a 98th percentile of 11.24 counts/s. I applied a display stretch so I could see the fainter field around the bright centre. [Original FITS exposure from MAST](https://mast.stsci.edu/api/v0.1/Download/file?uri=mast%3AHST%2Fproduct%2Fn4k48nbsq_cal.fits).

![A detector map marks the 491 excluded pixels and a histogram shows the usable count rates on a logarithmic frequency axis.](/images/projects/fireworks-quality.png)

_The detector mask shows where data were excluded, including near the bright centre. The histogram shows the strong tail toward higher count rates. [Open the full-size figure](/images/projects/fireworks-quality.png)._

## Zooming in on the nucleus

I started with the full detector frame and made three progressively tighter crops. The wide view helped me find the bright patch, and the tightest crop let me look at its shape. In the original plot, each panel uses its own colour scaling. When I revisited the notebook, I used a shared stretch and marked flagged pixels so I could compare the views more directly.

![Three panels from the original notebook show the wide, zoomed, and nucleus crops in the same blue-to-yellow palette.](/images/projects/fireworks-original-crops.png)

_The three crops from my original notebook. [Open the full-size plot](/images/projects/fireworks-original-crops.png) or [see the crops with a shared stretch and quality mask](/images/projects/fireworks-field.png)._

## Finding the centre

I mapped the catalogued infrared position onto the detector before drawing the cutouts. The brightest usable pixel landed about 0.41 arcseconds from that position. Before any ridge filtering, the median count rate was 55.58 counts/s within five pixels of the centre and 4.15 counts/s in the ring from 30 to 60 pixels. Those values describe the usable pixels in each region. [SIMBAD position for NGC 6946](https://simbad.cds.unistra.fr/simbad/sim-basic?Ident=NGC+6946).

![A line plot shows the median F160W count rate declining with distance from the catalogued galaxy centre.](/images/projects/fireworks-profile.png)

_Median count rate in successive rings around the centre. The shaded area spans the 25th to 75th percentiles of usable pixels. [Open the full-size profile](/images/projects/fireworks-profile.png)._

## Trying two ridge filters

I tried Sato and Meijering on each crop to see how they would pick up narrow features. Both filters were set to look for dark ridges in these first plots. The shapes around the bright patch changed with the filter, which gave me a reason to check the results against the original image and try the bright-ridge setting as well.

![Three crops from the original notebook show the Sato dark-ridge response in the hot palette.](/images/projects/fireworks-original-sato.png)

_My first Sato comparison. [Open the full-size plot](/images/projects/fireworks-original-sato.png)._

![The same three crops show the Meijering dark-ridge response in the hot palette.](/images/projects/fireworks-original-meijering.png)

_My first Meijering comparison. [Open the full-size plot](/images/projects/fireworks-original-meijering.png)._

## Comparing the filters

When I revisited the notebook, I ran both filters in bright-ridge mode on the full frame, then took the same 96-pixel cutout from each result. Sato gives a broader response around the centre, while Meijering concentrates the strongest response more tightly. Within each row, I kept the scaling fixed across grayscale, hot, magma, viridis, and cividis so I could see what the palette alone changed.

![Fifteen panels compare the calibrated image and two ridge filter responses across five colormaps.](/images/projects/fireworks-filters.png)

_The first row shows the F160W image. The next two show the Sato and Meijering responses. [Open the full-size comparison](/images/projects/fireworks-filters.png)._

## What I learned

I used to start by changing the colours until I could see more detail. This project taught me to check which pixels I could trust first. Some flagged pixels sit right beside the bright centre, so the quality mask changed how I read the image.

Using a catalogued position gave me a way to check where the bright patch actually was. Measuring the light in rings around that position let me describe how quickly it fell off. I could already see the central brightening in the calibrated image, and the filters helped me decide where to look more closely. To find out what produces that light, I’d need observations at other wavelengths.

## Run the notebook

The restored notebook includes the literature survey, data checks, and code for all four figures. It retrieves the original calibrated exposure from the public Hubble archive. [Open in Google Colab](https://colab.research.google.com/github/psmithul/portfolio/blob/main/public/notebooks/Astroclub_Fireworks_Galaxy.ipynb) · [Download the notebook](/notebooks/Astroclub_Fireworks_Galaxy.ipynb).

Data credit goes to the NASA/ESA Hubble Space Telescope and the Mikulski Archive for Space Telescopes.
`,
  'nitk-battle-bots': String.raw`
## 3 lb flipper

For the 3 lb class, we designed the chassis and flipper together. We liked the rear-hinged lifter on Jelly Baby and used it as a starting point. At that weight, every separate part was another piece we had to make and fit, so we went with a one-piece chassis. That kept the build simpler and cheaper for the team. [Jelly Baby’s NHRL profile](https://wiki.nhrl.io/wiki/index.php?title=Jelly_Baby).

![The bare black chassis of the 3 lb flipper on a wooden table.](/images/projects/3-lb-flipper-chassis.jpg)

_The one-piece chassis before assembly. [Full-size photo](/images/projects/3-lb-flipper-chassis.jpg)._

![The open 3 lb robot chassis held above the workbench with the battery and wiring visible.](/images/projects/3-lb-flipper-assembly.jpg)

_The same chassis during assembly, with the battery and electronics fitted. [Full-size photo](/images/projects/3-lb-flipper-assembly.jpg)._

## GN4RLY 2.5 (15 kg)

Sponsorship gave us room to use stronger materials on GN4RLY 2.5. The workbench photo shows what had to fit in the frame. The hammer saw sits in the centre, the chain drives run along the sides, and the wiring is still exposed during assembly.

![GN4RLY 2.5 on a workbench with the central weapon assembly, side chain drives and wiring exposed.](/images/projects/gn4rly-2-5-assembly.jpg)

_GN4RLY 2.5 during assembly. Photo from the NITK Battle-Bots club proposal._

![NITK Battle Bots members with one of their robots at a competition.](/images/projects/nitk-battle-bots-event.jpeg)

_Our NITK Battle Bots team at the event._

### Why GN4RLY 2.5 fell short

We carried over a hammer design we had made two years earlier. At the event, the weight of the robot and the older assembly held us back, and we couldn’t advance to later rounds. We needed a redesign, but the money left after the build wouldn’t cover fabrication.

## Next GN4RLY (7 kg)

We’re working on a 7 kg successor. This time we’re thinking about how the whole robot fits together early in the design, including how much of the weight each assembly takes up and what we’ll need to reach for repairs.
`,
  'uav-vibration-integration': String.raw`
## Comparing the mounts in ANSYS

At Vayu Aerospace, I followed the vibration from the motors, through the airframe, to the flight controller’s IMU. I compared three ways to mount the controller in ANSYS. The rigid mount gave me a baseline for the elastomer tray and the suspended mount. I looked at where each assembly might resonate and how much of that motion would reach the controller.

![Three simplified sections showing a rigid mount, an elastomer-isolated tray, and a suspended controller.](/images/projects/process-uav-mounts.webp)

_Design schematic of the three mounting arrangements. The rigid mount provided the baseline for the two isolation concepts._

## Fitting the mounts into the aircraft

I checked the controller orientation, fasteners, and clearances on the shortlisted mounts. I checked cable slack too because a tight cable can carry vibration around the isolator.

## Reading the ground-test logs

We ran the motors on the ground and recorded the IMU. I used MATLAB to compare equivalent portions of the runs. The RMS values gave me the overall vibration level, and the FFT spectra showed which peaks contributed to it. The team used those logs, the ANSYS results, and the installation checks to choose the elastomer-isolated modular tray.
`,
  'adaptive-suspension-rover': String.raw`
## Why change the suspension?

A rover on a rough inspection route can slow down to get steadier camera and sensor data. We wanted to see if it could keep more of its speed by changing how the suspension responds to bumps.

In our first proposal, two coupled suspension units would shift a cable guide between three settings. Moving that guide changed the spring’s leverage. The later CAD uses a separate motor and preload carriage at each wheel. We kept the idea of locking a setting before moving again.

![The team’s September whiteboard with suspension sketches and notes on vibration and control.](/images/projects/rover-proposal-whiteboard.webp)

_Our September concept notes, before we developed the individual wheel modules. Photo from the CY06 design submission. [Open the full-size whiteboard photo](/images/projects/rover-proposal-whiteboard.webp)._

## How one suspension module works

As the wheel rises, the carrier pivots, three compression links change angle, and three elastic paths stretch and pull back. A separate damper helps the wheel settle after the bump.

We put one geared motor on each module to adjust the tension already in those elastic paths. The motor turns a fine-pitch screw. The guide rails keep the carriage from rotating, so it slides along the screw and changes the preload. The CAD gives the carriage 6 mm of adjustment. Once the carriage is locked, the wheel moves passively.

![Exploded CAD of the wheel, carrier, tension and compression mechanism, and preload assembly.](/images/projects/rover-suspension-exploded.webp)

_Exploded module. The wheel carrier, elastic core, and preload assembly are shown apart. [Open the CAD view](/images/projects/rover-suspension-exploded.webp)._

![CAD detail of the rover’s preload carriage with transparent sides and an orange top.](/images/projects/rover-preload-carriage.webp)

_The carriage detail exposes the screw and guides that turn motor rotation into linear travel. [Open the CAD detail](/images/projects/rover-preload-carriage.webp)._

## Checking wheel travel in CAD

We posed the same module at neutral and at +20° of bump to see what moved inside the joint. The wheel centre rises about 16 mm in that comparison. From −8° of droop to +20° of bump, the CAD shows about 21 mm of vertical wheel travel. The loaded fixture will show how that motion changes under real forces.

![Original CAD motion study showing the suspension in the neutral position.](/images/projects/rover-motion-neutral.webp)

_Neutral position at 0°. [Open the neutral view](/images/projects/rover-motion-neutral.webp)._

![Original CAD motion study showing the same suspension in the raised position.](/images/projects/rover-motion-bump.webp)

_The same module at +20° of bump. [Open the bump view](/images/projects/rover-motion-bump.webp)._

## Fitting six modules around the chassis

After designing the joint on its own, we placed six modules around the central deck. The roof-off view makes that layout visible. The closed view shows how the wheels and body fit together in the full assembly.

![Interior CAD view of the six-wheel rover with the roof hidden to expose the mechanical assembly.](/images/projects/rover-interior-cad.png)

_Full assembly with the roof hidden. [Open the interior view](/images/projects/rover-interior-cad.png)._

![Exterior CAD of the six-wheel rover with the roof installed.](/images/projects/rover-assembly-cad.png)

_The same rover with the roof installed. [Open the exterior view](/images/projects/rover-assembly-cad.png)._

## What the controller measures

We put accelerometers on the middle wheel carriers and the chassis in the sensor layout. The carrier readings tell us what the wheels are hitting. The chassis reading tells us how much of that movement reaches the body. Wheel encoders give us speed, and the chassis IMU tracks roll and pitch.

The planned sequence is to stop if vibration stays high, adjust the preload, and confirm the new position and lock before moving again. If the vibration stays high after the change, the rover can slow down.

## How we’ll test it

We’ll start with one loaded module and measure how much force it takes to move the wheel at different preload settings. We’ll also cut power under load to check that the lock holds.

For the rover trials, we’ll compare fixed preload, speed control, preload control, and the two controls together. We’ll use the same track and payload and repeat each setting at least three times. We’re aiming for **at least 20% lower vertical chassis RMS acceleration** in the 5–100 Hz band at the same speed as the fixed-preload run. We’ll also record route time and energy per metre.
`,
  'tensegrity-joint': String.raw`
## How the support network is arranged

I started with two Y-frames and a floating tristar. Each tristar tip connects to all four frame tips, giving 12 support tendons. The tristar’s arms are 120° apart, and the four frame tips sit on the intended flexion axis. The drawing shows where the tendons sit at 60° of knee flexion. I drew on a tensegrity leg study by Mortensen and colleagues for the layout. [Read the study](https://arxiv.org/abs/2504.19685).

![The two Y-frames and central tristar shown individually at a common CAD scale.](/images/projects/tensegrity-knee-step-parts.webp)

_The three rigid parts rendered from my STEP files. Their connection points establish where the support tendons can attach._

![Side and front drawings of the femoral and tibial Y-frames, floating tristar, and support tendons at the reference pose.](/images/projects/tensegrity-knee-geometry.png)

_The front view shows where each tendon attaches. The side view shows the two frames at the reference pose. [Open the full-size drawing](/images/projects/tensegrity-knee-geometry.png)._

## Member-force analysis

I used MATLAB to see how the tendons share a load as I change the geometry and preload. A tendon can only pull. If the calculation shows that one needs to push to hold the joint in position, that tendon would go slack.

In one static sizing case, I applied an assumed 3.2 kN horizontal load and 5.25 kN vertical load in the model. The calculated tensions ranged from **0.50 to 5.69 kN per support span**. That spread is what I look for when I change preload. Adding tension helps keep the lightest-loaded span taut, but it also asks more of the tristar and frame connections before an external load is applied.

## Checking the geometry before a build

I’m using those calculations to narrow the layouts worth building. The next fit check is to move the assembly through its intended flexion range and see where the tendons or fittings come close to the frames. On the bench, I plan to measure load and displacement and repeat the test to see how consistently the joint responds.
`,
  kneeassist: String.raw`
## From a spring to a motor-driven brace

We started with a passive spring-assisted knee mechanism. We moved the spring attachment points in SolidWorks and ANSYS to see what happened as the knee bent. Two things mattered in each position. The spring needed enough leverage to assist the knee, and the parts needed room to move through the full range.

The later design adds a motor-driven cable to load the spring and a sensor to track the knee angle. The thigh and shank cuffs sit on adjustable rails, with the drive and spring on one side. The user still extends their knee actively, and the cable and spring add assistance.

![Block diagram comparing a spring loaded by knee motion with a spring loaded by a motor and cable.](/images/projects/process-knee-assist.webp)

_Design schematic of the change from the passive spring concept to the actuated layout shown in the CAD above._

## How the brace helps the knee extend

As the spring stretches, it pulls harder. The angle of the cable also changes as the knee moves, which changes its leverage about the pivot. That’s why the spring force alone couldn’t tell us how much assistance the brace would provide throughout the motion.

We also designed an independent manual release. If the drive jams, the user needs a way to release the mechanism without moving the motor.

## Taking the design to the bench

Our team placed in the top 5 of 70 teams nationwide in the Incubate X Prosthetic Challenge. The design is ready for procurement. We’ll start bench testing by comparing the sensor’s angle reading and the spring force with independent measurements. Then we’ll check assisted motion, manual release under a jam, fault response, and repeated cycles.
`,
  'reaction-wheel-microvibrations': String.raw`
## Following the vibration to the camera

I started with a free-floating spacecraft model in COMSOL. At each of four reaction wheels, I applied two transverse force inputs and two moment inputs, giving 16 inputs in all. For camera tilt, I compared the average motion at two stations on the camera support about 0.48 m apart and removed the spacecraft’s overall rotation. The resulting angle is a structural estimate of pointing motion.

## A smaller model for repeated calculations

The original mesh had about 1.01 million volume elements. To run many configurations over 5–20 Hz, I built a smaller model using 36 natural modes. I added 16 corrections for bending around the camera support that the first version missed. Those 52 coordinates became the reference for training and comparing the neural models.

![Log-scale plot of response differences as more coordinates are retained in the reduced model.](/images/projects/wheel-basis-enrichment.png)

_The basis-enrichment study compares smaller models with the 52-coordinate reference. Figure 2 from the 5–20 Hz report. [Open the full-size plot](/images/projects/wheel-basis-enrichment.png)._

## Comparing MLP, DeepONet, and physics-informed models

I kept whole structural configurations together when splitting the data. A model that has seen one part of a frequency curve has already seen the structure behind the rest of the curve.

The multilayer perceptron (MLP) came closest to the 52-coordinate reference in the original comparison. The table reports mean frequency-integrated complex-response errors on three unseen configurations, with all 16 inputs tested on each.

| Response | MLP | DeepONet |
| --- | ---: | ---: |
| Camera displacement | 0.139% | 0.342% |
| Optical bench displacement | 0.171% | 0.378% |
| Structural tilt | 0.261% | 0.701% |

![Three response plots over 5–20 Hz showing near-overlapping reduced-model, MLP, and DeepONet curves for camera and bench displacement and a structural tilt peak just below 10 Hz.](/images/projects/reaction-wheel-held-out-response.png)

_The bottom panel shows the camera support’s tilt peaking just below 10 Hz in one unseen configuration. This is Figure 3 from the 5–20 Hz research report. [Open the full-size plot](/images/projects/reaction-wheel-held-out-response.png)._

## Trying a different way to train

Starting with 36-coordinate training data helped when I had few 52-coordinate cases. The benefit went away with the largest training set. In a separate single-input experiment, adding an equilibrium term to the training loss lowered the balanced residual by 9.23%. The resonance results were mixed.

![Two learning curves comparing reference-only training with pretraining and refinement at three training budgets.](/images/projects/wheel-training-comparison.png)

_The learning curves show how pretraining changes the error as more reference cases become available. Figure 6 from the 5–20 Hz report. [Open the full-size plot](/images/projects/wheel-training-comparison.png)._

## Why I kept the original mount

I screened 17 mount stiffness settings. The neural model picked a 10% increase, so I checked that setting and the original against the 52-coordinate model on 36 separate scenarios. The worst response in that set changed by just **0.00589%**, while the largest neural peak error was **7.61%**. The difference was too small to justify changing the mount.

![Neural screening curve alongside two nearly equal bars from the separate reduced-model confirmation.](/images/projects/wheel-mount-comparison.png)

_The neural screen on the left suggested a stiffer mount. The confirmation on the right showed how little the response changed. Figure 11 from the 5–20 Hz report. [Open the full-size plot](/images/projects/wheel-mount-comparison.png)._

## Checks against the full COMSOL model

I compared the predictions with 14 full-model points across six configurations. Four of those points came from configurations held out of the original comparison. In a separate wheel-speed study, changing the mesh shifted the peak amplitude near 5,800 rpm by 0.33%. The current pilot still needs broader mesh and basis checks, measured wheel inputs and damping, and an experimental pointing test.
`,
  'off-road-leaf-robot': String.raw`
## Keeping the pickup close to the ground

I started with a simple problem. Wet leaves need to come off uneven ground, but lowering the pickup too far brings soil in with them. I separated terrain following from locomotion so I could think about how the pickup meets the surface as well as how the robot keeps traction.

## Getting the leaves to storage

Lifting a leaf is only the first step. The mechanism has to fit between the other parts of the robot and pass what it collects to the storage system. I compared concepts against the space available beside the wheels, how the parts could be made, and how they would connect to the transfer mechanism. I used the practical options to build a parts list from the individual components.

![Flow diagram connecting terrain following to leaf pickup, then transfer and storage.](/images/projects/process-leaf-collection.webp)

_Design schematic showing where terrain following affects the pickup and how the leaves move to storage._

## Comparing the options

I plan to track traction, leaf pickup, soil pickup, and runtime. I’ll track the amount of leaf litter and soil separately so I can tell whether an option collects more leaves or just brings in more material.
`,
  'uncertainty-aware-navigation': String.raw`
## Giving the robot imperfect sensors

I built a differential-drive robot in Python simulation. A* plans a route, and a heading controller steers along it using the robot’s estimated position and orientation. I added encoder noise, IMU drift, yaw bias, and wheel slip. With slip, the wheels can turn without moving the robot as far as the encoders suggest.

## Using the pose estimate to decide when to slow down

An extended Kalman filter combines wheel encoder and IMU readings and tracks how uncertain the pose estimate is. I fed that uncertainty into the speed and recovery logic. If the estimate becomes less reliable, the simulated robot can slow down or try to recover before continuing.

![Flow diagram showing the route and pose uncertainty feeding the robot’s heading, speed, and recovery logic.](/images/projects/process-robot-navigation.webp)

_Design schematic of the simulator. The planned route and the confidence in the pose both inform how the robot moves._

## Monte Carlo evaluation

I ran repeated trials and compared the estimated pose with the simulator’s true pose. I also recorded collisions, recovery events, whether the robot reached the goal, and how long it took. That let me compare speed with how often the robot reached the goal without a collision.
`,
  'four-bar-door-mechanism': String.raw`
## Laying out the links

We started with the way we wanted the door to move, then chose the link lengths and pivot positions. Those decisions set the kinematic limits of the mechanism and how far the door could open.

![A schematic four-bar linkage in two positions with the two fixed pivots staying in place.](/images/projects/process-four-bar.webp)

_Design schematic showing two positions of a four-bar linkage. The fixed pivots stay in place as the three moving links change angle._

## Trying the assembled mechanism

We made the links and pivots and assembled a working door opener. Checking its motion on the build made it easier to see how the positions of the pivots changed the path of the door and where it stopped.
`,
  'easy-access-wallet': String.raw`
## Starting with the card stack

When cards are packed closely together, it’s hard to get a finger far enough in to lift one. I used that motion as the starting point for a compact wallet concept.

## Leaving room to get a grip

I worked out where the stack needed support and where to leave clearance for a finger to reach a card. The resulting layout makes room for that motion while keeping the stack supported.

![Two card-holder diagrams showing a flush stack and an opening that exposes part of the stack.](/images/projects/process-card-access.webp)

_Design schematic of the finger-clearance idea. The opening lets a finger reach the stack while the surrounding pocket supports it._
`,
  'solar-smart-home': String.raw`
## Getting the sensors to work together

I wired the sensors into an Arduino and wrote the logic for the model’s automated functions. I debugged the connections and code until the inputs and outputs worked together.

## Trying solar power

I added a photovoltaic cell as a second way to power the model and tested it on that supply. It was an early chance for me to work through the power, wiring, and control of one system.

![Block diagram of the solar cell and sensor inputs connected to the Arduino-controlled model.](/images/projects/process-solar-home.webp)

_Design schematic showing the added solar supply alongside the sensor and control system._
`,
  'traffic-and-elevated-bus': String.raw`
## Wiring the traffic-light sequence

I built a model junction and used hand-wired logic gates to control the order of the signals. I traced the wiring until the signals followed the intended sequence.

## Building a separate bus circuit

The transit elevated-bus model had its own control circuit. I worked through wiring and logic faults on that build too, checking that the model could repeat its sequence.

![Two rows showing separate hand-wired control circuits for the traffic lights and elevated bus.](/images/projects/process-traffic-and-bus.webp)

_Design schematic showing the two independent control circuits and what each one sequences._
`,
};
