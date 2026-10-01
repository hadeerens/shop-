"use client";
import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem("cart", JSON.stringify(items));
  }, [items, ready]);

  const add = (p) =>
    setItems((cur) => {
      const hit = cur.find((i) => i.id === p.id && i.size === p.size);
      if (hit) return cur.map((i) => (i === hit ? { ...i, qty: Math.min(i.qty + 1, 10) } : i));
      return [...cur, { ...p, qty: 1 }];
    });
  const remove = (id, size) => setItems((c) => c.filter((i) => !(i.id === id && i.size === size)));
  const clear = () => setItems([]);
  const count = items.reduce((n, i) => n + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, clear, count }}>{children}</Ctx.Provider>;
}
