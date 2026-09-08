import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return (
    <main id="main" className="not-found shell">
      <p className="eyebrow">404 / PAGE NOT FOUND</p>
      <h1>
        Nothing
        <br />
        <em>here yet.</em>
      </h1>
      <p>The link may have changed, or the page may not be published yet.</p>
      <Link href="/" className="button primary">
        <ArrowLeft size={18} /> Back to the portfolio
      </Link>
    </main>
  );
}
