import { Mail } from 'lucide-react';

export function SocialLinks() {
  return (
    <nav className="academic-social" aria-label="Contact and social profiles">
      <a href="mailto:psmithul@gmail.com" aria-label="Email Mithul">
        <Mail aria-hidden="true" />
      </a>
      <a href="https://github.com/psmithul" aria-label="GitHub">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
          aria-hidden="true"
        >
          <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.82c.56.1.77-.24.77-.54v-2.12c-3.12.68-3.78-1.33-3.78-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.4-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.54 0-1.22.44-2.22 1.16-3.01-.12-.29-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.67.11 2.96.73.79 1.16 1.79 1.16 3.01 0 4.3-2.63 5.25-5.14 5.53.4.35.76 1.03.76 2.08v3.24c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/psmithulsourav"
        aria-label="LinkedIn"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none"
          aria-hidden="true"
        >
          <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3ZM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-5.1c0-1.2-.5-1.9-1.5-1.9-1.1 0-1.7.8-1.7 1.9V19h-3V9h2.9v1.3A3.3 3.3 0 0 1 15.6 9c2.1 0 3.4 1.4 3.4 4Z" />
        </svg>
      </a>
    </nav>
  );
}
