"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-10 border-b bg-white/90" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold" style={{ color: "var(--accent)" }}>Shop</Link>
        <Link href="/cart" className="rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: "var(--soft)", color: "var(--accent)" }}>
          Cart · {count}
        </Link>
      </div>
    </header>
  );
}
