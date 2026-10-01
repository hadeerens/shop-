import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";

export const metadata = { title: "Store", description: "Online store" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
