// Equations explain the underlying models. They are not additional test results.
export const projectStudies: Record<string, string> = {
  'uav-vibration-integration': String.raw`
## Vibration transmission from the motors to the flight-controller IMU

During my product internship at Vayu Aerospace Pvt. Ltd., I worked on how motor and airframe vibration reached the flight-controller IMU. A mount could fit the controller perfectly and still pass too much vibration into it. I needed to understand the support, the controller, and the connections around them as one assembly.

I compared a rigid baseline, an elastomer-isolated tray, and a suspended mount in ANSYS. Natural frequencies and mode shapes helped explain how each arrangement changed the vibration path. The response analysis then helped us shortlist the isolation concepts for hardware evaluation.

## Mount integration, ground tests, and IMU analysis

When we integrated the shortlisted mounts, I checked the CAD fit, clearances, fasteners, cable slack, and controller orientation. These details mattered because a tight cable or an unintended contact could create another path for vibration, even if the mount itself was compliant.

The assembled mounts were tested through ground motor runs. I used MATLAB to inspect the IMU time histories and FFT spectra, alongside the RMS levels. For a sampled acceleration signal, RMS is:

$$
a_{\mathrm{RMS}} = \sqrt{\frac{1}{N}\sum_{i=1}^{N} a_i^2}
$$

Here, N is the number of samples and aᵢ is the acceleration sample being compared. An RMS value only makes sense beside the processing choices and operating window: the same axis, units, motor condition, and treatment of the signal. The FFT adds another view by showing which frequencies contribute to the response.

## Selection of the elastomer-isolated tray

The team selected the elastomer-isolated modular tray after combining the simulation, hardware integration, and IMU analysis. My contribution covered mount modeling, integration, ground tests, and analysis of the logs.

The useful lesson for me was how easily an isolation idea can change during assembly. Checking the vibration path in the real hardware was as important as comparing the modeled supports.
`,
  'adaptive-suspension-rover': String.raw`
## Variable stiffness and vibration-induced speed limits

I’m designing a six-wheel rover around a question I want to test: can the suspension change stiffness before vibration forces the rover to slow down? On rough terrain, speed is only one part of the problem. The suspension also changes how disturbances reach the body and its sensors.

The design uses adjustable spring leverage to create soft, medium, and stiff settings. Each setting has a mechanical lock. A separate load path keeps the rover supported if the stiffness-changing mechanism fails, so maintaining support does not depend on successfully reconfiguring the suspension.

## Soft, medium, and stiff states with mechanical support

A simple mass–spring–damper model helps frame the first design decisions:

$$
m\ddot{x} + c\dot{x} + kx = F(t)
$$

In this simplified model, m is the supported mass, c is damping, k is effective stiffness, and x is displacement from equilibrium. F(t) represents a disturbance force. The model leaves out the full rover’s wheel contacts, geometry, and terrain, but makes the relationship between support and vibration easier to examine.

Its undamped natural frequency is:

$$
f_n = \frac{1}{2\pi}\sqrt{\frac{k}{m}}
$$

Changing spring leverage changes the effective stiffness seen at the suspension output. That can move the natural frequency, but does not mean one setting will work best on every surface. This is why I want to compare settings under the same terrain and speed conditions.

## IMU/encoder feedback and verified reconfiguration

The planned controller uses IMU and wheel-encoder data to identify sustained vibration. It requests a stiffness change, verifies the new setting, and measures the response again. If reconfiguration does not reduce the vibration enough, it can then reduce speed.

Verification matters here. Asking a mechanism to move and knowing that it reached a locked state are different things. The control design needs to account for that difference before it can make sensible decisions about speed.

## Validation across four control strategies

The project is in the design stage. I’m structuring validation from a single suspension unit through full rover trials. The comparison will include fixed stiffness, speed-only control, stiffness-only control, and the combined system.

Those tests should show whether reconfiguration helps, where it does not, and what it costs in time and energy. I want the next design decision to follow from those measurements.
`,
  'tensegrity-joint': String.raw`
## Variable-stiffness knee-joint modeling for an exoskeleton

I’m modeling a tensegrity-based variable-stiffness knee joint for a knee exoskeleton. The study examines how geometry and internal loading change the joint’s force output and stiffness.

In MATLAB, I varied geometry, external loading, and internal force to identify the design variables with the strongest influence on force and stiffness. The analysis narrowed the design space to a smaller set of configurations for a physical knee-exoskeleton prototype.

## Member-force analysis and rotational stiffness

A useful starting point is equilibrium. With a consistent force convention, the member forces and external load must balance:

$$
A(q)\,t + f_{\mathrm{ext}} = 0
$$

A(q) describes how the members are arranged at configuration q. The vector t contains their axial forces, and fₑₓₜ contains the external loads. The geometry matters because it determines how an individual member’s force contributes to the overall balance. Cable forces also need to remain consistent with cables carrying tension.

For rotational response, local joint stiffness can be described by:

$$
k_\theta = \frac{\mathrm{d}\tau}{\mathrm{d}\theta}
$$

Here, θ is joint angle and τ is the resisting torque along the response being examined. I’m interested in how that slope changes across configurations and loading conditions. A single stiffness value does not describe the whole motion.

## From influential design variables to prototype configurations

The CAD views help me inspect the geometry and how the joint fits into a leg assembly. They are a paper-based mechanism reconstruction used for study, drawing on [Mortensen and colleagues’ tensegrity leg design](https://arxiv.org/abs/2504.19685).

![Native SolidWorks view of the full tensegrity leg study, showing the joint within the surrounding assembly.](/images/projects/tensegrity-leg-cad.webp)

_Full leg assembly · Native SolidWorks view from the paper-based CAD reconstruction. This is a mechanism study, not tested hardware._

The shortlisted configurations are intended for a physical knee-exoskeleton prototype. Modeling and design remain ongoing; the CAD study and MATLAB analysis do not represent tested exoskeleton hardware.
`,
  kneeassist: String.raw`
## Passive spring-assisted concept and flexion-range checks

This team project began as a passive spring-assisted knee concept. We wanted to understand how spring placement and joint geometry changed the assistance available through the motion. That meant looking at the force path and usable movement together.

I modeled and refined the mechanism in SolidWorks, using ANSYS and interference checks to identify layouts that could move through the intended flexion range. Moving a spring attachment could change both the assistance and the clearance, so those decisions needed to be checked together.

## Spring force, moment arm, and assistance torque

A first-order model connects spring extension to force, and force to the assistance torque:

$$
\begin{aligned}
F_s &= k_s\,\Delta\ell \\
\tau_a(\theta) &= F_s\,r_\perp(\theta)
\end{aligned}
$$

Fₛ is spring force, kₛ is spring stiffness, and Δℓ is extension from the spring’s unloaded length. The perpendicular moment arm r⊥ changes with knee angle θ. These equations explain why the attachment geometry matters: the same spring force can produce a different torque at a different angle.

This is an idealized relationship for understanding the design. Friction, cable routing, spring behavior, and the physical assembly still need bench measurements.

## Knee-angle tracking and cable-and-spring actuation

We developed the passive concept into an actuated knee assistance system that tracks knee angle and adds controlled cable-and-spring assistance while the user extends actively.

The system definition includes adjustable rails and cuffs, the motor drive, angle sensing, protected power, and an independent manual release. The CAD screenshot above shows this actuated layout. The release is part of the mechanical design, rather than relying only on a software command to stop assistance.

## System architecture, bench tests, and national recognition

The design reached a procurement-ready system, with bench checks defined for angle accuracy, spring force, assisted motion, jam release, faults, and cycle life. Our team placed in the top 5 of 70 teams nationwide in the Incubate X Prosthetic Challenge.

The completed work covers the design and system definition. Procurement and bench testing are the next steps; there are no clinical or human-performance results to report from this work.
`,
  'reaction-wheel-microvibrations': String.raw`
## Reaction-wheel excitation and payload line-of-sight jitter

I developed a parameterized high-fidelity finite-element model of the reaction-wheel–mount–spacecraft–payload system. The model follows wheel-induced disturbances through the mounting interface and spacecraft structure to the payload, including line-of-sight jitter outputs.

The excitation is multi-order and speed-dependent. The study combines modal, harmonic-response, and rotordynamic analyses to examine the response as wheel speed changes.

## Structural response and speed-dependent excitation

A simplified linear harmonic structural model can be written as:

$$
\left(K-\omega^2 M+\mathrm{i}\omega C\right)\hat{q}=\hat{f}
$$

M, C, and K are the mass, damping, and stiffness matrices. The complex displacement amplitude q̂ responds to the force amplitude f̂ at angular frequency ω. This equation explains the basic structural response; it is not a complete representation of the project’s rotordynamic model or surrogate architecture.

The fundamental rotational frequency is:

$$
f_{\mathrm{rot}} = \frac{n}{60}
$$

n is wheel speed in rpm. The project includes multi-order excitation, so a speed sweep must account for more than the fundamental rotational frequency. The payload response is evaluated alongside the structural vibration.

![Sectioned reaction-wheel reference CAD showing the rotor, housing, shaft, and support plate.](/images/projects/reaction-wheel-cutaway.webp)

_Section view from the project’s reference assembly. Surface finishes are illustrative; this is CAD, not a FEM response plot or experimental measurement._

## Analytical and numerical verification

I verified the model through analytical, mesh, frequency-step, modal-truncation, and dynamic-equilibrium checks. A strong response appeared near 5,800 rpm, with 0.33% mesh sensitivity in peak amplitude.

The 0.33% figure describes the change under mesh refinement. It is not a surrogate prediction error or a claim of experimental accuracy. Frequency-step and modal-truncation checks address different numerical sensitivities around the response peak.

## Low-fidelity models and a leakage-safe multi-fidelity dataset

I built low-fidelity and reduced-order models alongside the high-fidelity FEM model, then assembled a leakage-safe multi-fidelity dataset for surrogate evaluation.

The evaluation keeps the comparison focused on what a surrogate needs to preserve: resonance behavior, physical consistency, generalization beyond the training distribution, and the amount of high-fidelity data required.

## MLP, DeepONet, and physics-informed surrogate comparisons

I compared MLP, DeepONet, and physics-informed/multi-fidelity variants on resonance accuracy, physics consistency, out-of-distribution generalization, and data efficiency.

## Uncertainty, resonance-risk mapping, and robust design

I used the surrogate for uncertainty quantification, resonance-risk mapping, and robust design. This connects the computational model to design decisions about vibration and payload jitter, rather than treating prediction as the final output.

The completed work is computational modeling, numerical verification, and surrogate evaluation. Experimental validation remains separate.
`,
  'off-road-leaf-robot': String.raw`
## Dry and wet leaf collection on undulating terrain

I’m working on a robot that collects dry and wet leaves without pulling in too much soil. A mechanism that works on a flat, clean surface may behave very differently when the leaves are damp, the ground changes height, or the wheels lose traction.

I separated the design into locomotion, pickup, transfer, storage, and terrain-following systems. This lets me test the important functions before committing to the full robot.

## Five subsystems, pickup screening, and the BOM

The pickup mechanism has to fit beside the wheels and transfer system, move material into storage, and stay close enough to uneven ground. I compared concepts against space, manufacturability, and integration limits, then built a bottom-up BOM around the practical options.

The next tests need to distinguish picking up more material from picking up the right material. One proposed measure of pickup efficiency is:

$$
\eta_{\mathrm{pickup}}
=\frac{m_{\mathrm{leaves,\ collected}}}{m_{\mathrm{leaves,\ available}}}
$$

The numerator is the mass of leaves collected, and the denominator is the leaf mass available in a defined test area. Soil needs to be measured separately. A high pickup ratio would not be enough if much of the collected load were soil.

## Traction, pickup efficiency, soil rejection, and endurance

The architecture, mechanism screening, and BOM support the next design decisions. I’ve defined tests for traction, pickup efficiency, soil rejection, and endurance.

The work is ongoing. These measures describe the planned evaluation; I do not have pickup or endurance results to report yet. I want subsystem tests to show where the design needs to change before building the complete machine.
`,
  'uncertainty-aware-navigation': String.raw`
## A* planning, heading control, and EKF localization

I built a differential-drive simulator with A* path planning, heading control, wheel encoders, an IMU, and extended Kalman filter localization. The question was what the robot should do when its estimate of its own position becomes unreliable.

I injected encoder noise, IMU drift, yaw bias, and wheel slip. This made it possible to inspect failures that would be hidden by perfect simulated sensing.

## Differential-drive kinematics and state uncertainty

For an ideal differential drive with equal wheel radii, forward speed and heading rate are:

$$
\begin{aligned}
v &= \frac{r}{2}\left(\omega_R+\omega_L\right) \\
\dot{\psi} &= \frac{r}{b}\left(\omega_R-\omega_L\right)
\end{aligned}
$$

r is wheel radius, b is the distance between the wheels, and ωᴿ and ωᴸ are their angular velocities. This [differential-drive model](https://www.mathworks.com/help/robotics/ref/differentialdrivekinematics.html) is a starting point; wheel slip means measured wheel rotation does not always translate into the motion predicted by the ideal model.

The EKF tracks uncertainty as well as state. Its prediction step propagates the covariance:

$$
P_k^- = F_k P_{k-1}^+ F_k^\mathsf{T} + Q_k
$$

P is the state covariance, F is the local linearization of the motion model, and Q represents process uncertainty. The measurement update then corrects the prediction using sensor information. [MathWorks’ EKF explanation](https://www.mathworks.com/help/fusion/ug/extended-kalman-filters.html) gives the underlying prediction and correction structure.

## Confidence-aware speed and recovery logic

I implemented confidence-aware speed and recovery logic so the robot could respond when localization became unreliable. Planning a route, following it, and deciding whether to trust the current state estimate all belong in the navigation loop.

## Monte Carlo evaluation with five performance measures

I evaluated the stack through Monte Carlo trials, tracking collisions, localization error, recovery events, success, and time to goal. Reaching the target alone would not explain whether the route was safe or how often recovery was needed.

This was a simulation project. The results and workflow concern the simulated robot and disturbances, rather than field validation on physical hardware.
`,
  'four-bar-door-mechanism': String.raw`
## Starting from the door motion

I worked with my team to build a four-bar linkage door-opening mechanism. We began with the movement we wanted, then worked through link lengths and pivot positions to find a layout within the mechanism’s kinematic limits.

The reference photograph above shows a spatial four-bar linkage. Our door mechanism was a planar team build; the photograph is a related mechanism reference, not our prototype.

## Keeping the loop closed

A planar four-bar can be described by the vector loop:

$$
\mathbf{r}_2+\mathbf{r}_3
=\mathbf{r}_1+\mathbf{r}_4
$$

r₁ connects the fixed pivots, while r₂, r₃, and r₄ describe the moving links with directions chosen around the loop. Their positions must satisfy this closure as the mechanism moves. Changing a link length or pivot location changes the motion allowed by that geometry.

We turned the layout into physical links, pivots, and joints and built a working door-opening mechanism. Seeing the assembly move helped me understand how a small geometric change can affect the whole motion.
`,
  'easy-access-wallet': String.raw`
## A small access problem

This project started with the difficulty of pulling cards out of a compact holder. I developed a wallet layout around easier card access, then turned that requirement into a mechanical design concept.

The challenge was to make room for reaching and removing a card while keeping the holder compact. It helped me think about the movement the user needs before choosing a mechanism.

## Making space for the cards

A basic packaging check is:

$$
h_{\mathrm{inside}} \geq n\,t_{\mathrm{card}} + c
$$

n is the number of cards, t is card thickness, and c is the clearance allowed for the stack. This simplified relationship explains one of the layout constraints; it is not a manufacturing tolerance specification. Card access also depends on where the fingers can reach and how the stack is supported.

The completed work was an early design concept for easier card access. It was not a mass-produced product or a formal user study. The photograph above is a third-party card holder used as a reference for the topic.
`,
  'solar-smart-home': String.raw`
## Bringing the functions together

I built an Arduino-based smart-home model with several sensors and automated functions connected into one wired electronic system. I worked on the wiring and control logic, then debugged the connections and code until the functions operated together.

Working on the model taught me to trace a problem through the circuit and the code instead of assuming it belonged to only one of them.

## Adding a solar-power option

I added a photovoltaic cell power source and tested how the model behaved with that supply. The basic electrical relationship is:

$$
P = VI
$$

Power depends on both voltage and current. A supply needs to provide the conditions required by the connected electronics, including changes in demand as the functions operate. The equation is background for the power question, not a claimed measurement of the model’s solar output.

The project reached a working, debugged model with integrated sensors and a solar-power option. The reference photograph above shows an Arduino circuit, rather than my smart-home assembly.
`,
  'traffic-and-elevated-bus': String.raw`
## Learning through wired models

I built a smart traffic-light system and a separate transit elevated-bus model. Both were working electronic models, wired by hand with logic gates controlling their operating sequences.

For the traffic-light system, I connected the signal lights into a repeatable junction sequence. For the elevated-bus model, I built a separate control circuit, then traced faults in the connections and logic until the sequence behaved consistently.

## Thinking about the sequence

A simple way to express one signal-control requirement is:

$$
g_{\mathrm{NS}}\,g_{\mathrm{EW}} = 0
$$

If gᴺˢ and gᴱᵂ are binary indicators for conflicting green signals, this condition says they should not be active together. It illustrates the logic question in a model junction, rather than establishing compliance with real traffic-control standards.

These were early model-scale builds, not deployed transport systems. They gave me practice turning an operating sequence into a wired circuit and following faults when it did not behave as expected.
`,
};
