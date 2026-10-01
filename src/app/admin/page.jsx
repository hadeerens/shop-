"use client";
import { useEffect, useState } from "react";

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];

export default function Admin() {
  const [orders, setOrders] = useState(null);
  const [authed, setAuthed] = useState(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const res = await fetch("/api/admin");
    if (res.status === 401) return setAuthed(false);
    const d = await res.json();
    if (!res.ok) return setErr(d.error);
    setOrders(d.orders); setAuthed(true);
  }
  useEffect(() => { load(); }, []);

  async function login(e) {
    e.preventDefault(); setErr("");
    const res = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (!res.ok) return setErr("Wrong password");
    load();
  }
  async function setStatus(id, status) {
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    await fetch("/api/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
  }

  if (authed === null) return <p>Loading…</p>;
  if (!authed)
    return (
      <form onSubmit={login} className="mx-auto max-w-xs space-y-3">
        <h1 className="text-xl font-bold">Admin</h1>
        <input type="password" className="w-full border px-3 py-2 bg-white" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="text-sm text-red-700">{err}</p>}
        <button className="w-full py-2 text-white" style={{ background: "var(--accent)" }}>Log in</button>
      </form>
    );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Orders ({orders.length})</h1>
      {err && <p className="text-red-700">{err}</p>}
      <div className="space-y-3">
        {orders.map((o) => (
          <details key={o.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">#{o.id} · {o.name}</span>
              <span className="text-sm">{o.total} EGP · {new Date(o.created_at).toLocaleDateString()}</span>
              <select value={o.status} onClick={(e) => e.stopPropagation()} onChange={(e) => setStatus(o.id, e.target.value)} className="border bg-white px-2 py-1 text-sm">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </summary>
            <div className="mt-3 space-y-1 text-sm">
              <p>Phone: <a href={`tel:${o.phone}`} className="underline">{o.phone}</a></p>
              <p>Address: {o.address}</p>
              <p>Payment: {o.payment === "instapay" ? "InstaPay" : "Cash on delivery"}</p>
              <ul className="my-2 list-disc pl-5">
                {o.items.map((i, k) => <li key={k}>{i.name}{i.size ? ` (${i.size})` : ""} × {i.qty} — {i.price * i.qty} EGP</li>)}
              </ul>
              <p>Subtotal {o.subtotal} · Shipping {o.shipping}{o.discount ? ` · Discount −${o.discount} (${o.coupon})` : ""}</p>
              <p className="font-semibold">Total {o.total} EGP</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
