
// src/app/not-found.tsx
import Link from 'next/link';
import '../styles/not-found.css'; // Import the custom CSS

export default function NotFound() {
  return (
    <section className="page_404">
      <div className="container"> {/* Use original class name */}
        <div className="row"> {/* Use original class name */}
          <div className="col-sm-12"> {/* Use original class name */}
            {/* This div uses multiple classes as per original HTML */}
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
                {/* h1 has text-center class from parent, but explicit class can be kept if desired from original */}
                <h1 className="text-center">404</h1>
              </div>
              <div className="contant_box_404">
                {/* Original class for h3 was "h2" */}
                <h3 className="h2">Look like you&apos;re lost</h3>
                <p>the page you are looking for not avaible!</p> {/* Typo from user's original, kept for fidelity */}
                <Link href="/" className="link_404">
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
