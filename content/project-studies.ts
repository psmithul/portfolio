// Project write-ups draw on the original reports, project records, and CV.
export const projectStudies: Record<string, string> = {
  'nitk-battle-bots': String.raw`
## 3 lb flipper

For the 3 lb class, we designed the chassis and flipper together. We liked the rear-hinged lifter on Jelly Baby and used it as a starting point. At that weight, every separate part was another piece we had to make and fit, so we went with a one-piece chassis. That kept the build simpler and cheaper for the team. [Jelly Baby’s NHRL profile](https://wiki.nhrl.io/wiki/index.php?title=Jelly_Baby).

## GN4RLY 2.5 (15 kg)

Sponsorship gave us room to use stronger materials on GN4RLY 2.5. The workbench photo shows what had to fit in the frame. The hammer saw sits in the centre, the chain drives run along the sides, and the wiring is still exposed during assembly.

![GN4RLY 2.5 on a workbench with the central weapon assembly, side chain drives and wiring exposed.](/images/projects/gn4rly-2-5-assembly.jpg)

_GN4RLY 2.5 during assembly. Photo from the NITK Battle-Bots club proposal._

### Why GN4RLY 2.5 fell short

We carried over a hammer design we had made two years earlier. At the event, the weight of the robot and the older assembly held us back, and we couldn’t advance to later rounds. We needed a redesign, but the money left after the build wouldn’t cover fabrication.

## Next GN4RLY (7 kg)

We’re working on a 7 kg successor. This time we’re thinking about how the whole robot fits together early in the design, including how much of the weight each assembly takes up and what we’ll need to reach for repairs.
`,
  'uav-vibration-integration': String.raw`
## Comparing the mounts in ANSYS

At Vayu Aerospace, I followed the vibration from the motors, through the airframe, to the flight controller’s IMU. I compared three ways to mount the controller in ANSYS. The rigid mount gave me a baseline for the elastomer tray and the suspended mount. I looked at where each assembly might resonate and how much of that motion would reach the controller.

## Fitting the mounts into the aircraft

I checked the controller orientation, fasteners, and clearances on the shortlisted mounts. I checked cable slack too because a tight cable can carry vibration around the isolator.

## Reading the ground-test logs

We ran the motors on the ground and recorded the IMU. I used MATLAB to compare equivalent portions of the runs. The RMS values gave me the overall vibration level, and the FFT spectra showed which peaks contributed to it. The team used those logs, the ANSYS results, and the installation checks to choose the elastomer-isolated modular tray.
`,
  'adaptive-suspension-rover': String.raw`
## Why change the suspension?

A rover on a rough inspection route can slow down to get steadier camera and sensor data. We wanted to see if it could keep more of its speed by changing how the suspension responds to bumps.

## How one suspension module works

Follow the wheel carrier in the CAD view above. As the wheel rises, the carrier pivots, three compression links change angle, and three elastic paths stretch and pull back. A separate damper helps the wheel settle after the bump.

We put one geared motor on each module to adjust the tension already in those elastic paths. The motor turns a fine-pitch screw. The guide rails keep the carriage from rotating, so it slides along the screw and changes the preload. There’s 6 mm of preload adjustment in the CAD. The wheel can move vertically by about 21 mm between −8° of droop and +20° of bump. Once the carriage is locked, the wheel moves passively.

![Interior CAD view of the six-wheel rover with the roof hidden to expose the mechanical assembly.](/images/projects/rover-interior-cad.png)

_With the roof off, you can see how all six modules fit around the central deck. [See the rover with the roof installed](/images/projects/rover-assembly-cad.png)._

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

The design above adds a motor-driven cable to load the spring and a sensor to track the knee angle. The thigh and shank cuffs sit on adjustable rails, with the drive and spring on one side. The user still extends their knee actively, and the cable and spring add assistance.

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

Starting with 36-coordinate training data helped when I had few 52-coordinate cases. The benefit went away with the largest training set. In a separate single-input experiment, adding an equilibrium term to the training loss lowered the balanced residual by 9.23%. The resonance results were mixed.

## Why I kept the original mount

I screened 17 mount stiffness settings. The neural model picked a 10% increase, so I checked that setting and the original against the 52-coordinate model on 36 separate scenarios. The worst response in that set changed by just **0.00589%**, while the largest neural peak error was **7.61%**. The difference was too small to justify changing the mount.

## Checks against the full COMSOL model

I compared the predictions with 14 full-model points across six configurations. Four of those points came from configurations held out of the original comparison. In a separate wheel-speed study, changing the mesh shifted the peak amplitude near 5,800 rpm by 0.33%. The current pilot still needs broader mesh and basis checks, measured wheel inputs and damping, and an experimental pointing test.
`,
  'off-road-leaf-robot': String.raw`
## Keeping the pickup close to the ground

I started with a simple problem. Wet leaves need to come off uneven ground, but lowering the pickup too far brings soil in with them. I separated terrain following from locomotion so I could think about how the pickup meets the surface as well as how the robot keeps traction.

## Getting the leaves to storage

Lifting a leaf is only the first step. The mechanism has to fit between the other parts of the robot and pass what it collects to the storage system. I compared concepts against the space available beside the wheels, how the parts could be made, and how they would connect to the transfer mechanism. I used the practical options to build a parts list from the individual components.

## Comparing the options

I plan to track traction, leaf pickup, soil pickup, and runtime. I’ll track the amount of leaf litter and soil separately so I can tell whether an option collects more leaves or just brings in more material.
`,
  'uncertainty-aware-navigation': String.raw`
## Giving the robot imperfect sensors

I built a differential-drive robot in Python simulation. A* plans a route, and a heading controller steers along it using the robot’s estimated position and orientation. I added encoder noise, IMU drift, yaw bias, and wheel slip. With slip, the wheels can turn without moving the robot as far as the encoders suggest.

## Using the pose estimate to decide when to slow down

An extended Kalman filter combines wheel encoder and IMU readings and tracks how uncertain the pose estimate is. I fed that uncertainty into the speed and recovery logic. If the estimate becomes less reliable, the simulated robot can slow down or try to recover before continuing.

## Monte Carlo evaluation

I ran repeated trials and compared the estimated pose with the simulator’s true pose. I also recorded collisions, recovery events, whether the robot reached the goal, and how long it took. That let me compare speed with how often the robot reached the goal without a collision.
`,
  'four-bar-door-mechanism': String.raw`
## Laying out the links

We started with the way we wanted the door to move, then chose the link lengths and pivot positions. Those decisions set the kinematic limits of the mechanism and how far the door could open.

## Trying the assembled mechanism

We made the links and pivots and assembled a working door opener. Checking its motion on the build made it easier to see how the positions of the pivots changed the path of the door and where it stopped.
`,
  'easy-access-wallet': String.raw`
## Starting with the card stack

When cards are packed closely together, it’s hard to get a finger far enough in to lift one. I used that motion as the starting point for a compact wallet concept.

## Leaving room to get a grip

I worked out where the stack needed support and where to leave clearance for a finger to reach a card. The resulting layout makes room for that motion while keeping the stack supported.
`,
  'solar-smart-home': String.raw`
## Getting the sensors to work together

I wired the sensors into an Arduino and wrote the logic for the model’s automated functions. I debugged the connections and code until the inputs and outputs worked together.

## Trying solar power

I added a photovoltaic cell as a second way to power the model and tested it on that supply. It was an early chance for me to work through the power, wiring, and control of one system.
`,
  'traffic-and-elevated-bus': String.raw`
## Wiring the traffic-light sequence

I built a model junction and used hand-wired logic gates to control the order of the signals. I traced the wiring until the signals followed the intended sequence.

## Building a separate bus circuit

The transit elevated-bus model had its own control circuit. I worked through wiring and logic faults on that build too, checking that the model could repeat its sequence.
`,
};
