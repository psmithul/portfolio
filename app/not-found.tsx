import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return (
    <main id="main" className="not-found shell">
      <p className="eyebrow">404 / OFF THE MAP</p>
      <h1>
        This page is
        <br />
        <em>uncharted territory.</em>
      </h1>
      <p>The link may have changed, or the page may not be published yet.</p>
      <Link href="/" className="button primary">
        <ArrowLeft size={18} /> Back to the portfolio
      </Link>
    </main>
  );
}
