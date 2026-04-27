import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Check, Heart, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ImageMagnifier } from "@/components/shop/ImageMagnifier";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { getProduct, products } from "@/data/products";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const product = id ? getProduct(id) : undefined;

  if (!product) {
    return (
      <PageLayout>
        <div className="container py-32 text-center">
          <h1 className="font-display text-3xl font-semibold">Product not found</h1>
          <Button asChild variant="outline" className="mt-6 rounded-full">
            <Link to="/products">Back to shop</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    add(product, qty);
    toast.success(`${product.name} (×${qty}) added to cart`);
  };

  const handleBuy = () => {
    add(product, qty);
    navigate("/checkout");
  };

  return (
    <PageLayout>
      <div className="container py-8">
        <Button variant="ghost" size="sm" asChild className="rounded-full">
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
        </Button>
      </div>

      <section className="container grid gap-12 pb-16 md:grid-cols-2 md:gap-16 md:pb-24">
        <div className="animate-fade-in">
          <ImageMagnifier src={product.image} alt={product.name} />
          <p className="mt-3 text-center text-xs text-muted-foreground md:text-left">
            Hover or tap to zoom
          </p>
        </div>

        <div className="flex flex-col animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-5 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : "opacity-30"}`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-muted-foreground">· {product.reviews} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">${product.price}</span>
            {product.compareAt && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  ${product.compareAt}
                </span>
                <Badge className="bg-success text-success-foreground">
                  Save ${product.compareAt - product.price}
                </Badge>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <ul className="mt-6 grid grid-cols-2 gap-2.5 text-sm">
            {product.details.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{d}</span>
              </li>
            ))}
          </ul>

          <Separator className="my-8" />

          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 place-items-center rounded-l-full transition-base hover:bg-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 place-items-center rounded-r-full transition-base hover:bg-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button onClick={handleAdd} variant="outline" size="lg" className="flex-1 rounded-full sm:flex-initial">
              Add to cart
            </Button>
            <Button onClick={handleBuy} size="lg" className="flex-1 rounded-full sm:flex-initial">
              Buy now — ${(product.price * qty).toFixed(2)}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Save">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8 grid gap-3 rounded-2xl bg-muted/50 p-5 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium">Free shipping</p>
                <p className="text-muted-foreground">On orders over $75</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-medium">30-day returns</p>
                <p className="text-muted-foreground">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-24 md:pb-32">
        <h2 className="mb-8 font-display text-2xl font-semibold md:text-3xl">You might also love</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
};

export default ProductDetails;
