
// src/app/not-found.tsx
import Link from 'next/link';
import '../styles/not-found.css'; // Import the custom CSS

export default function NotFound() {
  return (
    <section className="page_404">
      <div className="container_404"> {/* Changed class to avoid conflict if Bootstrap was ever added */}
        <div className="row_404">
          <div className="col_sm_12_404">
            <div className="col_sm_10_offset_1_404 text_center_404">
              <div className="four_zero_four_bg">
                <h1 className="text_center_404">404</h1>
              </div>
              <div className="contant_box_404">
                <h3 className="h2_404">Look like you&apos;re lost</h3>
                <p>The page you are looking for is not available!</p>
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
