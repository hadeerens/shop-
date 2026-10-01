import Link from "next/link";
import { client, img } from "@/sanity/client";

export const revalidate = 60;

export default async function Home() {
  const products = await client.fetch(
    `*[_type=="product"]|order(_createdAt desc){_id,name,price,image,inStock}`
  );
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">New arrivals</h1>
      {!products.length && <p style={{ color: "var(--muted)" }}>No products yet. Add some at /studio.</p>}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {products.map((p) => (
          <Link key={p._id} href={`/product/${p._id}`} className="block rounded-2xl bg-white p-2 shadow-sm">
            {p.image && <img src={img(p.image, 600)} alt={p.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />}
            <div className="flex justify-between px-1 py-2 text-sm">
              <span className="font-medium">{p.name}</span>
              <span style={{ color: p.inStock ? "var(--accent)" : "var(--muted)" }}>
                {p.inStock ? `${p.price} EGP` : "Sold out"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
