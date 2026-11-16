import Link from "next/link";
import { Product } from "@/lib/supabase";
import { categoryLabel, formatPrice, sizesLabel } from "@/lib/catalog";

export default function ProductCard({ product: p, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <Link className="card reveal" href={`/product/${p.id}`}>
      <div className="frame">
        {p.images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="photo" src={p.images[0]} alt={p.name} loading="lazy" />
        )}
        <div className="shade" aria-hidden="true" />
        {p.colour && <span className="colour">{p.colour}</span>}
      </div>
      <div className="meta">
        <span className="cat">
          {categoryLabel(p.category)}
          {p.fabric && ` · ${p.fabric}`}
        </span>
        <span className="name">{p.name}</span>
        {!compact && p.work_type && <span className="work">{p.work_type}</span>}
        <span className="row">
          <span>{compact ? "" : sizesLabel(p.sizes)}</span>
          <b>{formatPrice(p.price)}</b>
        </span>
      </div>
    </Link>
  );
}
