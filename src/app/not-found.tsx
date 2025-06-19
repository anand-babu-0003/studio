
import Link from 'next/link';
import Image from 'next/image';
import '../styles/not-found.css'; // Ensure this path is correct

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper">
      <div className="content-nf">
        <h1 className="text-404-nf">404</h1>
        <div className="illustration-container-nf">
          <Image
            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            alt="Animated 404 error graphic - Page Not Found"
            width={400} 
            height={300} 
            className="illustration-image-nf"
            unoptimized={true} 
            priority 
          />
        </div>
        <h3 className="heading-nf">Look like you&apos;re lost</h3>
        <p className="subtext-nf">The page you are looking for is not available!</p>
        <Link href="/" className="button-nf">
          Go to Home
        </Link>
      </div>
    </div>
  );
}
