// Shared catalogue constants and store copy (edit policies here)

export const CATEGORIES = [
  "kurti",
  "suit",
  "saree",
  "dupatta",
  "fabric",
  "men",
  "kids",
  "accessories",
];

export const CATEGORY_LABELS: Record<string, string> = {
  kurti: "Kurti",
  suit: "Suit",
  saree: "Saree",
  dupatta: "Dupatta",
  fabric: "Fabric",
  men: "Men",
  kids: "Kids",
  accessories: "Accessories",
};

// Categories that are sold in sizes; others default to "Free size"
export const SIZED_CATEGORIES = ["kurti", "suit", "men", "kids"];
export const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
export const DEFAULT_SIZES = ["S", "M", "L", "XL"];
export const FREE_SIZE = "Free size";

export const categoryLabel = (c: string) => CATEGORY_LABELS[c] || c;

export const formatPrice = (n: number) => "₹" + n.toLocaleString("en-IN");

export function sortSizes(sizes: string[]) {
  return SIZE_ORDER.filter((s) => sizes.includes(s));
}

// "S–XL" for a continuous run, otherwise "S, L, XL"
export function sizesLabel(sizes: string[]) {
  const sorted = sortSizes(sizes);
  if (sorted.length === 0) return FREE_SIZE;
  const first = SIZE_ORDER.indexOf(sorted[0]);
  const continuous = sorted.every((s, i) => SIZE_ORDER.indexOf(s) === first + i);
  return continuous && sorted.length > 2
    ? `${sorted[0]}–${sorted[sorted.length - 1]}`
    : sorted.join(", ");
}

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${text}`;
}

// Free-shipping threshold shown in the bag (set to 0 to hide the note)
export const FREE_SHIPPING_ABOVE = 5000;

export const sizeChart = [
  { size: "XS", us: "0–2", bust: "32–33", waist: "24–25", hip: "34.5–35.5" },
  { size: "S", us: "4–6", bust: "34–35", waist: "26–27", hip: "36–37" },
  { size: "M", us: "8–10", bust: "36–37", waist: "28–29", hip: "38.5–39.5" },
  { size: "L", us: "12–14", bust: "38.5–40", waist: "30.5–32", hip: "41–42.5" },
  { size: "XL", us: "16–18", bust: "41.5–43", waist: "33.5–35", hip: "44–45.5" },
];

export const policies = {
  care: [
    "Dry clean recommended for zari, mirror, stone and sequin work.",
    "Otherwise hand wash in cold water with a mild detergent. Do not soak, scrub or machine wash — machine washing can open the embroidery threads.",
    "Do not bleach or wring. Dry flat in the shade.",
    "Iron on the reverse on low heat; never iron directly over embellishments.",
    "Store folded in a muslin bag, away from sunlight and damp.",
  ],
  shipping: [
    "Orders are dispatched within 2–4 working days, depending on stock.",
    "Free shipping across India on orders above ₹5,000.",
    "Buyers outside India are responsible for import duties, customs and local taxes.",
  ],
  returns: [
    "Size exchanges and returns are accepted within 7 days of delivery.",
    "Items must be unworn, unwashed, unaltered and undamaged, with original tags attached.",
    "To change the address, size or phone number on an order, message us on WhatsApp before it ships.",
  ],
  handmade:
    "Hand-embroidered pieces vary a little in stitch density and placement; that is how you know a hand made it. Lengths may differ by up to an inch.",
};
