import "./globals.css";

export const metadata = {
  title: "Ruralize Shop",
  description: "Plataforma de compras integrada ao Ruralize Seller",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
