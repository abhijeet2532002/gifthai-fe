import { useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
  zoom?: number;
}

export const ImageMagnifier = ({ src, alt, zoom = 2.2 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const x = ((point.clientX - rect.left) / rect.width) * 100;
    const y = ((point.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      onTouchMove={handleMove}
      className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl bg-muted shadow-card"
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-smooth"
        style={{
          transformOrigin: `${pos.x}% ${pos.y}%`,
          transform: active ? `scale(${zoom})` : "scale(1)",
        }}
        draggable={false}
      />
      {active && (
        <div
          className="pointer-events-none absolute hidden h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-foreground/70 shadow-elegant ring-2 ring-primary/40 md:block"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        />
      )}
    </div>
  );
};
