"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { count } = useCart();
  return (
    <header className="border-b" style={{ borderColor: "var(--line)" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">Store</Link>
        <Link href="/cart" className="text-sm">Cart ({count})</Link>
      </div>
    </header>
  );
}
