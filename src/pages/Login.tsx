import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Redux Imports
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import { loginHandler } from "@/api/auth"; // Aapka export kiya hua function

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }).max(128),
});

type FieldErrors = Partial<Record<"email" | "password", string>>;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse(form);
    
    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      // 1. API Call using your loginHandler
      const response = await loginHandler(result.data);

      // 2. Bind response to Redux Store
      dispatch(setCredentials({
        user: {
          fName: response.fName,
          lName: response.lName,
          role: response.role,
          avatar: `http://10.40.67.94:8080${response.avatar}`,
          userId: response.userId,
          address: response.address,
          mobile: response.mobile,
        },
        accessToken: response.accessToken
      }));

      toast.success(`Welcome back, ${response.fName}!`);
      navigate(location.state?.from ?? "/", { replace: true });
      
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to sign in. Please try again.";
      toast.error(message);
      setErrors({ password: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <section className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div className="hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 p-10 md:block lg:p-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Members only</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight lg:text-5xl">
            Quiet perks, kept just for you.
          </h2>
          <ul className="mt-8 space-y-4 text-muted-foreground">
            <li>· Early access to seasonal edits</li>
            <li>· Saved gift lists & address book</li>
            <li>· Free hand-wrapping on every order</li>
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Sign in</p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Welcome back.</h1>
          
          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={cn("mt-1.5", errors.email && "border-destructive")}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={cn("pr-10", errors.password && "border-destructive")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>}
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="w-full rounded-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New here? <Link to="/signup" className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Login;