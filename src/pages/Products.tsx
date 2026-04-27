import { useMemo, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

const Products = () => {
  const [active, setActive] = useState("All");

  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((p) => p.category === active)),
    [active],
  );

  return (
    <PageLayout>
      <section className="border-b border-border bg-gradient-soft">
        <div className="container py-16 md:py-24">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            The Studio · {products.length} pieces
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
            Every gift, considered.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Browse the full collection — filter by what you love, or scroll the whole studio.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <div className="-mx-1 mb-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-base",
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default Products;
