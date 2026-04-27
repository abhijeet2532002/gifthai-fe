import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Bell, Heart, LogOut, MapPin, Package, Settings, User } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const recentOrders = [
  { id: "AC-2841", date: "Mar 12, 2026", total: 92, status: "Delivered" },
  { id: "AC-2790", date: "Feb 24, 2026", total: 38, status: "Delivered" },
  { id: "AC-2738", date: "Jan 08, 2026", total: 156, status: "Delivered" },
];

const Profile = () => {
  const { user, loading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    zip: "",
  });

  useEffect(() => {
    if (user) {
      setProfile((p) => ({
        ...p,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    orders: true,
    drops: true,
    marketing: false,
  });

  if (loading) {
    return (
      <PageLayout>
        <div className="container py-24 text-center text-muted-foreground">Loading…</div>
      </PageLayout>
    );
  }

  // if (!user) {
  //   return <Navigate to="/login" replace state={{ from: "/profile" }} />;
  // }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    });
    toast.success("Profile updated");
  };

  const handleSignOut = () => {
    logout();
    toast.success("Signed out");
    navigate("/", { replace: true });
  };


  return (
    <PageLayout>
      <section className="border-b border-border bg-gradient-soft">
        <div className="container py-12 md:py-16">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-elegant">
              <span className="font-display text-3xl font-semibold">
                {profile.firstName[0]}
                {profile.lastName[0]}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Member since 2024</p>
              <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="mt-2 text-muted-foreground">{profile.email}</p>
            </div>
            <Button variant="outline" className="rounded-full" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-8 h-auto flex-wrap gap-1 bg-muted p-1">
            <TabsTrigger value="account" className="gap-2 rounded-full px-4 py-2">
              <User className="h-4 w-4" /> Account
            </TabsTrigger>
            <TabsTrigger value="address" className="gap-2 rounded-full px-4 py-2">
              <MapPin className="h-4 w-4" /> Addresses
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 rounded-full px-4 py-2">
              <Package className="h-4 w-4" /> Orders
            </TabsTrigger>
            <TabsTrigger value="prefs" className="gap-2 rounded-full px-4 py-2">
              <Bell className="h-4 w-4" /> Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <form onSubmit={handleSave} className="grid gap-8 rounded-2xl border border-border bg-card p-6 shadow-card md:p-10">
              <div>
                <h2 className="font-display text-xl font-semibold">Personal details</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Update how your name and contact appear on orders.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="first">First name</Label>
                  <Input
                    id="first"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="last">Last name</Label>
                  <Input
                    id="last"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="bio">Gift profile</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="mt-1.5"
                    placeholder="Tell us a bit about what you love…"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg" className="rounded-full">
                  Save changes
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="address">
            <form onSubmit={handleSave} className="grid gap-8 rounded-2xl border border-border bg-card p-6 shadow-card md:p-10">
              <div>
                <h2 className="font-display text-xl font-semibold">Default shipping address</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Where your beautifully-wrapped gifts will arrive.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="zip">Postal code</Label>
                  <Input
                    id="zip"
                    value={profile.zip}
                    onChange={(e) => setProfile({ ...profile, zip: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="lg" className="rounded-full">
                  Save address
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="orders">
            <div className="rounded-2xl border border-border bg-card shadow-card">
              <div className="border-b border-border p-6">
                <h2 className="font-display text-xl font-semibold">Recent orders</h2>
                <p className="mt-1 text-sm text-muted-foreground">A look at your past gifts.</p>
              </div>
              <ul className="divide-y divide-border">
                {recentOrders.map((o) => (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 p-6">
                    <div>
                      <p className="font-display text-base font-semibold">{o.id}</p>
                      <p className="text-sm text-muted-foreground">{o.date}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        "bg-success/15 text-success",
                      )}
                    >
                      {o.status}
                    </span>
                    <p className="font-display text-base font-semibold">${o.total.toFixed(2)}</p>
                    <Button variant="ghost" size="sm" className="rounded-full">
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="prefs">
            <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 shadow-card md:p-10">
              <div>
                <h2 className="font-display text-xl font-semibold">Notifications</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Choose what we keep you in the loop on.
                </p>
              </div>
              {[
                { key: "orders", label: "Order updates", desc: "Confirmations, shipping, and delivery." },
                { key: "drops", label: "New edits", desc: "A heads-up when a new collection lands." },
                { key: "marketing", label: "Studio musings", desc: "Occasional notes from the studio." },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-6">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(v) =>
                      setNotifications({ ...notifications, [item.key]: v })
                    }
                  />
                </div>
              ))}
              <Separator />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-muted">
                    <Heart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Wishlist</p>
                    <p className="text-sm text-muted-foreground">8 saved gifts</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full">
                  <Settings className="h-4 w-4" /> Manage
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </PageLayout>
  );
};

export default Profile;
