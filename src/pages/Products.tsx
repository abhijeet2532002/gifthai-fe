import { useMemo, useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Redux Hooks & Actions
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/productSlice";

const Products = () => {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState("All");

  // Redux store se data aur loading state nikalna
  const { items, loading, error } = useAppSelector((state) => state.products);

  // Jab page load ho, agar data nahi hai toh fetch karo
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items.length]);

  // Categories dynamically create karna (API data se)
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map((p) => p.category)));
    return ["All", ...uniqueCategories];
  }, [items]);

  // Active category ke basis par filter karna
  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((p) => p.category === active)),
    [active, items]
  );

  return (
    <PageLayout>
      <section className="border-b border-border bg-gradient-soft">
        <div className="container py-16 md:py-24">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            The Studio · {items.length} pieces
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
        {/* Category Filters */}
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

        {/* Loading State */}
        {loading && (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Fetching studio items...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-10 text-center text-destructive">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default Products;