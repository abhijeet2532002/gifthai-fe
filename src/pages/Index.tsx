import { Link } from "react-router-dom";
import { ArrowRight, Gift, Heart, Truck } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { AnnouncementBar } from "@/components/shop/AnnouncementBar";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/shop/SectionHeading";
import { Button } from "@/components/ui/button";
import { bestsellers, products } from "@/data/products";
import heroImg from "@/assets/hero-gift.jpg";

const features = [
  { icon: Gift, title: "Hand-wrapped", text: "Every order arrives ready to gift, with a handwritten note." },
  { icon: Truck, title: "Free shipping", text: "Complimentary worldwide delivery on orders over $75." },
  { icon: Heart, title: "Made with care", text: "Curated from independent makers and small studios." },
];

const Index = () => {
  return (
    <PageLayout>
      <AnnouncementBar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-32">
          <div className="animate-fade-in">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Spring Edit · 2026
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl lg:text-7xl">
              Gifts worth <em className="text-primary not-italic">unwrapping</em>, slowly.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              A small studio of considered objects — candles, jewelry, journals and bouquets, all
              chosen and wrapped by hand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/products">
                  Shop the edit <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/products">Bestsellers</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              <div>
                <p className="font-display text-2xl font-semibold">2.4k+</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Happy gifts sent</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">4.9★</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Customer rating</p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold">42</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Indie makers</p>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative overflow-hidden rounded-3xl shadow-elegant">
              <img
                src={heroImg}
                alt="A beautifully wrapped gift box with a soft blue silk ribbon"
                width={1536}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card p-5 shadow-elegant md:block">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">This week</p>
              <p className="font-display text-2xl font-semibold">−20% Bestsellers</p>
            </div>
            <div className="absolute -right-3 -top-3 hidden h-24 w-24 animate-fade-in-slow rounded-full bg-gradient-primary text-primary-foreground shadow-glow md:grid md:place-items-center">
              <div className="text-center">
                <p className="font-display text-2xl font-semibold leading-none">New</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest">Edit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border bg-card">
        <div className="container grid gap-8 py-12 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Most loved"
          title={<>Bestsellers, by you.</>}
          description="A handful of pieces that keep finding new homes — chosen by you, wrapped by us."
          action={
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/products">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Discount banner */}
      <section className="container pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-banner p-10 text-primary-foreground md:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] opacity-80">
                Limited offer · Ends Sunday
              </p>
              <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
                The Spring Edit, 20% off.
              </h2>
              <p className="mt-4 max-w-md opacity-85">
                Our seasonal selection of small, considered gifts — discounted for a few days only.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-8 rounded-full">
                <Link to="/products">
                  Shop the edit <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="hidden items-center justify-end gap-4 md:flex">
              <div className="rounded-2xl bg-background/10 px-8 py-10 text-center backdrop-blur-md">
                <p className="font-display text-7xl font-semibold leading-none">20</p>
                <p className="mt-2 text-xs uppercase tracking-widest opacity-80">% off</p>
              </div>
              <div className="rounded-2xl bg-background/10 px-8 py-10 text-center backdrop-blur-md">
                <p className="font-display text-7xl font-semibold leading-none">3</p>
                <p className="mt-2 text-xs uppercase tracking-widest opacity-80">Days left</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog peek */}
      <section className="container pb-24 md:pb-32">
        <SectionHeading
          eyebrow="The shelves"
          title="Browse the full studio."
          description="Every piece is small-batch and arrives gift-ready."
          action={
            <Button asChild className="rounded-full">
              <Link to="/products">
                All products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
