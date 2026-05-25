export const Card = ({ className = "", children }) => (
  <div className={`rounded-[28px] border border-black/10 bg-white/80 shadow-[0_25px_70px_rgba(17,19,24,0.08)] backdrop-blur-xl ${className}`}>{children}</div>
);
