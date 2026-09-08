import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'About',
  description:
    'P S Mithul Sourav, final-year mechanical engineering student at NITK Surathkal. Background, engineering experience, and research interests.',
};
const skills = [
  [
    'Mechanical design',
    'SolidWorks · 3D CAD & assemblies · Mechanical packaging · Mechanism design',
  ],
  [
    'Modeling & simulation',
    'ANSYS Mechanical · Modal & harmonic FEM · MATLAB · Dynamic-system modeling',
  ],
  [
    'Robotics & computation',
    'Python · C · C++ · State estimation · Data analysis · Regression & machine learning',
  ],
  [
    'Mechatronics & test',
    'QGroundControl · Hardware bring-up · IMU calibration support · Test planning · Verification & validation',
  ],
];
export default function About() {
  return (
    <main id="main" className="about-page">
      <section className="about-hero shell">
        <p className="eyebrow">A LITTLE CONTEXT</p>
        <h1>
          An engineer.
          <br />
          <em>Still asking why.</em>
        </h1>
        <div className="about-introduction">
          <p>
            I’m P S Mithul Sourav, a final-year Mechanical Engineering student
            at NITK Surathkal, interested in the point where mechanical design
            meets sensing, computation, and control.
          </p>
          <p>
            My work spans compliant robotic mechanisms, structural dynamics,
            navigation under uncertainty, and the practical details of
            integrating hardware. I’m especially drawn to understanding how a
            system behaves before deciding how to improve it.
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
          <p className="body-muted">
            Selected coursework: Mechatronics; Control Systems; Instrumentation
            and Measurement; Finite Element Methods; Engineering Mathematics;
            Probability and Statistics.
          </p>
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
          <p className="education-degree">Product Intern · Bengaluru, India</p>
          <p className="body-muted">
            At Vayu Aerospace Pvt. Ltd., I worked on the physical integration
            and bring-up of UAV avionics hardware.
          </p>
          <ul className="prose-list">
            <li>
              Built SolidWorks models from measured dimensions, mounting points,
              and connector locations; integrated them into the existing
              assembly to check fit, clearances, cable routing, and
              serviceability.
            </li>
            <li>
              Supported electrical and power-path checks around the flight
              controller, IMU calibration in QGroundControl, and motor mapping
              and rotation checks without propellers.
            </li>
            <li>
              Documented mounting, wiring, sensor-detection, and motor-mapping
              issues in a subsystem checklist and repeated checks after fixes.
            </li>
          </ul>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">03 / TOOLKIT</p>
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
          <p className="eyebrow">04 / WIDER EXPERIENCE</p>
        </div>
        <div className="about-body">
          <p className="large-body">
            Engineering is also about people, trade-offs, and making things work
            together.
          </p>
          <div className="compact-experience">
            <div>
              <h3>Napses Technologies</h3>
              <p>Product & Strategy Intern</p>
            </div>
            <span>May — Jun 2026</span>
            <p>
              Translated recurring BriskFit user problems into product
              requirements, interface changes, operating rules, and SOPs; worked
              with teams through testing and release review.
            </p>
          </div>
          <div className="compact-experience">
            <div>
              <h3>Thinkify Labs</h3>
              <p>Product & Strategy Intern</p>
            </div>
            <span>May — Aug 2025</span>
            <p>
              Worked on lead qualification, workflow improvement, a website
              overhaul, and targeted outreach.
            </p>
          </div>
          <div className="compact-experience">
            <div>
              <h3>ILO Consulting</h3>
              <p>Investment Banking Intern</p>
            </div>
            <span>May — Jul 2024</span>
            <p>
              Built financial models for M&A due diligence and developed a
              market-entry assessment for Ireland.
            </p>
          </div>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">05 / BEYOND THE WORKBENCH</p>
        </div>
        <div className="about-body">
          <div className="recognition-grid">
            <div>
              <span className="big-figure">500+</span>
              <h3>Participants, ISTE NITK</h3>
              <p>
                As Secretary, led sponsor outreach, budgeting, vendor
                coordination, and event logistics; secured three sponsors.
              </p>
            </div>
            <div>
              <span className="big-figure">Top 50</span>
              <h3>Global Case Competition at Harvard, 2026</h3>
              <p>
                Worked in a four-member team analyzing the European defence
                landscape.
              </p>
            </div>
          </div>
          <p className="body-muted">
            I also managed the NH66 student fund, mentored three junior
            analysts, and co-led a campus venture that served more than 400
            customers.
          </p>
        </div>
      </section>
      <section className="about-section shell">
        <div className="section-label">
          <p className="eyebrow">06 / EARLY EXPLORATIONS</p>
        </div>
        <div className="about-body early-projects">
          <div>
            <span className="eyebrow">SEMESTER 3</span>
            <h3>Four-bar door-opening mechanism</h3>
            <p>
              Co-developed and built a linkage as a team, working through
              kinematic constraints, link geometry, and mechanism motion.
            </p>
          </div>
          <div>
            <span className="eyebrow">SEMESTER 1</span>
            <h3>A wallet for easier card access</h3>
            <p>
              A design-thinking course concept responding to the difficulty of
              removing cards from existing holders.
            </p>
          </div>
        </div>
      </section>
      <section className="contact-section shell">
        <p className="eyebrow">LET’S COMPARE NOTES</p>
        <h2>
          Good work starts
          <br />
          <em>with a conversation.</em>
        </h2>
        <a href="mailto:psmithul@gmail.com" className="contact-email">
          psmithul@gmail.com <ArrowUpRight />
        </a>
        <div className="contact-actions">
          <a
            className="text-link"
            href="/Mithul-Sourav-CV.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Read my full CV <ArrowUpRight size={18} />
          </a>
          <Link className="text-link" href="/#work">
            Explore the projects <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
