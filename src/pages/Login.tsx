import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
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
import { loginHandler } from "@/api/auth";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }).max(128),
});

type FieldErrors = Partial<Record<"email" | "password", string>>;

const PERKS = [
  { symbol: "✦", label: "Early access to seasonal edits" },
  { symbol: "✦", label: "Saved gift lists & address book" },
  { symbol: "✦", label: "Free hand-wrapping on every order" },
  { symbol: "✦", label: "Complimentary notes, penned by hand" },
];

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      const response = await loginHandler(result.data);

      dispatch(
        setCredentials({
          user: {
            fName: response.fName,
            lName: response.lName,
            role: response.role,
            avatar: `http://10.40.67.94:8080${response.avatar}`,
            userId: response.userId,
            address: response.address,
            mobile: response.mobile,
          },
          accessToken: response.accessToken,
        })
      );

      toast.success(`Welcome back, ${response.fName}!`);
      navigate(location.state?.from ?? "/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to sign in. Please try again.";
      toast.error(message);
      setErrors({ password: message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout>
      {/* ── Full-bleed split layout (bypasses container) ── */}
      <div className="login-root">

        {/* ════════════════════════════════════════════
            LEFT — atmospheric brand panel
        ════════════════════════════════════════════ */}
        <div className="login-panel-left">
          {/* Decorative grain overlay */}
          <div className="login-grain" aria-hidden />

          {/* Top wordmark */}
          <div className="login-left-top">
            <span className="login-wordmark">The Studio</span>
          </div>

          {/* Centre editorial copy */}
          <div className="login-left-body">
            <p className="login-left-eyebrow">Members only</p>
            <h2 className="login-left-heading">
              Quiet perks, kept just<br />for you.
            </h2>
            <div className="login-divider" />
            <ul className="login-perks">
              {PERKS.map((p) => (
                <li key={p.label} className="login-perk-item">
                  <span className="login-perk-symbol">{p.symbol}</span>
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom edition tag */}
          <div className="login-left-bottom">
            <span className="login-edition">Spring Edit · 2026</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT — sign-in form
        ════════════════════════════════════════════ */}
        <div className="login-panel-right">
          <div className="login-form-inner">

            {/* Header */}
            <div className="login-form-header">
              <p className="login-form-eyebrow">Sign in</p>
              <h1 className="login-form-heading">Welcome back.</h1>
              <p className="login-form-sub">
                Don't have an account?{" "}
                <Link to="/signup" className="login-link">
                  Create one
                </Link>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="login-form">

              {/* Email */}
              <div className={cn("login-field", focusedField === "email" && "focused", errors.email && "has-error")}>
                <Label htmlFor="email" className="login-label">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="login-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="login-error">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className={cn("login-field", focusedField === "password" && "focused", errors.password && "has-error")}>
                <div className="login-label-row">
                  <Label htmlFor="password" className="login-label">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="login-forgot">
                    Forgot password?
                  </Link>
                </div>
                <div className="login-password-wrap">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className="login-input pr-11"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-eye-btn"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="login-error">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="login-submit-btn"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4 login-arrow" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom note */}
            <p className="login-terms">
              By signing in you agree to our{" "}
              <Link to="/terms" className="login-link">Terms</Link> and{" "}
              <Link to="/privacy" className="login-link">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        /* ── Root layout ─────────────────────────────────── */
        .login-root {
          display: grid;
          grid-template-columns: 1fr;
          min-height: calc(100vh - 64px);
        }
        @media (min-width: 768px) {
          .login-root { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .login-root { grid-template-columns: 55% 45%; }
        }

        /* ── Left panel ──────────────────────────────────── */
        .login-panel-left {
          display: none;
          position: relative;
          flex-direction: column;
          justify-content: space-between;
          padding: 2.5rem 3rem;
          background: hsl(var(--foreground));
          overflow: hidden;
        }
        @media (min-width: 768px) {
          .login-panel-left { display: flex; }
        }

        /* Grain texture */
        .login-grain {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }

        /* Subtle radial glow */
        .login-panel-left::after {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60%;
          padding-bottom: 60%;
          border-radius: 50%;
          background: hsl(var(--primary) / 0.12);
          pointer-events: none;
        }

        .login-left-top, .login-left-body, .login-left-bottom {
          position: relative;
          z-index: 1;
        }

        .login-wordmark {
          font-family: var(--font-display, Georgia, serif);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: hsl(var(--background) / 0.5);
        }

        .login-left-eyebrow {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: hsl(var(--primary));
          margin-bottom: 1.25rem;
        }

        .login-left-heading {
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(2.6rem, 4.5vw, 4rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: hsl(var(--background));
          margin-bottom: 2rem;
        }

        .login-divider {
          width: 2.5rem;
          height: 1px;
          background: hsl(var(--background) / 0.2);
          margin-bottom: 1.75rem;
        }

        .login-perks {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .login-perk-item {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: hsl(var(--background) / 0.55);
          line-height: 1.5;
        }

        .login-perk-symbol {
          color: hsl(var(--primary));
          font-size: 0.6rem;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .login-edition {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: hsl(var(--background) / 0.25);
        }

        /* ── Right panel ─────────────────────────────────── */
        .login-panel-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          background: hsl(var(--background));
        }

        .login-form-inner {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ── Form header ── */
        .login-form-header {
          margin-bottom: 2.5rem;
        }

        .login-form-eyebrow {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: hsl(var(--primary));
          margin-bottom: 0.75rem;
        }

        .login-form-heading {
          font-family: var(--font-display, Georgia, serif);
          font-size: clamp(2.25rem, 5vw, 3rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: hsl(var(--foreground));
          margin-bottom: 1rem;
        }

        .login-form-sub {
          font-size: 0.85rem;
          color: hsl(var(--muted-foreground));
        }

        /* ── Form ── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        /* ── Field wrapper ── */
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .login-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .login-label {
          font-size: 0.78rem !important;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: hsl(var(--foreground) / 0.7) !important;
          text-transform: uppercase;
        }

        .login-forgot {
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
          text-decoration: none;
          transition: color 0.15s;
        }
        .login-forgot:hover { color: hsl(var(--primary)); }

        /* Override shadcn Input to match our aesthetic */
        .login-input {
          border-radius: 0 !important;
          border-left: none !important;
          border-right: none !important;
          border-top: none !important;
          border-bottom: 1.5px solid hsl(var(--border)) !important;
          background: transparent !important;
          padding-left: 0 !important;
          font-size: 0.95rem !important;
          height: 2.75rem !important;
          transition: border-color 0.2s !important;
          box-shadow: none !important;
        }

        .login-input:focus {
          border-bottom-color: hsl(var(--foreground)) !important;
          box-shadow: none !important;
          outline: none !important;
        }

        .login-field.has-error .login-input {
          border-bottom-color: hsl(var(--destructive)) !important;
        }

        .login-error {
          font-size: 0.75rem;
          color: hsl(var(--destructive));
          margin-top: 0.15rem;
        }

        /* Password reveal wrapper */
        .login-password-wrap {
          position: relative;
        }

        .login-eye-btn {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.4rem;
          color: hsl(var(--muted-foreground));
          transition: color 0.15s;
          display: flex;
          align-items: center;
        }
        .login-eye-btn:hover { color: hsl(var(--foreground)); }

        /* ── Submit button ── */
        .login-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9rem 1.5rem;
          margin-top: 0.5rem;
          background: hsl(var(--foreground));
          color: hsl(var(--background));
          border: 1.5px solid hsl(var(--foreground));
          border-radius: 9999px;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, color 0.2s, transform 0.15s;
          font-family: inherit;
          position: relative;
          overflow: hidden;
        }

        .login-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: hsl(var(--primary));
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }

        .login-submit-btn:hover::before { transform: translateX(0); }
        .login-submit-btn:hover { color: hsl(var(--primary-foreground)); border-color: hsl(var(--primary)); }
        .login-submit-btn:active { transform: scale(0.985); }
        .login-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .login-submit-btn span,
        .login-submit-btn svg {
          position: relative;
          z-index: 1;
        }

        .login-arrow {
          transition: transform 0.2s;
        }
        .login-submit-btn:hover .login-arrow { transform: translateX(3px); }

        /* ── Links ── */
        .login-link {
          color: hsl(var(--foreground));
          font-weight: 500;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: hsl(var(--border));
          transition: text-decoration-color 0.15s;
        }
        .login-link:hover { text-decoration-color: hsl(var(--foreground)); }

        /* ── Terms note ── */
        .login-terms {
          font-size: 0.72rem;
          color: hsl(var(--muted-foreground) / 0.6);
          line-height: 1.6;
          margin-top: 1.5rem;
        }
      `}</style>
    </PageLayout>
  );
};

export default Login;