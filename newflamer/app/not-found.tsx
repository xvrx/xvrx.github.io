import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <main className="page notfound">
        <p className="stamp">FILE NOT FOUND</p>
        <h1>404</h1>
        <p className="notfound-sub">
          This document was never filed, or the bureau shredded it.
        </p>
        <p>
          <Link className="cta" href="/">
            Return to headquarters <span aria-hidden="true">→</span>
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
