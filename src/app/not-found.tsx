
import Link from 'next/link';
import Image from 'next/image';
import '../styles/not-found.css'; 

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper">
      <div className="content-nf">
        {/* Container for the GIF and the "404" text on top of it */}
        <div className="gif-background-container-nf">
          <h1 className="main-404-text-nf">404</h1>
        </div>

        {/* Content below the GIF section */}
        <div className="caveman-image-container-nf">
          <Image
            src="https://placehold.co/300x200.png" 
            alt="Caveman illustration indicating a lost page"
            width={300} 
            height={200}
            className="caveman-image-nf"
            data-ai-hint="caveman confused"
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
