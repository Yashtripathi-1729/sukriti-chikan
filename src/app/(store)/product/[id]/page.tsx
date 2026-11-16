import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToBag from "@/components/store/AddToBag";
import Gallery from "@/components/store/Gallery";
import ProductCard from "@/components/store/ProductCard";
import { getPublishedProduct, getPublishedProducts } from "@/lib/store-data";
import { categoryLabel, formatPrice, policies } from "@/lib/catalog";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPublishedProduct((await params).id);
  if (!p) return { title: "Not found — Sukriti Chikan" };
  return {
    title: `${p.name} — Sukriti Chikan`,
    description: p.description,
    openGraph: { images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = await getPublishedProduct((await params).id);
  if (!p) notFound();

  const related = (await getPublishedProducts())
    .filter((r) => r.category === p.category && r.id !== p.id)
    .slice(0, 4);

  const details = [
    ["Category", categoryLabel(p.category)],
    ["Fabric", p.fabric],
    ["Work", p.work_type],
    ["Colour", p.colour],
  ].filter(([, v]) => v);

  return (
    <>
      <section className="pdp">
        <div className="wrap">
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/#collections">{categoryLabel(p.category)}</Link>
            <span>›</span>
            {p.name}
          </div>
          <div className="sgrid">
            <div className="image-col" style={{ gridColumn: "span 7" }}>
              <Gallery images={p.images} alt={p.name} />
            </div>
            <div className="info" style={{ gridColumn: "9 / span 4" }}>
              <p className="eyebrow">
                {categoryLabel(p.category)}
                {p.fabric && ` · ${p.fabric}`}
              </p>
              <h1 className="product-name">{p.name}</h1>
              <p className="product-price">{formatPrice(p.price)}</p>
              {p.colour && <p style={{ fontFamily: "var(--display)", fontStyle: "italic", fontSize: 18 }}>{p.colour}</p>}
              {p.description && (
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)" }}>{p.description}</p>
              )}
              {p.work_type && <p style={{ fontSize: 13, color: "var(--ink-3)" }}>{p.work_type}</p>}

              <AddToBag product={p} />

              <div style={{ display: "flex", flexDirection: "column" }}>
                <details className="accordion">
                  <summary>Details</summary>
                  <div className="acc-body">
                    {details.map(([k, v]) => (
                      <div key={k}>
                        {k}: {v}
                      </div>
                    ))}
                  </div>
                </details>
                <details className="accordion">
                  <summary>Care</summary>
                  <div className="acc-body">
                    <ul className="phanda">
                      {policies.care.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </details>
                <details className="accordion">
                  <summary>Shipping &amp; Returns</summary>
                  <div className="acc-body">
                    <ul className="phanda">
                      {policies.shipping.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                    <ul className="phanda" style={{ marginTop: 12 }}>
                      {policies.returns.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="also-like">
          <div className="wrap">
            <h2>You may also like</h2>
            <div className="products">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
