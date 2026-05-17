interface Particle {
  left: string;
  duration: string;
  delay: string;
  size: number;
  color: string;
}

const PARTICLES: Particle[] = [
  { left: "4%", duration: "15s", delay: "0s", size: 16, color: "#a8334c" },
  { left: "14%", duration: "19s", delay: "2s", size: 12, color: "#ff758c" },
  { left: "24%", duration: "17s", delay: "5s", size: 18, color: "#d5baff" },
  { left: "34%", duration: "21s", delay: "1s", size: 14, color: "#7336cd" },
  { left: "44%", duration: "16s", delay: "7s", size: 10, color: "#ffb2bb" },
  { left: "54%", duration: "20s", delay: "3s", size: 16, color: "#a8334c" },
  { left: "64%", duration: "18s", delay: "6s", size: 13, color: "#8d53e8" },
  { left: "74%", duration: "22s", delay: "4s", size: 15, color: "#ff758c" },
  { left: "88%", duration: "17s", delay: "1.5s", size: 18, color: "#a8334c" },
  { left: "9%", duration: "23s", delay: "9s", size: 11, color: "#d5baff" },
  { left: "22%", duration: "20s", delay: "11s", size: 14, color: "#a8334c" },
  { left: "38%", duration: "18s", delay: "10s", size: 16, color: "#7336cd" },
  { left: "52%", duration: "24s", delay: "12s", size: 10, color: "#ffb2bb" },
  { left: "66%", duration: "19s", delay: "8s", size: 13, color: "#8d53e8" },
  { left: "78%", duration: "21s", delay: "13s", size: 17, color: "#ff758c" },
  { left: "92%", duration: "16s", delay: "9.5s", size: 12, color: "#a8334c" },
  { left: "30%", duration: "25s", delay: "15s", size: 9, color: "#d5baff" },
  { left: "70%", duration: "22s", delay: "14s", size: 15, color: "#7336cd" },
];

function HeartSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function FloatingParticles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="floating-particle"
          style={{
            left: p.left,
            bottom: "-20px",
            animationDuration: p.duration,
            animationDelay: p.delay,
            width: p.size,
            height: p.size,
            color: p.color,
            fontSize: "unset",
          }}
        >
          <HeartSvg />
        </span>
      ))}
    </div>
  );
}
