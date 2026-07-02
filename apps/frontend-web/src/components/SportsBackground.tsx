import React from 'react';

export default function SportsBackground() {
  return (
    <div className="absolute top-[80px] bottom-[200px] left-0 right-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Badminton Shuttlecock 1 - Top Left */}
      <div 
        className="absolute top-[5%] left-[-2%] text-primary animate-bg-float-1"
        style={{ width: '140px', height: '140px', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M10 19a2 2 0 0 0 4 0v-2h-4v2z" />
          <path d="M12 4v13M8 6l4 11M16 6l-4 11M6 9h12" />
          <path d="M8 6c0-1.5 1.8-2 4-2s4 .5 4 2" />
        </svg>
      </div>

      {/* 2. Pickleball Paddle 1 - Top Right */}
      <div 
        className="absolute top-[14%] right-[-3%] text-primary animate-bg-float-2"
        style={{ width: '160px', height: '160px', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M5 6c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5v5c0 2-1.6 3.6-3.6 4H8.6C6.6 15 5 13.4 5 11.4V6z" />
          <path d="M11 15v6M9.5 21h3" />
        </svg>
      </div>

      {/* 3. Badminton Racket 1 - Upper-Mid Left */}
      <div 
        className="absolute top-[24%] left-[-3%] text-primary animate-bg-float-3"
        style={{ width: '160px', height: '160px', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <ellipse cx="12" cy="7" rx="4" ry="5" />
          <path d="M12 2v10M9.5 7h5M10 4.5h4M10 9.5h4" />
          <path d="M12 12v9M11 21h2" />
        </svg>
      </div>

      {/* 4. Pickleball Ball 1 - Upper-Mid Right */}
      <div 
        className="absolute top-[34%] right-[-2%] text-primary animate-bg-float-1"
        style={{ width: '120px', height: '120px', animationDelay: '-3s', opacity: 0.04 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="7" r="0.8" fill="currentColor" />
          <circle cx="12" cy="17" r="0.8" fill="currentColor" />
          <circle cx="7" cy="12" r="0.8" fill="currentColor" />
          <circle cx="17" cy="12" r="0.8" fill="currentColor" />
          <circle cx="8.5" cy="8.5" r="0.8" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="0.8" fill="currentColor" />
          <circle cx="8.5" cy="15.5" r="0.8" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="0.8" fill="currentColor" />
        </svg>
      </div>

      {/* 5. Badminton Shuttlecock 2 - Mid Right */}
      <div 
        className="absolute top-[45%] right-[-2%] text-primary animate-bg-float-2"
        style={{ width: '140px', height: '140px', animationDelay: '-5s', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M10 19a2 2 0 0 0 4 0v-2h-4v2z" />
          <path d="M12 4v13M8 6l4 11M16 6l-4 11M6 9h12" />
          <path d="M8 6c0-1.5 1.8-2 4-2s4 .5 4 2" />
        </svg>
      </div>

      {/* 6. Pickleball Paddle 2 - Mid Left */}
      <div 
        className="absolute top-[55%] left-[-3%] text-primary animate-bg-float-3"
        style={{ width: '160px', height: '160px', animationDelay: '-1s', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M5 6c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5v5c0 2-1.6 3.6-3.6 4H8.6C6.6 15 5 13.4 5 11.4V6z" />
          <path d="M11 15v6M9.5 21h3" />
        </svg>
      </div>

      {/* 7. Badminton Racket 2 - Lower-Mid Right */}
      <div 
        className="absolute top-[66%] right-[-3%] text-primary animate-bg-float-1"
        style={{ width: '160px', height: '160px', animationDelay: '-4s', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <ellipse cx="12" cy="7" rx="4" ry="5" />
          <path d="M12 2v10M9.5 7h5M10 4.5h4M10 9.5h4" />
          <path d="M12 12v9M11 21h2" />
        </svg>
      </div>

      {/* 8. Pickleball Ball 2 - Lower-Mid Left */}
      <div 
        className="absolute top-[75%] left-[-2%] text-primary animate-bg-float-2"
        style={{ width: '120px', height: '120px', animationDelay: '-6s', opacity: 0.04 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="7" r="0.8" fill="currentColor" />
          <circle cx="12" cy="17" r="0.8" fill="currentColor" />
          <circle cx="7" cy="12" r="0.8" fill="currentColor" />
          <circle cx="17" cy="12" r="0.8" fill="currentColor" />
          <circle cx="8.5" cy="8.5" r="0.8" fill="currentColor" />
          <circle cx="15.5" cy="8.5" r="0.8" fill="currentColor" />
          <circle cx="8.5" cy="15.5" r="0.8" fill="currentColor" />
          <circle cx="15.5" cy="15.5" r="0.8" fill="currentColor" />
        </svg>
      </div>

      {/* 9. Badminton Shuttlecock 3 - Bottom Left */}
      <div 
        className="absolute top-[85%] left-[-2%] text-primary animate-bg-float-3"
        style={{ width: '140px', height: '140px', animationDelay: '-2s', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M10 19a2 2 0 0 0 4 0v-2h-4v2z" />
          <path d="M12 4v13M8 6l4 11M16 6l-4 11M6 9h12" />
          <path d="M8 6c0-1.5 1.8-2 4-2s4 .5 4 2" />
        </svg>
      </div>

      {/* 10. Pickleball Paddle 3 - Bottom Right */}
      <div 
        className="absolute top-[94%] right-[-3%] text-primary animate-bg-float-1"
        style={{ width: '160px', height: '160px', animationDelay: '-7s', opacity: 0.05 }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M5 6c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5v5c0 2-1.6 3.6-3.6 4H8.6C6.6 15 5 13.4 5 11.4V6z" />
          <path d="M11 15v6M9.5 21h3" />
        </svg>
      </div>
    </div>
  );
}
