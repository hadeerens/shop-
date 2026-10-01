import Link from "next/link";
import { client, img } from "@/sanity/client";

export const revalidate = 60;

export default async function Home() {
  const products = await client.fetch(
    `*[_type=="product"]|order(_createdAt desc){_id,name,price,image,inStock}`
  );
  if (!products.length)
    return <p style={{ color: "var(--muted)" }}>No products yet. Add some in /studio.</p>;

  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
      {products.map((p) => (
        <Link key={p._id} href={`/product/${p._id}`} className="block">
          <img src={img(p.image, 600)} alt={p.name} loading="lazy" className="aspect-[4/5] w-full object-cover" />
          <div className="mt-2 flex justify-between text-sm">
            <span>{p.name}</span>
            <span>{p.inStock ? `${p.price} EGP` : "Sold out"}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
