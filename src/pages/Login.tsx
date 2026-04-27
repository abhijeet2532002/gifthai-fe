import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(4, { message: "Password must be at least 4 characters long" }).max(128),
});

type FieldErrors = Partial<Record<"email" | "password", string>>;

const Login = () => {
  const { login } = useAuth();
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
      await login(result.data);
      toast.success("Welcome back!");
      navigate(location.state?.from ?? "/profile", { replace: true });
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
        <div className="hidden rounded-3xl bg-gradient-hero p-10 md:block lg:p-14">
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
          <p className="mt-3 text-muted-foreground">Enter your details to access your account.</p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={cn("mt-1.5", errors.email && "border-destructive focus-visible:ring-destructive")}
                placeholder="you@example.com"
                maxLength={255}
              />
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={cn("pr-10", errors.password && "border-destructive focus-visible:ring-destructive")}
                  placeholder="••••••••"
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-base hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="w-full rounded-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Login;
