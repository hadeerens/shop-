import { notFound } from "next/navigation";
import { client, img } from "@/sanity/client";
import AddToCart from "./AddToCart";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const p = await client.fetch(`*[_type=="product" && _id==$id][0]`, { id });
  if (!p) notFound();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img src={img(p.image, 1000)} alt={p.name} className="w-full object-cover" />
      <div>
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <p className="mt-1 text-lg">{p.price} EGP</p>
        {p.description && <p className="mt-4 max-w-prose" style={{ color: "var(--muted)" }}>{p.description}</p>}
        <AddToCart
          product={{ id: p._id, name: p.name, price: p.price, image: img(p.image, 200) }}
          sizes={p.sizes || []}
          inStock={p.inStock}
        />
      </div>
    </div>
  );
}
