import { NextResponse } from "next/server";
import { applyCoupon } from "@/lib/coupon";

export async function POST(req) {
  const { code, subtotal } = await req.json().catch(() => ({}));
  const r = await applyCoupon(code, Number(subtotal) || 0);
  return NextResponse.json(r, { status: r.error ? 400 : 200 });
}
