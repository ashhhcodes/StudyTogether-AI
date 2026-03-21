export function BackgroundAnimations() {
  return (
    <>
      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(2deg);
          }
          50% {
            transform: translate(-5px, -25px) rotate(-1deg);
          }
          75% {
            transform: translate(-15px, -10px) rotate(1deg);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(-12px, 18px) rotate(-2deg);
          }
          66% {
            transform: translate(8px, -12px) rotate(1deg);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          30% {
            transform: translate(15px, 10px) rotate(1deg);
          }
          60% {
            transform: translate(-10px, 20px) rotate(-2deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 45s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 50s ease-in-out infinite;
          animation-delay: -15s;
        }

        .animate-float-reverse {
          animation: float-reverse 55s ease-in-out infinite;
          animation-delay: -25s;
        }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        {/* Floating Book */}
        <div className="absolute top-[10%] left-[5%] opacity-[0.04] animate-float-slow">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 20 L15 60 L50 60 L50 20 L15 20 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M20 30 L45 30 M20 40 L45 40 M20 50 L40 50" stroke="currentColor" strokeWidth="1.5" />
            <path d="M50 20 C55 25, 55 55, 50 60" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Floating Pencil */}
        <div className="absolute top-[60%] right-[8%] opacity-[0.05] animate-float-delayed">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 70 L70 30 L75 35 L35 75 L30 70 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M70 30 L75 25 L80 30 L75 35 L70 30 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.3" />
            <path d="M30 70 L25 75 L35 75 L30 70 Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Floating Note Paper */}
        <div className="absolute bottom-[15%] left-[12%] opacity-[0.04] animate-float-reverse">
          <svg width="70" height="90" viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10 L60 10 L60 80 L10 80 L10 10 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M20 25 L50 25 M20 35 L50 35 M20 45 L50 45 M20 55 L45 55" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Floating Coffee Cup */}
        <div className="absolute top-[40%] left-[85%] opacity-[0.05] animate-float-slow">
          <svg width="60" height="70" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 25 L15 45 C15 52, 22 55, 30 55 C38 55, 45 52, 45 45 L45 25 L15 25 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M45 30 L50 30 C55 30, 55 40, 50 40 L45 40" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 25 L48 25" stroke="currentColor" strokeWidth="2" />
            <path d="M25 15 L25 20 M35 15 L35 20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Floating Notebook */}
        <div className="absolute top-[75%] right-[25%] opacity-[0.04] animate-float-delayed">
          <svg width="85" height="65" viewBox="0 0 85 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10 L70 10 L70 55 L20 55 L20 10 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M30 10 L30 55 M35 10 L35 55" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <path d="M45 22 L60 22 M45 30 L60 30 M45 38 L60 38 M45 46 L57 46" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Floating Pen */}
        <div className="absolute top-[25%] right-[40%] opacity-[0.05] animate-float-reverse">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 65 L65 25 L70 30 L30 70 L25 65 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M65 25 L68 22 L72 26 L70 30 L65 25 Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Small Sticky Note */}
        <div className="absolute bottom-[40%] right-[15%] opacity-[0.04] animate-float-slow">
          <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10 L45 10 L45 45 L10 45 L10 10 Z" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M18 22 L37 22 M18 30 L37 30" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Floating Highlighter */}
        <div className="absolute top-[50%] left-[25%] opacity-[0.05] animate-float-delayed">
          <svg width="95" height="85" viewBox="0 0 95 85" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 60 L65 25 L70 30 L35 65 L30 60 Z" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" />
            <path d="M65 25 L72 18 L77 23 L70 30 L65 25 Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </>
  );
}