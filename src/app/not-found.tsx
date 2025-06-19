
import Link from 'next/link';
import Image from 'next/image';
import '../styles/not-found.css'; 

export default function NotFound() {
  return (
    <div className="fullscreen-nf-wrapper">
      <div className="page_404">
        <div className="container_nf">
          <div className="row_nf">  
            <div className="col_sm_12_nf ">
              <div className="col_sm_10_nf col_sm_offset_1_nf  text_center_nf">
                
                <div className="gif-background-container-nf">
                  <h1 className="main-404-text-nf">404</h1>
                </div>
                
                <div className="contant_box_404">
                   <Image
                    src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                    alt="Animated graphic of a lost page or connection error"
                    width={400} 
                    height={300} 
                    className="dribbble-gif-nf" 
                    unoptimized={true} 
                  />
                  <h1 className="contextual-404-text-nf">404</h1>
                  <h3 className="h2_nf">
                    Look like you&apos;re lost
                  </h3>
                  <p className="lost_subtext_nf">the page you are looking for not avaible!</p>
                  
                  <Link href="/" className="link_404">Go to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
