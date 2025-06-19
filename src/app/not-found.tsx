
// src/app/not-found.tsx
import Link from 'next/link';
import Image from 'next/image';
import '../styles/not-found.css'; // Import the custom CSS

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper">
      <div className="content-nf">
        <h1 className="top-404-nf">404</h1>
        <div className="caveman-image-container-nf">
          <Image
            src="https://placehold.co/350x250.png" 
            alt="Caveman illustration indicating a lost page"
            width={350} 
            height={250}
            className="caveman-image-nf"
            data-ai-hint="caveman confused lost"
          />
        </div>
        <h3 className="lost-heading-nf">Look like you&apos;re lost</h3>
        <p className="lost-subtext-nf">the page you are looking for not avaible!</p>
        <Link href="/" className="go-home-btn-nf">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
