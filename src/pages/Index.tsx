import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Heart, Truck, Loader2 } from "lucide-react";

// Redux Hooks & Actions
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/productSlice";

// Components
import { PageLayout } from "@/components/layout/PageLayout";
import { AnnouncementBar } from "@/components/shop/AnnouncementBar";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeading } from "@/components/shop/SectionHeading";
import { Button } from "@/components/ui/button";

// Assets
import heroImg from "@/assets/hero-gift.jpg";

const features = [
  { icon: Gift, title: "Hand-wrapped", text: "Every order arrives ready to gift, with a handwritten note." },
  { icon: Truck, title: "Free shipping", text: "Complimentary worldwide delivery on orders over $75." },
  { icon: Heart, title: "Made with care", text: "Curated from independent makers and small studios." },
];

const Index = () => {
  const dispatch = useAppDispatch();
  
  // Redux store se products aur loading status nikalna
  const { items, loading, error } = useAppSelector((state) => state.products);

  // Filter logic for Bestsellers and Recent Items
  const bestsellerItems = items.filter(p => p.bestseller).slice(0, 4);
  const catalogPeek = items.slice(0, 6);

  useEffect(() => {
    // Page load par products fetch karna agar store empty hai
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  return (
    <PageLayout>
      <AnnouncementBar />

      {/* Hero Section */}
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
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative overflow-hidden rounded-3xl shadow-elegant">
              <img
                src={heroImg}
                alt="A beautifully wrapped gift box"
                className="h-full w-full object-cover"
              />
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

      {/* Bestsellers Section (Dynamic) */}
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Most loved"
          title="Bestsellers, by you."
          description="A handful of pieces that keep finding new homes — chosen by you, wrapped by us."
          action={
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/products">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-10 text-center text-destructive">{error}</div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellerItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Catalog Peek (Dynamic) */}
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
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogPeek.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default Index;