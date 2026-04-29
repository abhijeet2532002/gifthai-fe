import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux"; // 1. Redux Provider import kiya
import { store } from "./store/store"; // 2. Store import kiya (jo hum banayenge)
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Pages
import Index from "./pages/Index.tsx";
import Products from "./pages/Products.tsx";
import ProductDetails from "./pages/ProductDetails.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";
import { Navbar } from "./components/layout/Navbar.tsx";

const queryClient = new QueryClient();

const App = () => (
  // Redux Provider sabse upar taaki har jagah state mil sake
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                {/* Navbar ko Routes ke upar rakha hai taaki har page pe user info dikhe */}
                <Navbar /> 
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;