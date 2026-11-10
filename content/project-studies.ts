// Project descriptions use the CV and original design/research material.
// Equations describe the models; they do not stand in for experimental evidence.
export const projectStudies: Record<string, string> = {
  'nitk-battle-bots': String.raw`
## 3 lb flipper

Jelly Baby’s rear-hinged lifter inspired us to build a flipper that could get underneath an opponent and lift it. We kept the front low and gave the flipper room to rise clear of the chassis. With just 3 lb for the chassis, drivetrain and weapon, we used a unibody structure to cut the number of parts we had to fabricate and assemble. [Jelly Baby’s NHRL profile](https://wiki.nhrl.io/wiki/index.php?title=Jelly_Baby)

## GN4RLY 2.5 (15 kg)

We built GN4RLY 2.5 around a hammer saw that could bring a spinning head down on an opponent from above. Sponsorship let us use stronger chassis materials. We laid out the chassis around the arm’s pivot and sweep, with the arm and mounts carrying impact loads back into the frame.

![GN4RLY 2.5 on a workbench with the central weapon assembly, side chain drives and wiring exposed.](/images/projects/gn4rly-2-5-assembly.jpg)

_GN4RLY 2.5 during assembly. Photo from the NITK Battle-Bots club proposal._

### Why GN4RLY 2.5 fell short

We carried over a hammer design from two years earlier. The bot’s weight and the older hammer assembly held us back against competing robots, and we couldn’t advance to later rounds. We needed to redesign the assembly, but we didn’t have the funding to fabricate the revision.

## Next GN4RLY (7 kg)

We’re developing the next version of GN4RLY for the 7 kg class. The tighter weight budget gives us a reason to revisit the weapon and chassis together. We’re thinking through how much mass to allocate to the weapon, how impacts travel through the frame, and how to keep the drivetrain accessible for repairs.
`,
  'uav-vibration-integration': String.raw`
## What I worked on at Vayu Aerospace

During my product internship at Vayu Aerospace, I investigated how motor vibration passed through the airframe to the flight-controller IMU. I compared a rigid mount, an elastomer-isolated tray, and a suspended mount in ANSYS, looking at natural frequencies, mode shapes, and vibration response.

The aim was to choose a mounting arrangement that could be integrated into the aircraft and reduce the vibration reaching the controller.

## From simulation to ground tests

I helped integrate the shortlisted mounts and checked fit, fasteners, controller orientation, clearances, and cable slack. A cable pulled tight across an isolated mount can provide another vibration path, so the surrounding assembly mattered too.

We tested the mounts through ground motor runs. I used MATLAB to compare IMU time histories, RMS vibration, and FFT spectra across consistent operating windows. RMS summarized the signal level; the spectra helped identify the frequencies contributing to it.

## The mounting decision

The team selected the elastomer-isolated modular tray using the simulation, integration, and ground-test evidence.

This work concerned flight-controller mounting and ground tests. It did not establish a flight-performance improvement or a general vibration reduction percentage.
`,
  'adaptive-suspension-rover': String.raw`
## The question behind the rover

I’m designing a six-wheel rough-terrain rover to investigate whether changing suspension stiffness can reduce vibration before the robot needs to slow down. The project connects mechanical suspension design with IMU and wheel-encoder feedback.

The suspension concept uses adjustable spring leverage and supported stiffness settings. The initial control plan defines soft, medium, and stiff states with mechanical locking, plus a separate load path to keep the platform supported if reconfiguration fails.

## Suspension and feedback

A simplified mass–spring–damper model helps frame the design:

$$
m\ddot{x}+c\dot{x}+kx=F(t)
$$

Changing effective stiffness k changes how the suspension responds to a disturbance. The complete rover also introduces wheel contact, geometry, and terrain effects, which this simple model leaves out.

The controller is intended to detect sustained vibration, request a stiffness change, verify the new state, and measure the response again. It reduces speed if reconfiguration is insufficient. These are planned behaviors to evaluate on hardware.

![Interior CAD view of the six-wheel rover with the roof hidden to expose the mechanical assembly.](/images/projects/rover-interior-cad.png)

_The six suspension modules in the rover assembly, with the roof hidden to show how they fit around the central deck._

[View the rover CAD with the roof installed](/images/projects/rover-assembly-cad.png).

## What needs testing next

The next step is to evaluate one suspension unit before moving to complete rover trials. The validation plan compares fixed stiffness, speed-only control, stiffness-only control, and combined control under comparable terrain conditions.

The CAD assembly documents the mechanical layout. It does not demonstrate load capacity, fatigue life, or vibration attenuation; those depend on analysis and physical testing.
`,
  'tensegrity-joint': String.raw`
## A knee joint with adjustable stiffness

I’m studying a tensegrity-based knee joint for an exoskeleton. The central question is how geometry, external loading, and internal tendon force change the joint’s force output and stiffness.

My MATLAB work compares these variables and helps narrow the configurations worth developing further. The current preliminary layout uses two Y-frames, a floating tristar, and 24 tendon spans. Support tendons carry the applied force; separate antagonistic tendon stages provide the flexion moment.

![Side and front drawings of the femoral and tibial Y-frames, floating tristar, and support tendons at the reference pose.](/images/projects/tensegrity-knee-geometry.png)

_Side and front views of the reference geometry and load-support network. [Open the full-size drawing](/images/projects/tensegrity-knee-geometry.png)._

## Member-force analysis and rotational stiffness

![Three design diagrams showing the support tendons and the separate femoral and tibial torque networks.](/images/projects/tensegrity-knee-design.png)

_Support and torque networks from the preliminary design review. Blue lines represent rigid members and red lines represent tendons._

At a chosen configuration, the member forces must balance the external load:

$$
A(q)t+f_{\mathrm{ext}}=0
$$

The geometry matrix A(q) maps member tensions t into the applied force balance. Cable tensions must remain positive for the assumed tension network to be maintained.

Local rotational stiffness describes how resisting torque changes with joint angle:

$$
k_\theta=\frac{\mathrm{d}\tau}{\mathrm{d}\theta}
$$

I use these relationships to examine the effects of geometry and preload, rather than treating the joint as having one stiffness throughout its motion.

## Current design and next steps

The design review includes preliminary tendon loads, member sizing, and connection checks. Its topology draws on [Mortensen and colleagues’ tensegrity leg study](https://arxiv.org/abs/2504.19685); the project explores its own support and torque layout.

The current work is computational and mechanical design. Detailed geometry, tendon routing, assembly clearance, full stiffness analysis, and bench tests still need verification.
`,
  kneeassist: String.raw`
## From a passive concept to an actuated design

This team project began with a passive spring-assisted knee mechanism. I worked on the mechanism in SolidWorks and ANSYS, comparing spring placement, joint geometry, and clearance through the intended flexion range.

The design then developed into an actuated cable-and-spring brace with knee-angle sensing. It is intended to add assistance while the user continues to extend actively.

## Spring force and assistance torque

The basic design relationship is:

$$
F_s=k_s\Delta\ell,\qquad
\tau_a(\theta)=F_s r_\perp(\theta)
$$

Spring extension sets the spring force. The perpendicular moment arm changes with knee angle, so attachment geometry affects the torque available through the motion. Friction, cable routing, and the real spring response still require bench measurements.

The system definition brings together adjustable rails and cuffs, the motor drive, angle sensing, power protection, and an independent manual release. The original CAD screenshot above shows this layout.

## Design status and team recognition

Our team placed in the top 5 of 70 teams nationwide in the Incubate X Prosthetic Challenge. The completed work covers the passive concept, actuated design, and procurement-ready system definition.

The bench plan includes angle accuracy, spring force, assisted motion, jam release, fault behavior, and cycle life. Procurement and bench testing are the next steps. The project does not yet have human-performance or clinical results.
`,
  'reaction-wheel-microvibrations': String.raw`
## From reaction-wheel forces to camera motion

This project studies how reaction-wheel disturbances pass through a spacecraft structure and affect a camera support. It connects structural dynamics with reduced-order models and neural response prediction.

The latest computational pilot covers 5–20 Hz. The COMSOL model includes wheel locations, mounts, the camera support, optical bench, and equivalent cable regions, with a free-floating spacecraft condition. Force and moment inputs are treated separately, with their own units.

## A smaller model for repeated calculations

The pilot reduces the structural equations to 52 coordinates: 36 stored natural modes and 16 response corrections. Those corrections address camera-relative bending missed by the smaller basis.

For each frequency and structural configuration, the reduced system solves:

$$
A(f,p)q_j=b_j,\qquad u_j=Cq_j
$$

Here p contains the structural settings, q is the complex reduced state, and C maps it to the camera and bench responses. The study estimates structural tilt from relative displacement between two camera-support stations. This is a pointing-motion proxy, not a measured optical-jitter result.

## Comparing MLP, DeepONet, and physics-informed models

The response predictors learn real and imaginary components from reduced-model labels. Complete structural configurations are separated for training, validation, and testing, so frequencies from the same structure do not leak across those groups.

The pilot compares an MLP with a standard DeepONet. Separate experiments examine transfer from a 36-coordinate model to the corrected 52-coordinate model, and a physics-informed state predictor with an equation-residual term. These experiments have different targets and evaluation scopes; their errors are reported separately.

## Numerical checks and the design decision

Selected full-FEM points provide a separate check on the reduced model and neural predictions. Agreement with reduced-model labels alone does not establish agreement with the detailed FEM model at every resonance.

An earlier native-FEM study found a response near 5,800 rpm with about 0.33% local mesh sensitivity in peak amplitude. That figure belongs to that earlier mesh comparison. It is not a neural prediction error, an experimental accuracy figure, or evidence that the current pilot covers that frequency range.

In the pilot’s scenario study, the candidate stiffness change produced a very small apparent improvement relative to prediction error. The supported decision was to retain the nominal design.

## What the work establishes

The deliverables include structural response calculations, trained models, tests on unseen configurations, selected full-FEM comparisons, and an interactive demonstration. The current claim is a computational pilot over 5–20 Hz.

Global mesh and basis convergence, measured wheel spectra and damping, and experimental pointing validation remain open. The study does not establish flight qualification or a validated design surrogate across the spacecraft’s full operating range.
`,
  'off-road-leaf-robot': String.raw`
## Collecting leaves without collecting the soil

I’m developing a robot for collecting dry and wet leaves on uneven ground. The pickup mechanism needs to stay close enough to the surface to collect leaves without drawing in too much soil, even as terrain and traction change.

I divided the platform into locomotion, pickup, transfer, storage, and terrain-following subsystems. This makes it possible to compare the important functions before committing to one complete machine.

## Mechanism selection and integration

I screened pickup concepts against space, manufacturing, and integration constraints. A promising pickup mechanism still needs to fit alongside the wheels, move material into storage, and tolerate changes in ground height.

The current work includes a bottom-up BOM—a bill of materials—and test criteria for traction, pickup efficiency, soil rejection, and endurance. Pickup quantity and soil contamination need separate measurements; collecting more material is not enough if much of it is soil.

## Current stage

Subsystem architecture and mechanism selection are ongoing. The performance tests are planned, and no pickup-efficiency or endurance results are claimed yet.
`,
  'uncertainty-aware-navigation': String.raw`
## Planning with an uncertain position estimate

I built a differential-drive robot simulator that combines A* path planning, heading control, encoder and IMU measurements, and extended Kalman filter (EKF) localization.

The question was how navigation should change when the robot becomes less certain of its position. I added encoder noise, IMU drift, yaw bias, and wheel slip to test this rather than relying on ideal sensors.

## Motion, localization, and recovery

For an ideal differential drive with equal wheel radii:

$$
v=\frac{r}{2}(\omega_R+\omega_L),\qquad
\dot{\psi}=\frac{r}{b}(\omega_R-\omega_L)
$$

Wheel radius r and separation b connect wheel speeds to forward and angular motion. Slip means the actual motion can differ from this prediction. The EKF combines the motion model with measurements and tracks uncertainty alongside its state estimate.

I added confidence-aware speed and recovery logic so the simulated robot could respond when localization became unreliable.

## Monte Carlo evaluation

I evaluated the navigation stack through Monte Carlo trials, tracking collisions, localization error, recovery events, success, and time to goal. These measures help distinguish reaching the target from reaching it reliably.

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
