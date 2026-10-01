"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

export default function AddToCart({ product, sizes, inStock }) {
  const { add } = useCart();
  const [size, setSize] = useState(sizes[0] || null);
  const [added, setAdded] = useState(false);

  if (!inStock) return <p className="mt-6">Sold out</p>;
  return (
    <div className="mt-6">
      {sizes.length > 0 && (
        <div className="mb-4 flex gap-2">
          {sizes.map((s) => (
            <button key={s} onClick={() => setSize(s)}
              className="border px-3 py-1 text-sm"
              style={{ borderColor: s === size ? "var(--ink)" : "var(--line)", fontWeight: s === size ? 600 : 400 }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => { add({ ...product, size }); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
        className="px-6 py-3 text-white" style={{ background: "var(--accent)" }}>
        {added ? "Added to cart" : "Add to cart"}
      </button>
    </div>
  );
}
