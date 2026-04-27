import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Bestsellers", to: "/products" },
      { label: "Gift Cards", to: "/products" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Our Story", to: "/" },
      { label: "Journal", to: "/" },
      { label: "Press", to: "/" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Shipping", to: "/" },
      { label: "Returns", to: "/" },
      { label: "Contact", to: "/" },
    ],
  },
];

export const Footer = () => (
  <footer className="border-t border-border bg-gradient-soft">
    <div className="container grid gap-12 py-16 md:grid-cols-12">
      <div className="md:col-span-5 lg:col-span-6">
        <Logo />
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          A small studio of curators, makers and gift-givers. Every order is hand-wrapped in our
          studio and sent with a handwritten note.
        </p>
      </div>
      {groups.map((g) => (
        <div key={g.title} className="md:col-span-2">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider">{g.title}</h4>
          <ul className="mt-4 space-y-2.5">
            {g.links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm text-muted-foreground transition-base hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border/60">
      <div className="container flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Aurum & Co. — All gifts wrapped with care.</p>
        <p>Made in the studio · Shipped worldwide</p>
      </div>
    </div>
  </footer>
);
