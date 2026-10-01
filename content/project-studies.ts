// Equations explain the underlying models. They are not additional test results.
export const projectStudies: Record<string, string> = {
  'uav-vibration-integration': String.raw`
## Following the vibration path

During my product internship at Vayu Aerospace, I worked on how motor and airframe vibration reached the flight-controller IMU. A mount could fit the controller perfectly and still pass too much vibration into it. I needed to understand the support, the controller, and the connections around them as one assembly.

I compared a rigid baseline, an elastomer-isolated tray, and a suspended mount in ANSYS. Natural frequencies and mode shapes helped explain how each arrangement changed the vibration path. The response analysis then helped us shortlist the isolation concepts for hardware evaluation.

## From the model to the assembly

When we integrated the shortlisted mounts, I checked the CAD fit, clearances, fasteners, cable slack, and controller orientation. These details mattered because a tight cable or an unintended contact could create another path for vibration, even if the mount itself was compliant.

The assembled mounts were tested through ground motor runs. I used MATLAB to inspect the IMU time histories and FFT spectra, alongside the RMS levels. For a sampled acceleration signal, RMS is:

$$
a_{\mathrm{RMS}} = \sqrt{\frac{1}{N}\sum_{i=1}^{N} a_i^2}
$$

Here, N is the number of samples and aᵢ is the acceleration sample being compared. An RMS value only makes sense beside the processing choices and operating window: the same axis, units, motor condition, and treatment of the signal. The FFT adds another view by showing which frequencies contribute to the response.

## What the comparison supported

The team selected the elastomer-isolated modular tray after combining the simulation, hardware integration, and IMU analysis. My contribution covered mount modeling, integration, ground tests, and analysis of the logs.

The useful lesson for me was how easily an isolation idea can change during assembly. Checking the vibration path in the real hardware was as important as comparing the modeled supports.
`,
  'adaptive-suspension-rover': String.raw`
## The question behind the rover

I’m designing a six-wheel rover around a question I want to test: can the suspension change stiffness before vibration forces the rover to slow down? On rough terrain, speed is only one part of the problem. The suspension also changes how disturbances reach the body and its sensors.

The design uses adjustable spring leverage to create soft, medium, and stiff settings. Each setting has a mechanical lock. A separate load path keeps the rover supported if the stiffness-changing mechanism fails, so maintaining support does not depend on successfully reconfiguring the suspension.

## What changing stiffness changes

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

## The control loop

The planned controller uses IMU and wheel-encoder data to identify sustained vibration. It requests a stiffness change, verifies the new setting, and measures the response again. If reconfiguration does not reduce the vibration enough, it can then reduce speed.

Verification matters here. Asking a mechanism to move and knowing that it reached a locked state are different things. The control design needs to account for that difference before it can make sensible decisions about speed.

## The next tests

The project is in the design stage. I’m structuring validation from a single suspension unit through full rover trials. The comparison will include fixed stiffness, speed-only control, stiffness-only control, and the combined system.

Those tests should show whether reconfiguration helps, where it does not, and what it costs in time and energy. I want the next design decision to follow from those measurements.
`,
  'tensegrity-joint': String.raw`
## A joint whose stiffness can change

I’m studying how a tensegrity joint responds when its geometry and internal loading change. The longer-term interest is a wearable or exoskeleton joint, where the same mechanism may need to give way in one situation and resist motion in another.

My current work is a MATLAB study of member forces, force output, and joint stiffness. I vary geometry, external loading, and internal force to understand which changes have the largest effect, then use those comparisons to narrow the design.

## Following the member forces

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

## Connecting the analysis to the mechanism

The CAD views help me inspect the geometry and how the joint fits into a leg assembly. They are a paper-based mechanism reconstruction used for study, drawing on [Mortensen and colleagues’ tensegrity leg design](https://arxiv.org/abs/2504.19685).

![Native SolidWorks view of the full tensegrity leg study, showing the joint within the surrounding assembly.](/images/projects/tensegrity-leg-cad.webp)

_Full leg assembly · Native SolidWorks view from the paper-based CAD reconstruction. This is a mechanism study, not tested hardware._

The next step is to carry a small set of useful configurations into a physical prototype. The modeling is still ongoing; the wearable application is a direction for later development.
`,
  kneeassist: String.raw`
## Starting with a passive mechanism

This team project began as a passive spring-assisted knee concept. We wanted to understand how spring placement and joint geometry changed the assistance available through the motion. That meant looking at the force path and usable movement together.

I modeled and refined the mechanism in SolidWorks, using ANSYS and interference checks to identify layouts that could move through the intended flexion range. Moving a spring attachment could change both the assistance and the clearance, so those decisions needed to be checked together.

## From spring force to knee assistance

A first-order model connects spring extension to force, and force to the assistance torque:

$$
\begin{aligned}
F_s &= k_s\,\Delta\ell \\
\tau_a(\theta) &= F_s\,r_\perp(\theta)
\end{aligned}
$$

Fₛ is spring force, kₛ is spring stiffness, and Δℓ is extension from the spring’s unloaded length. The perpendicular moment arm r⊥ changes with knee angle θ. These equations explain why the attachment geometry matters: the same spring force can produce a different torque at a different angle.

This is an idealized relationship for understanding the design. Friction, cable routing, spring behavior, and the physical assembly still need bench measurements.

## Extending the design into an actuated brace

We developed the passive concept into an actuated knee assistance system that tracks knee angle and adds controlled cable-and-spring assistance while the user extends actively.

The system definition includes adjustable rails and cuffs, the motor drive, angle sensing, protected power, and an independent manual release. The CAD screenshot above shows this actuated layout. The release is part of the mechanical design, rather than relying only on a software command to stop assistance.

## Where the project reached

The design reached a procurement-ready system, with bench checks defined for angle accuracy, spring force, assisted motion, jam release, faults, and cycle life. Our team placed in the top 5 of 70 teams nationwide in the Incubate X Prosthetic Challenge.

The completed work covers the design and system definition. Procurement and bench testing are the next steps; there are no clinical or human-performance results to report from this work.
`,
  'reaction-wheel-microvibrations': String.raw`
## Looking at the camera interface

I modeled how reaction-wheel microvibration travels from the wheel mount through a satellite panel to the camera interface. I wanted to follow the disturbance to the payload location, rather than stop at identifying where the panel resonates.

The study uses modal and harmonic FEM. Modal analysis identifies the structure’s modes and natural frequencies. Harmonic analysis then examines its response to periodic excitation.

## The harmonic model

For a linear structural model, the frequency-domain equation can be written as:

$$
\left(K-\omega^2 M+\mathrm{i}\omega C\right)\hat{q}=\hat{f}
$$

M, C, and K are the mass, damping, and stiffness matrices. The complex displacement amplitude q̂ is the response to the force amplitude f̂ at angular frequency ω. Evaluating the camera interface connects this model to the location of interest.

Wheel speed also needs to be related carefully to excitation frequency. For the fundamental rotational frequency:

$$
f_{\mathrm{rot}} = \frac{n}{60}
$$

n is rotational speed in rpm and fᵣₒₜ is in hertz. Other excitation components can occur at harmonics of that frequency; the relationship alone does not define every disturbance produced by a wheel.

![Sectioned reaction-wheel reference CAD showing the rotor, housing, shaft, and support plate.](/images/projects/reaction-wheel-cutaway.webp)

_Section view from the verified reference assembly. Surface finishes are illustrative; this is CAD, not a photograph or a FEM response plot._

## Checking the response peak

The model showed a strong camera response near 5,800 rpm. I refined the mesh to test whether the peak depended too strongly on the discretization. The amplitude changed by 0.33% between the compared meshes.

That number is a mesh-sensitivity result. It does not establish experimental accuracy, but it helps assess whether the peak is stable under the particular refinement being compared.

## Exploring a faster predictor

I structured a 24-design parameter sweep and a held-out regression check to explore when a surrogate model could follow the FEM response. Resonance is an important place to examine its errors: a smooth-looking prediction could still miss a narrow peak.

The completed work is a simulation study and regression-evaluation workflow. Experimental validation remains separate.
`,
  'off-road-leaf-robot': String.raw`
## Picking up leaves on uneven ground

I’m working on a robot that collects dry and wet leaves without pulling in too much soil. A mechanism that works on a flat, clean surface may behave very differently when the leaves are damp, the ground changes height, or the wheels lose traction.

I separated the design into locomotion, pickup, transfer, storage, and terrain-following systems. This lets me test the important functions before committing to the full robot.

## Choosing a mechanism in context

The pickup mechanism has to fit beside the wheels and transfer system, move material into storage, and stay close enough to uneven ground. I compared concepts against space, manufacturability, and integration limits, then built a bottom-up BOM around the practical options.

The next tests need to distinguish picking up more material from picking up the right material. One proposed measure of pickup efficiency is:

$$
\eta_{\mathrm{pickup}}
=\frac{m_{\mathrm{leaves,\ collected}}}{m_{\mathrm{leaves,\ available}}}
$$

The numerator is the mass of leaves collected, and the denominator is the leaf mass available in a defined test area. Soil needs to be measured separately. A high pickup ratio would not be enough if much of the collected load were soil.

## What I’m preparing to test

The architecture, mechanism screening, and BOM support the next design decisions. I’ve defined tests for traction, pickup efficiency, soil rejection, and endurance.

The work is ongoing. These measures describe the planned evaluation; I do not have pickup or endurance results to report yet. I want subsystem tests to show where the design needs to change before building the complete machine.
`,
  'uncertainty-aware-navigation': String.raw`
## Giving the robot an imperfect estimate

I built a differential-drive simulator with A* path planning, heading control, wheel encoders, an IMU, and extended Kalman filter localization. The question was what the robot should do when its estimate of its own position becomes unreliable.

I injected encoder noise, IMU drift, yaw bias, and wheel slip. This made it possible to inspect failures that would be hidden by perfect simulated sensing.

## Connecting wheel motion to the estimate

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

## Deciding when to slow down or recover

I implemented confidence-aware speed and recovery logic so the robot could respond when localization became unreliable. Planning a route, following it, and deciding whether to trust the current state estimate all belong in the navigation loop.

## Looking beyond arrival

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
