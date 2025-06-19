
// src/app/not-found.tsx
import Link from 'next/link';
import '../styles/not-found.css'; // Import the custom CSS

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper"> {/* Fullscreen wrapper */}
      <section className="page_404">
        <div className="container_nf"> {/* Use custom class name for container */}
          <div className="row_nf"> {/* Use custom class name for row */}
            <div className="col_sm_12_nf "> {/* Use custom class name */}
              {/* This div uses multiple classes as per original HTML */}
              <div className="col_sm_10_nf col_sm_offset_1_nf text_center_nf">
                <div className="four_zero_four_bg">
                  {/* The GIF itself often contains "404", this h1 is text on top */}
                  <h1 className="text_center_nf ">404</h1>
                </div>
                
                <div className="contant_box_404">
                  <h3 className="h2_nf">
                  Look like you&apos;re lost
                  </h3>
                  
                  <p>the page you are looking for not avaible!</p>

                  {/* Prominent "404" text placed here */}
                  <h1 className="text_center_nf internal_404_text_nf">404</h1>
                  
                  <Link href="/" className="link_404">
                    Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
