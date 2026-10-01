import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { client } from "@/sanity/client";

const SHIPPING = 60; // keep in sync with cart/page.jsx
const bad = (error, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return bad("Invalid request"); }

  const name = String(b.name || "").trim();
  const phone = String(b.phone || "").trim();
  const address = String(b.address || "").trim();
  const payment = b.payment === "instapay" ? "instapay" : "cod";
  if (!name || !address || !/^01\d{9}$/.test(phone) || !Array.isArray(b.items) || !b.items.length)
    return bad("Please check your name, phone and address.");

  // Prices always come from Sanity, never from the browser.
  const ids = b.items.map((i) => String(i.id));
  const products = await client.fetch(
    `*[_type=="product" && _id in $ids]{_id,name,price,inStock}`, { ids }
  );

  const lines = [];
  for (const i of b.items) {
    const p = products.find((x) => x._id === i.id);
    const qty = Math.min(Math.max(parseInt(i.qty) || 0, 0), 10);
    if (!p || !p.inStock || !qty) return bad("An item in your cart is no longer available.");
    lines.push({ id: p._id, name: p.name, size: i.size || null, qty, price: p.price });
  }

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data, error } = await sb
    .from("orders")
    .insert({ name, phone, address, payment, items: lines, subtotal, shipping: SHIPPING, total: subtotal + SHIPPING })
    .select("id")
    .single();
  if (error) return bad("Could not save your order. Please try again.", 500);

  return NextResponse.json({ orderId: data.id });
}
