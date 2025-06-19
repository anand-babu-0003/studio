
import type React from 'react';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fullscreen-loader-container">
      <div className="loader-content">
        <div className="loader">
          <div className="cell d-0"></div>
          <div className="cell d-1"></div>
          <div className="cell d-2"></div>

          <div className="cell d-1"></div>
          <div className="cell d-2"></div>
          
          
          <div className="cell d-2"></div>
          <div className="cell d-3"></div>
          
          
          <div className="cell d-3"></div>
          <div className="cell d-4"></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;

