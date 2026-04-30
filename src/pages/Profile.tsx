import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LogOut, User, MapPin, Package, Bell, Loader2, Camera } from "lucide-react";

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

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null); // Image input ke liye ref

  // Redux state se data lena
let { user } = useSelector((state: RootState) => state.auth); 

 const email = user?.email || ""; // Token se email nikal kar local variable mein rakhna, taaki API calls mein use kar sakein 
 user = user?.user; // Redux slice mein user object ke andar actual user data hai, isliye yahan se nikal rahe hain
 const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false); // Avatar upload ke liye alag loader

  const [profile, setProfile] = useState({
    fname: "",
    lname: "",
    email: "",
    avatar: "", // Local state mein base64 ya URL rakhne ke liye
  });

  // User data ko Redux se local state mein sync karna
  useEffect(() => {
    if (user) {
      setProfile({
        fname: user.fName || "",
        lname: user.lName || "",
        email: email || "", // Token wala email automatically aayega via slice logic
        avatar: user.avatar || "", 
      });
    } else {
      navigate("/login"); // Agar token clear ho gaya hai toh login pe bhejo
    }
  }, [user, navigate]);

  // --- API Handlers ---

  // Utility function: Image file ko Base64 string mein convert karne ke liye
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result as string);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // 1. Handle Avatar Change (Photo input trigger)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !token) return;

    // File type validation
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setAvatarLoading(true);
    try {
      // Image ko base64 string banao
      const base64Image = await convertToBase64(file);
      
      // Optimistic Update: API call se pehle hi UI update kar do taaki fast lage
      setProfile(p => ({ ...p, avatar: base64Image }));

      // API Call: PATCH /api/v1/user/{id}
      // Aapke API body structure ke hisaab se data bhej rahe hain
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${user.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: user.userId,
          fname: profile.fname,
          lname: profile.lname,
          email: user.email, // Priority email
          role: user.role, 
          avtar: base64Image // Backend field name 'avtar' hai, hum base64 bhej rahe hain
        }),
      });

      if (!response.ok) throw new Error("Avatar upload failed on server");

      const data = await response.json();
      
      // Success: Redux store update karein (specifically avatar field)
      dispatch(updateUser({ avatar: data.avtar })); // API 'avtar' return karega, hum use state mein mapping karenge
      toast.success("Profile picture updated!");

    } catch (err) {
      // Revert optimistic update on failure
      setProfile(p => ({ ...p, avatar: user.avatar || "" }));
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setAvatarLoading(false);
    }
  };

  // 2. Update Profile Details (PATCH API for Name)
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${user.userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: user.userId,
          fname: profile.fname,
          lname: profile.lname,
          email: user.email, 
          role: user.role,
          avtar: user.avatar // Current avatar URL/base64
        }),
      });

      if (!response.ok) throw new Error("Details update failed");

      const data = await response.json();
      
      // Update Redux Store
      dispatch(updateUser({ fName: data.fname, lName: data.lname }));
      toast.success("Personal details updated!");
    } catch (err) {
      toast.error("Unable to update details.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Sign Out (POST API)
  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/${user?.userId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
    } catch (err) {
      console.warn("Server side logout failed", err);
    } finally {
      // Frontend cleanup is mandatory
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    }
  };

  if (!user) return null; // Fallback

  return (
    <PageLayout>
      <header className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          
          {/* Avatar Section */}
          <div className="relative group shrink-0">
            {/* Image display */}
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-primary flex items-center justify-center text-white text-4xl font-bold font-display">
              {profile.avatar ? (
                <img src={profile.avatar} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <>
                  {profile.fname?.[0]?.toUpperCase()}
                  {profile.lname?.[0]?.toUpperCase()}
                </>
              )}
              
              {/* Avatar Upload Loading Overlay */}
              {avatarLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Upload Button (Floater) */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lg",
                "transition-transform hover:scale-110",
                avatarLoading && "opacity-50 cursor-not-allowed"
              )}
              disabled={avatarLoading}
              aria-label="Change profile picture"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Header text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Member Account</p>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl tracking-tight">
              {profile.fname} {profile.lname}
            </h1>
            <p className="mt-2 text-muted-foreground">{profile.email}</p>
          </div>

          <Button variant="outline" className="rounded-full border-destructive text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container py-12">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-8 bg-muted rounded-full p-1 h-auto flex-wrap gap-1">
            <TabsTrigger value="account" className="gap-2 rounded-full px-4 py-2">
              <User size={16}/> Account
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2 rounded-full px-4 py-2">
              <Package size={16}/> Orders
            </TabsTrigger>
          </TabsList>

          {/* Account Details Tab */}
          <TabsContent value="account">
            <form onSubmit={handleSaveDetails} className="grid gap-8 rounded-2xl border bg-card p-6 shadow-sm md:p-10">
              <div>
                <h2 className="font-display text-2xl font-semibold">Personal details</h2>
                <p className="mt-1 text-sm text-muted-foreground">Update your basic information below.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="first">First name</Label>
                  <Input
                    id="first"
                    value={profile.fname}
                    onChange={(e) => setProfile({ ...profile, fname: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last">Last name</Label>
                  <Input
                    id="last"
                    value={profile.lname}
                    onChange={(e) => setProfile({ ...profile, lname: e.target.value })}
                  />
                </div>
                
                {/* Email (Read-only as it comes from Token) */}
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled 
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground italic">Email is managed via identity provider and cannot be changed here.</p>
                </div>
              </div>

              <div className="flex justify-end border-t pt-6">
                <Button type="submit" size="lg" className="rounded-full px-10" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Details
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Orders Tab (Placeholder) */}
          <TabsContent value="orders">
            <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No orders found</p>
              <p className="text-sm">You haven't placed any gifts yet.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </PageLayout>
  );
};

export default Profile;