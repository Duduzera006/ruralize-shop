import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { CartProvider } from "../app/context/cartContext";
import { AuthProvider } from "../app/context/authContext";
import { ToastProvider } from "../app/context/toastContext";
import { ProductsProvider } from "../app/context/productsContext";
import { ReactNode } from "react";

export const metadata = {
  title: "Ruralize Shop",
  description: "Marketplace rural moderno",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/icon-120x120.png" />
        <link rel="apple-touch-icon" href="/icon-120x120.png" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
          <AuthProvider>
            <ProductsProvider>
              <Navbar />
              <CartProvider>
                <main className="flex-1 max-w-6xl mx-auto w-full p-4">
                  {children}
                </main>
              </CartProvider>
              <Footer />
            </ProductsProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
