"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const SHIPPING = 60; // keep in sync with api/orders/route.js

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "cod" });
  const [state, setState] = useState({ busy: false, error: "", orderId: null });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, error: "", orderId: null });
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, items: items.map(({ id, size, qty }) => ({ id, size, qty })) }),
    });
    const data = await res.json();
    if (!res.ok) return setState({ busy: false, error: data.error || "Something went wrong", orderId: null });
    clear();
    setState({ busy: false, error: "", orderId: data.orderId });
  }

  if (state.orderId)
    return <p>Order #{state.orderId} received. We will call you on {form.phone} to confirm.</p>;
  if (!items.length) return <p style={{ color: "var(--muted)" }}>Your cart is empty.</p>;

  const field = "w-full border px-3 py-2 bg-white";
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        {items.map((i) => (
          <div key={i.id + i.size} className="mb-4 flex items-center gap-3">
            <img src={i.image} alt="" className="h-16 w-14 object-cover" />
            <div className="flex-1 text-sm">
              {i.name}{i.size ? ` · ${i.size}` : ""} × {i.qty}
            </div>
            <div className="text-sm">{i.price * i.qty} EGP</div>
            <button onClick={() => remove(i.id, i.size)} className="text-sm underline">Remove</button>
          </div>
        ))}
        <p className="mt-4 text-sm">Subtotal: {subtotal} EGP</p>
        <p className="text-sm">Shipping: {SHIPPING} EGP</p>
        <p className="font-semibold">Total: {subtotal + SHIPPING} EGP</p>
      </div>

      <form onSubmit={submit} className="space-y-3">
        <input className={field} placeholder="Full name" value={form.name} onChange={set("name")} required />
        <input className={field} placeholder="Phone (01xxxxxxxxx)" inputMode="tel" pattern="01[0-9]{9}" value={form.phone} onChange={set("phone")} required />
        <textarea className={field} placeholder="Address" value={form.address} onChange={set("address")} required />
        <select className={field} value={form.payment} onChange={set("payment")}>
          <option value="cod">Cash on delivery</option>
          <option value="instapay">InstaPay</option>
        </select>
        {state.error && <p className="text-sm text-red-700">{state.error}</p>}
        <button disabled={state.busy} className="w-full py-3 text-white" style={{ background: "var(--accent)" }}>
          {state.busy ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}
