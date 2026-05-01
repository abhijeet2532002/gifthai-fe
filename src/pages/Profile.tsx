import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, MapPin, Package, Loader2, Camera, Mail, ShieldCheck } from "lucide-react";

// Redux Actions & Store
import { RootState } from "@/store/store";
import { logout, updateUser } from "@/store/authSlice";

// UI Components
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface Order {
  id: number;
  address: string;
  totalAmount: number;
  transactionID: string;
  status: string;
  orderDate: string;
  products: Array<{
    id: number;
    title: string;
    price: number;
    productImage: string;
    color: string;
  }>;
}

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redux state extraction
  const authState = useSelector((state: RootState) => state.auth);
  const token = authState.token;
  const userBase = authState.user; 
  const actualUser = userBase?.user;

  // Local States
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [price,setPrice] = useState(0);

  const [profile, setProfile] = useState({
    fname: "",
    lname: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (actualUser) {
      setProfile({
        fname: actualUser.fName || "",
        lname: actualUser.lName || "",
        email: userBase?.email || "",
        avatar: actualUser.avatar || "",
      });
      fetchUserOrders();
    } else {
      navigate("/login");
    }
  }, [actualUser, navigate]);

  const fetchUserOrders = async () => {
    if (!actualUser?.userId || !token) return;
    setOrdersLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/orders/user/${actualUser.userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Order Fetch Error:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !actualUser || !token) return;

    setAvatarLoading(true);
    try {
      const base64Image = await convertToBase64(file);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${actualUser.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          id: actualUser.userId,
          fname: profile.fname,
          lname: profile.lname,
          email: userBase.email,
          role: actualUser.role,
          avtar: base64Image 
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      dispatch(updateUser({ ...actualUser, avatar: data.avtar }));
      setProfile(prev => ({ ...prev, avatar: data.avtar }));
      toast.success("Profile photo updated!");
    } catch (err) {
      toast.error("Failed to upload image.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualUser || !token) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${actualUser.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          id: actualUser.userId,
          fname: profile.fname,
          lname: profile.lname,
          email: userBase.email,
          role: actualUser.role,
          avtar: actualUser.avatar
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      dispatch(updateUser({ ...actualUser, fName: data.fname, lName: data.lname }));
      toast.success("Personal details updated!");
    } catch (err) {
      toast.error("Unable to update details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  if (!actualUser) return null;

  return (
    <PageLayout>
      {/* --- HEADER SECTION --- */}
      <header className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="relative group shrink-0">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-primary flex items-center justify-center text-white text-4xl font-bold font-display">
              {profile.avatar ? (
                <img src={profile.avatar.startsWith('data:') ? profile.avatar : `${profile.avatar}`} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <>{profile.fname?.[0]?.toUpperCase()}{profile.lname?.[0]?.toUpperCase()}</>
              )}
              {avatarLoading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full"><Loader2 className="h-6 w-6 animate-spin text-white" /></div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Member Account</p>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl tracking-tight">{profile.fname} {profile.lname}</h1>
            <p className="mt-2 text-muted-foreground flex items-center justify-center md:justify-start gap-2"><Mail size={14}/> {profile.email}</p>
          </div>

          <Button variant="outline" className="rounded-full border-destructive text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container py-12">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-8 bg-muted rounded-full p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="account" className="gap-2 rounded-full px-4 py-2"><User size={16}/> Account</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 rounded-full px-4 py-2"><Package size={16}/> Orders ({orders.length})</TabsTrigger>
          </TabsList>

          {/* --- ACCOUNT DETAILS TAB --- */}
          <TabsContent value="account">
            <form onSubmit={handleSaveDetails} className="grid gap-8 rounded-2xl border bg-card p-6 shadow-sm md:p-10">
              <div>
                <h2 className="font-display text-2xl font-semibold">Personal details</h2>
                <p className="mt-1 text-sm text-muted-foreground">Update your basic information below.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first">First name</Label>
                  <Input id="first" value={profile.fname} onChange={(e) => setProfile({ ...profile, fname: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last">Last name</Label>
                  <Input id="last" value={profile.lname} onChange={(e) => setProfile({ ...profile, lname: e.target.value })} />
                </div>
                
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input id="email" type="email" value={profile.email} disabled className="bg-muted pl-10 cursor-not-allowed" />
                    <ShieldCheck className="absolute left-3 top-2.5 text-muted-foreground h-5 w-5" />
                  </div>
                  <p className="text-xs text-muted-foreground italic">Email is managed via identity provider and cannot be changed.</p>
                </div>
              </div>

              <div className="flex justify-end border-t pt-6">
                <Button type="submit" size="lg" className="rounded-full px-10" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Details
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* --- ORDERS TAB --- */}
          {/* --- ORDERS TAB --- */}
<TabsContent value="orders">
  {ordersLoading ? (
    <div className="flex py-20 justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
  ) : orders.length > 0 ? (
    <div className="grid gap-6">
      {orders.map(order => {
        // Saare products ki price ko manually plus (sum) karne ke liye logic
        const calculatedTotal = order.products.reduce((acc, curr) => acc + curr.price, 0);

        return (
          <div key={order.id} className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-muted/30 p-4 border-b flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Order Placed</p>
                  <p className="text-sm font-medium">{new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Total (All Products)</p>
                  {/* Yahan total sum display ho raha hai */}
                  <p className="text-sm font-bold text-primary">₹{calculatedTotal.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Order ID</p>
                <p className="text-sm font-mono text-muted-foreground">#{order.transactionID}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {order.products.map(product => (
                <div key={product.id} className="flex gap-4 items-center">
                  <div className="h-20 w-20 rounded-xl overflow-hidden border bg-muted shrink-0">
                    <img src={`${import.meta.env.VITE_API_BASE_URL}${product.productImage}`} alt={product.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{product.title}</h4>
                    <p className="text-sm text-muted-foreground">Color: {product.color}</p>
                    <div className={cn("mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider", 
                      order.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700")}>
                      {order.status}
                    </div>
                  </div>
                  <div className="text-right">
                    {/* Individual Product Price */}
                    <p className="font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/10 border-t flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} className="text-primary"/>
              <span>Delivered to: <strong>{order.address}</strong></span>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed p-20 text-center bg-card">
      <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
      <h3 className="text-lg font-medium">No orders yet</h3>
      <p className="text-muted-foreground">Your order history will appear here after your first purchase.</p>
    </div>
  )}
</TabsContent>
        </Tabs>
      </main>
    </PageLayout>
  );
};

export default Profile;