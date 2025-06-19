// src/app/not-found.tsx
import Link from 'next/link';
import Image from 'next/image';
import '../styles/not-found.css'; // Ensure this path is correct

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper">
      <div className="page_404"> {/* Main content block */}
        <div className="gif-background-container-nf">
          <h1 className="main-404-text-nf">404</h1>
        </div>
        <div className="illustration-container-nf"> {/* Container for the main illustration */}
          <Image
            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            alt="Animated 404 error graphic - Page Not Found"
            width={400}
            height={300}
            className="illustration-image-nf"
            unoptimized={true} // Important for GIFs
            priority // Load this image eagerly
          />
        </div>
        <div className="contant_box_404">
          <h3 className="lost-heading-nf">Look like you&apos;re lost</h3>
          <p className="lost-subtext-nf">The page you are looking for is not available!</p>
          <Link href="/" className="go-home-btn-nf">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
