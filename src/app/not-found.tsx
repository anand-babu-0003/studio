
"use client";

import Link from 'next/link';
import Image from 'next/image';
import '../styles/not-found.css'; // Ensure this path is correct
import { Button } from '@/components/ui/button'; // Import ShadCN Button

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper">
      <div className="content-nf">
        <h1 className="text-404-nf">404</h1>
        <div className="illustration-container-nf">
          <Image
            src="https://placehold.co/400x300.png" 
            alt="Illustration for Page Not Found"
            width={400}
            height={300}
            className="illustration-image-nf"
            data-ai-hint="lost map" 
            priority
          />
        </div>
        <h3 className="heading-nf">Look like you&apos;re lost</h3>
        <p className="subtext-nf">The page you are looking for is not available!</p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/">
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
