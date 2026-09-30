import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'About',
  description:
    'Mithul Sourav, Mechanical Engineering at NITK Surathkal. Research in field robotics, dynamics, vibration, sensing, control, and mechatronic systems.',
};
const skills = [
  ['Design & simulation', 'SolidWorks · ANSYS Mechanical · MATLAB'],
  ['Programming', 'Python · MATLAB · C · C++'],
  [
    'Research interests',
    'Experimental and field robotics · Rough-terrain mobile robots · Dynamics and vibration · Sensing, control, and autonomy',
  ],
  ['Languages', 'English · Hindi · Tamil · French (basic)'],
];
export default function About() {
  return (
    <main id="main" className="about-page">
      <section className="about-hero shell">
        <p className="eyebrow">ABOUT</p>
        <h1>Hi, I’m Mithul.</h1>
        <div className="about-introduction">
          <p>
            I’m P S Mithul Sourav, a final-year Mechanical Engineering student
            at NITK Surathkal. I expect to graduate in June 2027.
          </p>
          <p>
            I like going deep into an idea: where it came from, why it works,
            and how people figured it out. My projects bring together mechanical
            design, electronics, and software. Building gives me a way to test
            what I’ve understood and find the questions I missed.
          </p>
          <p>
            Right now, I’m designing robots for uncertain terrain, including a
            rover with adjustable suspension and a leaf-collection robot. I’m
            also studying a tensegrity joint with variable stiffness. I like
            hard problems where sensing, control, and the mechanism all affect
            each other. Space is another interest I keep coming back to.
          </p>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">01 / EDUCATION</p>
          <span>Surathkal, India</span>
        </div>
        <div className="about-body">
          <h2>National Institute of Technology Karnataka</h2>
          <p className="education-degree">B.Tech. in Mechanical Engineering</p>
          <div className="education-meta">
            <span>August 2023 — June 2027</span>
            <span>
              CGPA <strong>7.37 / 10</strong>
            </span>
          </div>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">02 / ENGINEERING EXPERIENCE</p>
        </div>
        <div className="about-body">
          <div className="experience-heading">
            <h2>Vayu Aerospace</h2>
            <span className="eyebrow">JUN — JUL 2026</span>
          </div>
          <p className="education-degree">
            Product Intern · UAV Vibration Analysis & Isolation
          </p>
          <p className="body-muted">
            Bengaluru, India. I traced vibration from the motors and airframe to
            the flight-controller IMU, then compared and tested three mounting
            arrangements.
          </p>
          <ul className="prose-list">
            <li>
              Compared a rigid baseline, an elastomer-isolated modular tray, and
              a suspended mount using ANSYS modal and response-oriented
              analysis. Shortlisted the two isolation concepts for hardware
              evaluation.
            </li>
            <li>
              Integrated the shortlisted mounts, checked fit, cable slack,
              clearances, and fasteners, then tested them through ground motor
              runs.
            </li>
            <li>
              Analyzed controller IMU logs in MATLAB using comparable steady
              windows, RMS reduction, and FFT review. This contributed to
              selecting the elastomer-isolated modular tray as the preferred
              design direction.
            </li>
          </ul>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">03 / ONGOING PROJECTS</p>
        </div>
        <div className="about-body skill-list">
          <div>
            <h3>Adaptive suspension rover</h3>
            <p>
              A six-wheel rough-terrain rover with mechanically locked stiffness
              settings and a vibration-aware control loop.
            </p>
            <Link className="text-link" href="/work/adaptive-suspension-rover">
              Explore the rover
            </Link>
          </div>
          <div>
            <h3>Tensegrity joint</h3>
            <p>
              MATLAB force and stiffness calculations for a tensegrity-based
              variable-stiffness joint.
            </p>
            <Link className="text-link" href="/work/tensegrity-joint">
              Explore the joint
            </Link>
          </div>
          <div>
            <h3>Leaf-collection robot</h3>
            <p>
              A robot architecture that connects locomotion, pickup, transfer,
              storage, and terrain following.
            </p>
            <Link className="text-link" href="/work/off-road-leaf-robot">
              Explore the robot
            </Link>
          </div>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">04 / TOOLKIT</p>
        </div>
        <div className="about-body skill-list">
          {skills.map(([title, body]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">05 / WIDER EXPERIENCE</p>
        </div>
        <div className="about-body">
          <div className="compact-experience">
            <div>
              <h3>Thinkify Labs</h3>
              <p>Product and Strategy Intern · Workflow Automation</p>
            </div>
            <span>May — Aug 2025</span>
            <p>
              Built an AI-based lead-qualification workflow using profile and
              email data, then routed qualified prospects to sales
              representatives. The work contributed to a reported 25%
              improvement in operational efficiency.
            </p>
          </div>
          <div className="compact-experience">
            <div>
              <h3>ILO Consulting</h3>
              <p>Investment Banking Intern</p>
            </div>
            <span>May — Jul 2024</span>
            <p>
              Built DCF, LBO, and three-statement financial models for M&A due
              diligence and transaction analysis. Contributed to an Ireland
              market-entry assessment covering political, regulatory, and
              competitive factors.
            </p>
          </div>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">06 / LEADERSHIP & RECOGNITION</p>
        </div>
        <div className="about-body recognition-grid">
          <div>
            <span className="big-figure">5 / 70</span>
            <h3>Incubate X Prosthetic Challenge</h3>
            <p>
              Our KneeAssist team was selected in the top 5 of 70 teams
              nationwide in September 2026.
            </p>
          </div>
          <div>
            <span className="big-figure">500+</span>
            <h3>ISTE, NITK · Secretary</h3>
            <p>
              September 2024 — Present. Led sponsorship, budgeting, vendor
              coordination, and logistics for a technical event with 500+
              participants. Secured three sponsors.
            </p>
          </div>
          <div>
            <span className="big-figure">₹150K</span>
            <h3>NH66 Fund, P&L Club · Fund Manager</h3>
            <p>
              January 2025 — April 2026. Directed strategy for the student-run
              fund and mentored three junior analysts. Organized two recruitment
              drives and a training workshop.
            </p>
          </div>
          <div>
            <span className="big-figure">Top 50</span>
            <h3>Global Case Competition at Harvard</h3>
            <p>
              February — March 2026. Advanced to a Top 50 global placement in a
              team of four, analyzing the European defence landscape.
            </p>
          </div>
        </div>
      </section>
      <section className="lab-contact shell">
        <p className="eyebrow">GET IN TOUCH</p>
        <a href="mailto:psmithul@gmail.com">
          Let’s talk<span>.</span>
        </a>
        <p>psmithul@gmail.com</p>
        <div className="about-contact-links">
          <a
            href="/Mithul-Sourav-CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="quiet-link"
          >
            Read my CV
          </a>
          <Link href="/#work" className="quiet-link">
            Explore the projects
          </Link>
        </div>
      </section>
    </main>
  );
}
