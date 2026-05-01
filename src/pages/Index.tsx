import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, Heart, Truck, Loader2, Sparkles } from "lucide-react";

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
  const { items, loading, error } = useAppSelector((state) => state.products);

  // --- Smart Search Logic ---
  const [feeling, setFeeling] = useState("");
  const [suggestions, setSuggestions] = useState<typeof items>([]);

  const handleFeelingSearch = (val: string) => {
    setFeeling(val);
    if (val.length < 2) {
      setSuggestions([]);
      return;
    }

    const query = val.toLowerCase();
    const filtered = items.filter(p => {
      const tags = p.category?.toLowerCase() || "";
      const desc = p.description?.toLowerCase() || "";
      const name = p.name?.toLowerCase() || "";
      
      const isCalm = (query.includes("calm") || query.includes("relax")) && (tags.includes("candle") || desc.includes("soothing"));
      const isRomantic = (query.includes("love") || query.includes("heart")) && (tags.includes("jewelry") || tags.includes("bouquet"));
      const isCozy = (query.includes("cozy") || query.includes("warm")) && (tags.includes("candle") || desc.includes("warm"));
      
      return isCalm || isRomantic || isCozy || name.includes(query) || tags.includes(query);
    }).slice(0, 3);

    setSuggestions(filtered);
  };

  const bestsellerItems = items.filter(p => p.bestseller).slice(0, 4);
  const catalogPeek = items.slice(0, 6);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  return (
    <PageLayout>
      <AnnouncementBar />

      {/* Hero Section with Top-Middle Search */}
      <section className="relative min-h-[80vh] overflow-hidden bg-gradient-hero flex items-center justify-center pt-20 pb-32">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
            <img src={heroImg} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center">
          <div className="animate-fade-in flex flex-col items-center">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-foreground/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Spring Edit · 2026
            </p>
            
            <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.1] tracking-tight text-balance md:text-7xl">
              Gifts worth <em className="text-primary not-italic">unwrapping</em>, slowly.
            </h1>

            {/* Smart Search Bar - Integrated in Banner */}
            <div className="mt-10 w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="group relative rounded-3xl border border-border bg-background/40 p-1.5 shadow-2xl backdrop-blur-2xl transition-all focus-within:bg-background/90 focus-within:ring-4 focus-within:ring-primary/10">
                <div className="relative flex items-center px-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <input
                    type="text"
                    placeholder="How are you feeling? (e.g. 'I need some calm')"
                    className="w-full border-none bg-transparent py-4 pl-4 pr-4 text-lg placeholder:text-foreground/50 focus:outline-none focus:ring-0"
                    value={feeling}
                    onChange={(e) => handleFeelingSearch(e.target.value)}
                  />
                </div>

                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in fade-in zoom-in-95">
                    <div className="p-3 grid gap-3">
                      {suggestions.map((p) => (
                        <Link 
                          key={p.id} 
                          to={`/product/${p.id}`}
                          className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-secondary"
                        >
                          <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          <div className="text-left">
                            <p className="text-sm font-semibold">{p.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                          </div>
                          <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-muted-foreground/80">
                Type your mood and let us curate a moment for you.
              </p>
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
              <div className="text-left">
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Most loved"
          title="Bestsellers, by you."
          description="A handful of pieces that keep finding new homes."
          action={
            <Button asChild variant="ghost" className="rounded-full">
              <Link to="/products">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        
        {loading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {bestsellerItems.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Catalog Peek */}
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
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogPeek.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default Index;