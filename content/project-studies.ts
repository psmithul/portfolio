// Project descriptions use the CV and original design/research material.
// Equations describe the models; they do not stand in for experimental evidence.
export const projectStudies: Record<string, string> = {
  'nitk-battle-bots': String.raw`
## 3 lb flipper

We took inspiration from [Jelly Baby](https://wiki.nhrl.io/wiki/index.php?title=Jelly_Baby), an NHRL robot with a rear-hinged lifter. For our 3 lb flipper, we made the main chassis as a unibody. That choice kept the number of separate parts down, which made the chassis simpler and cheaper for us to make. The flipper was a team design, and we worked on the chassis and lifter together.

## GN4RLY 2.5 (15 kg)

GN4RLY 2.5 was our sponsored 15 kg build. We used stronger chassis materials and had to make room for a hammer saw, the drivetrain, and the wiring in the same frame. The assembly photo from the NITK Battle Bots club proposal shows that packaging problem clearly: the hammer saw sits in the centre, the drives run along the sides, and the wiring still needs to be reachable during assembly.

![GN4RLY 2.5 on a workbench with the central weapon assembly, side chain drives and wiring exposed.](/images/projects/gn4rly-2-5-assembly.jpg)

_GN4RLY 2.5 during assembly. Photo from the NITK Battle-Bots club proposal._

### Why GN4RLY 2.5 fell short

We reused a hammer design from two years earlier. The robot’s weight and the older hammer assembly held us back against competing robots, and we couldn’t advance to later rounds. Sponsorship helped with the original build, but we didn’t have enough funding to fabricate the redesign. We learned that a design can save time on the drawing board and still cost us once its weight and layout have to work with the rest of the robot.

## Next GN4RLY (7 kg)

We’re working on a 7 kg successor. The new weight limit means revisiting how we divide the mass between the frame, drivetrain, and hammer assembly, and how we keep parts accessible for repairs. It’s still in development.
`,
  'uav-vibration-integration': String.raw`
## What I worked on at Vayu Aerospace

During my product internship at Vayu Aerospace, I traced the vibration path from the motors through the airframe to the flight-controller IMU. I used the rigid mount as a baseline and compared it with an elastomer-isolated modular tray and a suspended mount in ANSYS. Natural frequencies and mode shapes showed where the assembly might resonate and which parts would move; the response analysis showed how much motion reached the controller in the model.

## From simulation to ground tests

I helped integrate the shortlisted mounts and checked fit, fasteners, controller orientation, clearances, and cable slack. A cable pulled tight across an isolated mount can provide another vibration path, so the surrounding assembly mattered too.

We tested the shortlisted mounts in ground motor runs. I compared equivalent operating windows in MATLAB: time histories showed how the signal changed during a run, RMS gave a single level for each window, and FFT spectra showed whether a mount changed the dominant vibration peaks. That let us check the isolation in the assembled aircraft, where the cables and fasteners can change the result.

## The mounting decision

The team selected the elastomer-isolated modular tray using the simulation, integration, and ground-test evidence.

This work concerned flight-controller mounting and ground tests. It did not establish a flight-performance improvement or a general vibration reduction percentage.
`,
  'adaptive-suspension-rover': String.raw`
## Why change the suspension?

On a rough inspection route, vibration can make camera and sensor data hard to use. Slowing down helps, but it also makes the route take longer. We’re designing a six-wheel rover to see whether changing suspension preload can reduce chassis vibration at the same driving speed.

## How one suspension module works

Each wheel carrier pivots against three compression links and three elastic tension paths. As the wheel rises over a bump, the links change angle and the tension paths stretch, creating a restoring moment. A separate damper controls how the wheel settles. The links are guided by a pivot and bearings, so the wheel still has a defined path through bump and droop.

One geared motor per wheel turns a fine-pitch screw. Guide rails stop the nut and carriage from rotating, so the screw moves the carriage and adjusts the initial tension in all three elastic paths. The CAD allows 6 mm of preload adjustment and shows about 21 mm of vertical wheel travel from −8° of droop to +20° of bump. The preload changes how strongly the joint resists a small movement; it does not change the spring material. The wheel still moves passively once the setting is held.

![Interior CAD view of the six-wheel rover with the roof hidden to expose the mechanical assembly.](/images/projects/rover-interior-cad.png)

_The six suspension modules in the rover assembly, with the roof hidden to show how they fit around the central deck._

[View the rover CAD with the roof installed](/images/projects/rover-assembly-cad.png).

## What the controller measures

The sensor plan puts one accelerometer on the chassis and one on each middle wheel carrier. The carrier readings track the disturbance entering the suspension; the chassis reading tracks what reaches the body. Wheel encoders measure speed and a chassis IMU tracks roll and pitch. If vibration stays high, the rover is meant to stop, change preload, confirm the carriage position and lock, then resume and check vibration again. It can reduce travel speed if the new setting is insufficient.

## How we’ll test it

The first test is a single module on a loaded fixture. We’ll measure force versus travel at different preload settings and check that the mechanism holds when power is cut. The rover trials then compare fixed preload, speed-only control, preload-only control, and combined control on the same track and payload, with at least three repeat runs per setting.

The target is at least **20% lower vertical chassis RMS acceleration** in the 5–100 Hz band against fixed preload at matched speed. The trials will also record route time and energy per metre. The target comes from the test plan; there are no terrain-test results yet.
`,
  'tensegrity-joint': String.raw`
## How the support network is arranged

I’m studying how the geometry and initial tension of a tensegrity joint affect the way it carries load. The layout uses two Y-frames and a floating tristar. Each of the tristar’s three tips connects to both tips on each Y-frame, giving 12 support tendons. The tristar arms are spaced 120° apart, and the four frame tips lie on the intended flexion axis. The drawing shows the support network at 60° of flexion.

![Side and front drawings of the femoral and tibial Y-frames, floating tristar, and support tendons at the reference pose.](/images/projects/tensegrity-knee-geometry.png)

_Side and front views of the nominal geometry and load-support network. [Open the full-size drawing](/images/projects/tensegrity-knee-geometry.png)._

## Member-force analysis

At a chosen configuration, the member forces must balance the external load:

$$
A(q)t+f_{\mathrm{ext}}=0
$$

The geometry matrix A(q) describes how each tendon’s pull contributes to the force balance. A tendon can only pull, so I check for spans going slack as well as spans carrying high tension. In one static sizing case from the design review, an assumed 3.2 kN horizontal and 5.25 kN vertical load gave about **0.50–5.69 kN of calculated tension per support span**. Those are model results for that load case, not a measured load capacity.

## Current design and next steps

Increasing preload can keep the least-loaded span in tension, but it also increases the load on the tristar, frame roots, and connections before any external force is applied. That trade-off is why I’m narrowing the geometry in MATLAB before choosing what to build. The layout draws on [Mortensen and colleagues’ tensegrity leg study](https://arxiv.org/abs/2504.19685).

The next checks are tendon and fitting clearance through the intended flexion range, followed by bench measurements of load, displacement, and repeatability. The preliminary sizing does not establish fatigue life or suitability for human use.
`,
  kneeassist: String.raw`
## From a passive concept to an actuated design

We started with a passive spring-assisted knee mechanism. In SolidWorks and ANSYS, we compared spring attachment positions and checked for interference as the knee bent. An attachment that looks good in one pose can give the spring very little leverage elsewhere or cause a collision before the joint reaches the end of its travel.

The actuated design adds a motor-driven cable and a knee-angle sensor. The cable loads the spring to assist extension while the user still supplies part of the effort. The CAD above shows the thigh and shank cuffs on adjustable rails, with the drive and spring assembly on one side of the knee.

## Spring force and assistance torque

The basic design relationship is:

$$
F_s=k_s\Delta\ell,\qquad
\tau_a(\theta)=F_s r_\perp(\theta)
$$

Spring extension sets the force, and the perpendicular distance from the cable’s line of pull to the knee pivot sets its leverage. Both matter: even at the same spring force, changing the cable angle can change the assistance. We defined power protection and an independent manual release so a jammed drive would not have to move for the user to release the mechanism.

## Design status and team recognition

Our team placed in the top 5 of 70 teams nationwide in the Incubate X Prosthetic Challenge. We reached a design ready for procurement. The bench plan starts by comparing the angle reading and spring force with independent measurements, then checks assisted motion, manual release under a jam, fault response, and cycle life. Procurement and testing are still pending.
`,
  'reaction-wheel-microvibrations': String.raw`
## From reaction-wheel forces to camera motion

I wanted to find out how a reaction wheel’s vibration reaches a spacecraft camera, and whether a faster model can still tell us enough to make a design decision. The 5–20 Hz pilot starts from a free-floating COMSOL model with about 1.01 million volume elements. At each of four wheels, I modelled two transverse force inputs and the corresponding moment inputs, giving 16 transfer channels. Force and moment responses keep their own units.

## A smaller model for repeated calculations

The pilot reduces the structural equations to 52 coordinates: 36 natural modes and 16 corrections for bending at the camera support that the smaller basis missed.

For each frequency and structural configuration, the reduced system solves:

$$
A(f,p)q_j=b_j,\qquad u_j=Cq_j
$$

Here p contains the structural settings, q is the complex reduced state, and C maps it to the outputs. To estimate tilt, I compared the surface-averaged displacements at two camera-support stations about 0.48 m apart and removed the spacecraft’s whole-body rotation. That gives a structural pointing proxy; the study did not measure optical jitter.

## Comparing MLP, DeepONet, and physics-informed models

I kept each structural configuration entirely within training, validation, or testing. That matters because a model trained on one part of a frequency curve has already seen the structure behind the rest of that curve. In the original test, the multilayer perceptron (MLP) had lower mean frequency-integrated complex-response error than DeepONet against the 52-coordinate reference. These averages cover three held-out configurations, each with all 16 input channels.

| Response | MLP | DeepONet |
| --- | ---: | ---: |
| Camera displacement | 0.139% | 0.342% |
| Optical bench displacement | 0.171% | 0.378% |
| Structural tilt | 0.261% | 0.701% |

![Three response plots over 5–20 Hz showing near-overlapping reduced-model, MLP, and DeepONet curves for camera and bench displacement and a structural tilt peak just below 10 Hz.](/images/projects/reaction-wheel-held-out-response.png)

_One held-out example for a transverse force at wheel 1. Figure 3 from the 5–20 Hz research report. [Open the full-size plot](/images/projects/reaction-wheel-held-out-response.png)._

I also tried pretraining on the 36-coordinate model before refining on 52-coordinate data. It helped when reference training cases were scarce, but the benefit did not hold at the largest budget. In a separate one-input experiment, adding the equilibrium residual to the training loss reduced the balanced residual by 9.23% on fresh in-range configurations. It did not improve every resonance metric.

## Numerical checks and the design decision

The detailed FEM checks were separate from training: 14 COMSOL points across six configurations, with four points in configurations held out of the original comparison. They are spot checks, not evidence of agreement at every resonance.

An earlier native-FEM study found a response near 5,800 rpm with about 0.33% local mesh sensitivity in peak amplitude. That figure belongs to that earlier mesh comparison. It is not a neural prediction error, an experimental accuracy figure, or evidence that the current pilot covers that frequency range.

I screened 17 mount-stiffness settings. The neural screen picked a 10% increase in equivalent mount stiffness, so I ran the nominal and candidate settings through the reduced model on 36 separate scenarios. The worst sampled reference response changed by only **0.00589%**; the largest neural peak error on those scenarios was **7.61%**. That was too little evidence to justify a mount change, so I kept the nominal design.

## What the work establishes

The deliverables include structural response calculations, trained models, tests on unseen configurations, selected full-FEM comparisons, and an interactive demonstration. The current claim is a computational pilot over 5–20 Hz.

Global mesh and basis convergence, measured wheel spectra and damping, and experimental pointing validation remain open. The study does not establish flight qualification or a validated design surrogate across the spacecraft’s full operating range.
`,
  'off-road-leaf-robot': String.raw`
## Collecting leaves without collecting the soil

I’m developing a robot for collecting dry and wet leaves on uneven ground. The pickup mechanism needs to stay close enough to the surface to collect leaves without drawing in too much soil, even as terrain and traction change.

I split the design into locomotion, pickup, transfer, storage, and terrain following. In that order, the rover has to keep traction, lift the leaves, move them away from the pickup point, hold them, and keep the pickup close to the ground as the surface changes. Separating those jobs helped me see which parts have to work together: a pickup concept is only useful if it fits beside the drive and can hand material off to storage.

## Mechanism selection and integration

I screened pickup concepts against space, manufacturing, and integration constraints. A promising pickup mechanism still needs to fit alongside the wheels, move material into storage, and tolerate changes in ground height.

I built a bottom-up BOM, or bill of materials, around the practical options. I defined four things to compare in testing: whether the rover keeps traction on uneven ground, how much of the available leaf litter it collects, how much soil comes with it, and how long the machine can run. Measuring leaf pickup and soil contamination separately will make it possible to see when a design is collecting more material without actually doing a better job.

## Current stage

Subsystem architecture and mechanism selection are ongoing. The performance tests are planned, and no pickup-efficiency or endurance results are claimed yet.
`,
  'uncertainty-aware-navigation': String.raw`
## Planning with an uncertain position estimate

I built a differential-drive simulator in Python. A* finds a path through the map, the heading controller follows it using the estimated pose, and an extended Kalman filter (EKF) combines the wheel encoder and IMU readings. I injected encoder noise, IMU drift, yaw bias, and wheel slip so the estimated pose could diverge from the simulator’s true pose while the robot was trying to follow the path.

## Motion, localization, and recovery

For an ideal differential drive with equal wheel radii:

$$
v=\frac{r}{2}(\omega_R+\omega_L),\qquad
\dot{\psi}=\frac{r}{b}(\omega_R-\omega_L)
$$

Wheel radius r and separation b connect wheel speeds to forward and angular motion. Slip means the actual motion can differ from this prediction. The EKF combines the motion model with measurements and tracks uncertainty alongside its state estimate.

I used the filter’s estimate of uncertainty in the speed and recovery logic. This gave the robot a way to slow down or attempt recovery when it was less certain where it was, instead of always following the same speed policy.

## Monte Carlo evaluation

I evaluated the stack over repeated Monte Carlo trials. Localization error compared the filter’s estimate with the simulator’s true pose; collisions and recovery events showed what happened along the way; success and time to goal showed whether the run finished and how long it took. A run can reach its goal and still reveal a trade-off between travel time and reliable localization.

The completed work is a simulation and evaluation workflow. It does not represent tests on a physical robot.
`,
  'four-bar-door-mechanism': String.raw`
## Designing the door motion

I worked with my team to build a planar four-bar linkage door-opening mechanism. We chose link lengths and pivot positions around the intended door motion and the mechanism’s kinematic limits.

## Building and checking the linkage

We made the links, pivots, and joints, assembled the mechanism, and checked its motion. The build made it easier to see how a small change in pivot position could change the door’s path or limit its travel.

The completed result was a working team-built mechanism. This was an early practical project in mechanism design and assembly.
`,
  'easy-access-wallet': String.raw`
## Making cards easier to reach

I developed a compact wallet concept around a simple access problem: removing a card from a tightly packed holder.

## Working through the layout

I considered how the stack would be supported, how much clearance it needed, and where the user’s fingers could reach. The layout followed those requirements rather than starting with a preferred mechanism.

The completed work was a mechanical design concept. It was not a manufactured product or a formal user study.
`,
  'solar-smart-home': String.raw`
## Connecting sensors and control logic

I built an Arduino-based smart-home model with several sensor inputs and automated functions. My work covered circuit wiring, control logic, and debugging the connections and code so the functions operated together.

## Adding a solar-power option

I added a photovoltaic cell as a power-source option and tested the model with that supply. This was a model-scale electronics project and an early introduction to integrating sensing, control, and power.
`,
  'traffic-and-elevated-bus': String.raw`
## Two early electronic builds

I built a smart traffic-light system and a separate transit elevated-bus model. Both used hand-wired circuits and logic gates to control repeatable operating sequences.

## Wiring and fault tracing

For the traffic-light model, I connected the signals into a junction sequence. The elevated-bus model used its own control circuit. I traced wiring and logic faults until each model followed its intended sequence.

These were working model-scale builds and early practice in circuit wiring, sequencing, and debugging.
`,
};
