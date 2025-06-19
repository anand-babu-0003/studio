
import Link from 'next/link';
import Image from 'next/image';
import '../styles/not-found.css';

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper">
      <div className="content-nf">
        <h1 className="top-404-text-nf">404</h1>
        <div className="illustration-container-nf">
          <Image
            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            alt="Animated graphic of a page not found or connection error"
            width={400}
            height={300}
            className="illustration-image-nf"
            unoptimized={true} 
            priority
          />
        </div>
        <h2 className="lost-heading-nf">Look like you&apos;re lost</h2>
        <p className="lost-subtext-nf">The page you are looking for is not available!</p>
        <Link href="/" className="go-home-btn-nf">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
