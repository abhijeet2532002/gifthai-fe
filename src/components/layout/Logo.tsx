import { Link } from "react-router-dom";

export const Logo = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`group flex items-center gap-2 ${className}`} aria-label="Aurum & Co. home">
    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-sm transition-base group-hover:shadow-glow">
      <span className="font-display text-lg font-semibold leading-none">A</span>
    </span>
    <span className="font-display text-xl font-semibold tracking-tight">
      Aurum<span className="text-muted-foreground"> & Co.</span>
    </span>
  </Link>
);
