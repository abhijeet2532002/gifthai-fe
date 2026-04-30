import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Lock } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Redux Hook import karein
import { useAppSelector } from "@/store/hooks";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  // Store se user data nikalna
  const user = useAppSelector((state) => state.auth.user);
  

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 8;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    clear();
    toast.success("Order placed! A confirmation is on its way.");
  };

 const handlePlaceOrder = async () => {
  // 1. Token nikalna (Redux state ya localStorage se)
  const token = localStorage.getItem("token"); 

  if (!token) {
    toast.error("Please login to place an order");
    return;
  }

  // 2. Body Prepare karna
  // Note: items.reduce use kar rahe hain total amount ke liye kyunki items ek array hai
  const orderBody = {
    address: user?.user?.address?.[0]?.landmark || "No Address Provided",
    totalAmount: total.toFixed(2), // Jo humne calculation ki thi (subtotal + tax + shipping)
    transactionID: `TXN_${Math.floor(Math.random() * 1000000)}`, // Demo ID
    productIds: items.map(item => item.id) // Saare products ki IDs ka array
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Token yahan jayega
      },
      body: JSON.stringify(orderBody)
    });

    if (response.ok) {
      setDone(true);
      clear(); // Cart clear karna
      toast.success("Order placed successfully!");
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to place order");
    }
  } catch (error) {
    console.error("Order Error:", error);
    toast.error("Something went wrong. Please try again.");
  }
};

  if (done) {
    return (
      <PageLayout>
        <section className="container py-24 text-center md:py-32">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success animate-scale-in">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold md:text-5xl">Thank you.</h1>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Your gift is being hand-wrapped in the studio. We'll send a confirmation and tracking
            details shortly.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">
              Back home
            </Button>
            <Button onClick={() => navigate("/products")} className="rounded-full">
              Keep shopping
            </Button>
          </div>
        </section>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PageLayout>
        <section className="container py-24 text-center">
          <h1 className="font-display text-3xl font-semibold">Nothing to check out yet</h1>
          <Button onClick={() => navigate("/products")} className="mt-6 rounded-full">
            Shop the studio
          </Button>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="container py-12 md:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Checkout</p>
        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Almost yours.</h1>

        <form onSubmit={handleSubmit} className="mt-12 grid gap-12 lg:grid-cols-5">
          <div className="space-y-10 lg:col-span-3">
            <div>
              <h2 className="font-display text-xl font-semibold">Contact</h2>
              <div className="mt-4 grid gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="you@example.com" 
                    className="mt-1.5"
                    // User ka email autofill kiya
                    defaultValue={user?.email || ""} 
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold">Shipping address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first">First name</Label>
                  <Input 
                    id="first" 
                    required 
                    className="mt-1.5" 
                    // User ka fName autofill kiya
                    defaultValue={user?.user?.fName || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="last">Last name</Label>
                  <Input 
                    id="last" 
                    required 
                    className="mt-1.5" 
                    // User ka lName autofill kiya
                    defaultValue={user?.user?.lName || ""}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" required className="mt-1.5" defaultValue={user?.user?.address?.[0]?.landmark || ""} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required className="mt-1.5" defaultValue={user?.user?.address?.[0]?.state || ""} />
                </div>
                <div>
                  <Label htmlFor="zip">Postal code</Label>
                  <Input id="zip" required className="mt-1.5" defaultValue={user?.user?.address?.[0]?.pincode || ""} />
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold">Payment</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                <Lock className="-mt-0.5 mr-1 inline h-3.5 w-3.5" /> Secured checkout (demo)
              </p>
              <div className="mt-4 grid gap-4">
                <div>
                  <Label htmlFor="card">Card number</Label>
                  <Input id="card" required placeholder="1234 5678 9012 3456" className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="exp">Expiry</Label>
                    <Input id="exp" required placeholder="MM / YY" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" required placeholder="123" className="mt-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold">Your order</h2>
              <ul className="mt-5 space-y-4">
                {items.map((i) => (
                  <li key={i.id} className="flex gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {/* Base URL handling for images */}
                      <img 
                        src={`${i.image}`} 
                        alt={i.name} 
                        className="h-full w-full object-cover" 
                      />
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                        {i.quantity}
                      </span>
                    </div>
                    <div className="flex flex-1 items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium leading-tight">{i.name}</p>
                        <p className="text-xs text-muted-foreground">{i.tagline}</p>
                      </div>
                      <p className="text-sm font-medium">₹{(i.price * i.quantity).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Separator className="my-5" />
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>${subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd>${tax.toFixed(2)}</dd>
                </div>
                <Separator />
                <div className="flex justify-between text-base">
                  <dt className="font-display font-semibold">Total</dt>
                  <dd className="font-display font-semibold">${total.toFixed(2)}</dd>
                </div>
              </dl>
              <Button onClick={handlePlaceOrder} size="lg" className="mt-6 w-full rounded-full">
                Place order — ${total.toFixed(2)}
              </Button>
            </div>
          </aside>
        </form>
      </section>
    </PageLayout>
  );
};

export default Checkout;