import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, User, X, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

// Redux Imports
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";

const links = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
];

export const Navbar = () => {
  const { itemCount } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Redux Logic
  let { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  user = user?.user;
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4 md:h-20">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />
          
          {/* Cart Icon */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link to="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          {/* User Auth Section */}
          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="hidden items-center gap-2 rounded-full pl-1 pr-3 sm:flex" asChild>
                <Link to="/profile">
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-primary/20">
                    {user.avatar ? (
                      <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-white">
                        {/* {user.fName[0].toUpperCase()} */}
                        hello
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium">{user.fName}</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => dispatch(logout())}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild className="sm:hidden">
                <Link to="/login"><User className="h-5 w-5" /></Link>
              </Button>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("overflow-hidden bg-background md:hidden transition-all duration-300", open ? "max-h-64 border-t" : "max-h-0")}>
        <nav className="container flex flex-col gap-2 py-4">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-2 text-sm font-medium">{l.label}</Link>
          ))}
          {!user && <Link to="/login" className="px-4 py-2 text-sm font-medium">Login</Link>}
        </nav>
      </div>
    </header>
  );
};