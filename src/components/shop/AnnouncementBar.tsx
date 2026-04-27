import { Sparkles } from "lucide-react";

const messages = [
  "Free worldwide shipping on orders over $75",
  "Hand-wrapped in our studio · Always",
  "New: Spring gift edit just landed",
  "Use code WELCOME for 10% off your first order",
];

export const AnnouncementBar = () => (
  <div className="overflow-hidden border-b border-border/60 bg-foreground py-2.5 text-background">
    <div className="flex animate-marquee gap-12 whitespace-nowrap will-change-transform">
      {[...messages, ...messages, ...messages, ...messages].map((m, i) => (
        <span key={i} className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em]">
          <Sparkles className="h-3 w-3" /> {m}
        </span>
      ))}
    </div>
  </div>
);
