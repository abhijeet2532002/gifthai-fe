import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, subtotal, update, remove, itemCount } = useCart();
  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  return (
    <PageLayout>
      <section className="container py-12 md:py-16">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Your bag · {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Shopping bag</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-border py-24 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold">Your bag is empty</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Discover something thoughtful in the studio.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full">
              <Link to="/products">
                Shop the studio <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 p-4 sm:p-6">
                    <Link
                      to={`/products/${item.id}`}
                      className="aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">
                            {item.category}
                          </p>
                          <Link
                            to={`/products/${item.id}`}
                            className="font-display text-lg font-semibold hover:underline"
                          >
                            {item.name}
                          </Link>
                        </div>
                        <p className="font-display text-lg font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-auto flex items-end justify-between pt-4">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            onClick={() => update(item.id, item.quantity - 1)}
                            className="grid h-9 w-9 place-items-center rounded-l-full transition-base hover:bg-muted"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => update(item.id, item.quantity + 1)}
                            className="grid h-9 w-9 place-items-center rounded-r-full transition-base hover:bg-muted"
                            aria-label="Increase"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(item.id)}
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-base hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold">Order summary</h2>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base">
                    <dt className="font-display font-semibold">Total</dt>
                    <dd className="font-display font-semibold">${total.toFixed(2)}</dd>
                  </div>
                </dl>
                <Button asChild size="lg" className="mt-6 w-full rounded-full">
                  <Link to="/checkout">
                    Checkout <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Secure checkout · 30-day returns
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default Cart;
