"use client";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const SHIPPING = 60; // keep in sync with api/orders/route.js

export default function CartPage() {
  const { items, remove, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "cod" });
  const [code, setCode] = useState("");
  const [cp, setCp] = useState({ discount: 0, code: null, msg: "" });
  const [state, setState] = useState({ busy: false, error: "", orderId: null });
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  async function applyCode() {
    const r = await fetch("/api/coupon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, subtotal }) });
    const d = await r.json();
    setCp(r.ok ? { discount: d.discount, code: d.code, msg: d.code ? `Code ${d.code} applied` : "" } : { discount: 0, code: null, msg: d.error });
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, error: "", orderId: null });
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, coupon: cp.code, items: items.map(({ id, size, qty }) => ({ id, size, qty })) }),
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
        {cp.discount > 0 && <p className="text-sm">Discount: −{cp.discount} EGP</p>}
        <p className="font-semibold">Total: {subtotal - cp.discount + SHIPPING} EGP</p>
        <div className="mt-4 flex gap-2">
          <input className="flex-1 border bg-white px-3 py-2 uppercase" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button type="button" onClick={applyCode} className="px-4" style={{ background: "var(--soft)", color: "var(--accent)" }}>Apply</button>
        </div>
        {cp.msg && <p className="mt-1 text-sm" style={{ color: cp.code ? "var(--accent)" : "#b91c1c" }}>{cp.msg}</p>}
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
