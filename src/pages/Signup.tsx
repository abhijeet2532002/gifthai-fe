import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }).max(50),
  lastName: z.string().trim().min(1, { message: "Last name is required" }).max(50),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password is too long" }),
});

type FieldErrors = Partial<Record<"firstName" | "lastName" | "email" | "password", string>>;

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signupSchema.safeParse(form);
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
      await signup(result.data);
      toast.success("Account created — welcome!");
      navigate("/profile", { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create account. Please try again.";
      toast.error(message);
      setErrors({ email: message });
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (key: keyof FieldErrors) =>
    cn("mt-1.5", errors[key] && "border-destructive focus-visible:ring-destructive");

  return (
    <PageLayout>
      <section className="container grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <div className="mx-auto w-full max-w-md md:order-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Create account</p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Join the studio.</h1>
          <p className="mt-3 text-muted-foreground">
            Save your favorites, track orders, and unwrap members-only perks.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="first">First name</Label>
                <Input
                  id="first"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className={fieldClass("firstName")}
                  maxLength={50}
                />
                {errors.firstName && <p className="mt-1.5 text-xs text-destructive">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="last">Last name</Label>
                <Input
                  id="last"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className={fieldClass("lastName")}
                  maxLength={50}
                />
                {errors.lastName && <p className="mt-1.5 text-xs text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldClass("email")}
                placeholder="you@example.com"
                maxLength={255}
              />
              {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={cn("pr-10", errors.password && "border-destructive focus-visible:ring-destructive")}
                  placeholder="At least 8 characters"
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
              {errors.password ? (
                <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>
              ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">Use 8 or more characters.</p>
              )}
            </div>

            <Button type="submit" size="lg" disabled={submitting} className="w-full rounded-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="hidden rounded-3xl bg-gradient-hero p-10 md:block lg:p-14">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Welcome</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight lg:text-5xl">
            A quieter way to give.
          </h2>
          <p className="mt-6 text-muted-foreground">
            Aurum & Co. is a small gift studio. Each piece is small-batch and arrives wrapped by hand
            with a note from us.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Signup;
