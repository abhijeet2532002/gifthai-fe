import { ReactNode } from "react";
import { Footer } from "./Footer";

export const PageLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen flex-col bg-background">
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
