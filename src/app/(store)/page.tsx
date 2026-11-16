/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import CollectionGrid from "@/components/store/CollectionGrid";
import { Outline, WhatsAppIcon, cssVars } from "@/components/store/Stitch";
import { getPublishedProducts } from "@/lib/store-data";
import { policies, sizeChart, whatsappLink } from "@/lib/catalog";

// Cached; admin changes refresh it immediately via revalidatePath
export const revalidate = 3600;

const PX = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;

const STITCHES = [
  "Tepchi · running stitch",
  "Bakhiya · shadow work",
  "Phanda · millet knot",
  "Murri · rice grain",
  "Jaali · pulled thread",
  "Hool · eyelet",
  "Zanzeera · chain",
  "Keel kangan · lotus",
];

const KNOT_COLUMNS: [number, number[]][] = [
  [200, [190, 212, 234, 256, 278]],
  [184, [201, 223, 245, 267]],
  [216, [201, 223, 245, 267]],
  [168, [212, 234, 256]],
  [232, [212, 234, 256]],
];

export default async function Home() {
  const products = await getPublishedProducts();

  return (
    <>
      {/* ================= HERO ================= */}
      <section id="top" className="hero">
        <div className="buti live layer" aria-hidden="true" />
        <div className="veil" aria-hidden="true" />

        <div className="body wrap sgrid">
          <div style={{ gridColumn: "span 6", display: "flex", flexDirection: "column", gap: 28 }}>
            <p className="eyebrow rise" style={cssVars({ "--r": 0 })}>
              Lucknow · hand embroidery
            </p>
            <h1 className="rise" style={cssVars({ "--r": 1 })}>
              White thread
              <br />
              on <em>sheer cloth.</em>
            </h1>
            <p className="lede rise" style={cssVars({ "--r": 2 })}>
              Kurtis, suits, sarees and dupattas in Chikankari, made in small batches with artisan families in old
              Lucknow. Every pattern begins as a blue block print that washes away, leaving only the stitch.
            </p>
            <div
              className="rise"
              style={cssVars({ "--r": 3, display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center", marginTop: 8 })}
            >
              <Link className="stitch dark" href="#collections">
                <Outline />
                See the collection
              </Link>
              <Link href="#story" className="dashed">
                How it is made
              </Link>
            </div>
          </div>

          <div className="photos" style={{ gridColumn: "7 / span 6" }}>
            <div className="tall rise" style={cssVars({ "--r": 2 })}>
              <img
                className="layer"
                src={PX("28512776")}
                alt="Woman in a white Chikankari kurti, Lucknow"
                style={{ height: "116%", top: "-8%", position: "absolute" }}
              />
            </div>
            <div className="side rise" style={cssVars({ "--r": 3 })}>
              <div style={{ aspectRatio: "1/1" }}>
                <img src={PX("9339396")} alt="Hands embroidering fabric" loading="lazy" />
              </div>
              <div style={{ aspectRatio: "3/4" }}>
                <img src={PX("28512787")} alt="Woman in a pistachio green Chikankari kurti" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <svg className="orn load crest-float" viewBox="0 0 400 480" aria-hidden="true">
          <path pathLength={1} style={cssVars({ "--i": 0, fill: "#F3EEE4", fillOpacity: 0.94 })} d="M200 36 C300 36 352 130 340 230 C330 320 280 390 236 440 C216 462 196 462 184 436 C140 350 60 300 64 200 C68 110 120 36 200 36 Z" />
          <path pathLength={1} style={cssVars({ "--i": 1 })} d="M200 70 C284 70 322 150 312 232 C304 306 262 366 228 412 C216 428 200 428 190 410 C156 344 96 300 98 212 C100 136 140 70 200 70 Z" />
          <path pathLength={1} style={cssVars({ "--i": 2 })} d="M200 110 C262 110 290 174 282 236 C276 290 246 334 220 372 C210 386 198 386 190 372 C166 326 128 294 130 224 C132 164 158 110 200 110 Z" />
          <path pathLength={1} style={cssVars({ "--i": 3 })} d="M200 150 C240 150 258 196 252 240 C248 278 230 306 214 332 C206 344 196 344 190 332 C172 300 158 280 160 234 C162 190 174 150 200 150 Z" />
          <path pathLength={1} style={cssVars({ "--i": 2 })} d="M152 388 C130 404 118 430 120 456 M248 388 C270 404 282 430 280 456" />
          <g className="knot" style={cssVars({ "--i": 4 })}>
            {KNOT_COLUMNS.flatMap(([cx, ys]) =>
              ys.map((cy) => <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx="3" ry="8" />)
            )}
          </g>
          {[
            [200, 300],
            [200, 168],
            [150, 235],
            [250, 235],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} className="knot" style={cssVars({ "--i": 5 })} cx={cx} cy={cy} r="3" />
          ))}
        </svg>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...STITCHES, ...STITCHES].map((s, i) => (
              <span key={i}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COLLECTION ================= */}
      <section id="collections" className="collection">
        <div className="wrap" style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          <div className="head reveal">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p className="eyebrow">Tyohaar · the festive edit</p>
              <h2>The collection</h2>
            </div>
          </div>
          <CollectionGrid products={products} />
          <p className="reveal" style={{ fontSize: 14, color: "var(--ink-3)", maxWidth: 720 }}>
            {policies.handmade}{" "}
            <Link href="#size" style={{ borderBottom: "1px dashed currentColor" }}>
              Size guide
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ================= THE CRAFT ================= */}
      <section id="story" className="craft">
        <div className="makra layer" aria-hidden="true" style={{ opacity: 0.55 }} />
        <div className="bel" aria-hidden="true" style={{ top: 0, opacity: 0.7 }} />
        <div className="bel" aria-hidden="true" style={{ bottom: 0, opacity: 0.7, transform: "scaleY(-1)" }} />
        <div className="wrap sgrid" style={{ position: "relative" }}>
          <div className="photo-stack reveal" style={{ gridColumn: "span 5" }}>
            <div className="main">
              <img
                className="layer"
                src={PX("32124966")}
                alt="Woman working hand embroidery on a hoop"
                loading="lazy"
                style={{ height: "116%", top: "-8%", position: "absolute" }}
              />
            </div>
            <div className="inset">
              <img src={PX("9339397")} alt="Close-up of embroidery on yellow fabric" loading="lazy" />
            </div>
          </div>
          <div className="reveal" style={{ gridColumn: "7 / span 6", display: "flex", flexDirection: "column", gap: 28 }}>
            <p className="eyebrow" style={{ color: "#7A5F58" }}>
              The craft
            </p>
            <h2>Six stitches, and a blue line that washes away</h2>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#4A3A35" }}>
              Every pattern begins as a block print in fugitive indigo on the cloth. The karigar follows it with tepchi,
              a running stitch over four threads; outlines it in rahet; raises murri and phanda knots like grains of
              rice and millet; pulls the weave apart for jaali without cutting a single thread. When the piece is
              washed, the blue disappears and only the white remains.
            </p>
            <ul
              className="phanda"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "12px 24px",
                fontSize: 14,
                color: "#4A3A35",
              }}
            >
              <li>
                <span style={{ color: "var(--ink)" }}>Tepchi</span> — the running-stitch framework
              </li>
              <li>
                <span style={{ color: "var(--ink)" }}>Bakhiya</span> — shadow work from the reverse
              </li>
              <li>
                <span style={{ color: "var(--ink)" }}>Phanda &amp; murri</span> — millet and rice-grain knots
              </li>
              <li>
                <span style={{ color: "var(--ink)" }}>Jaali</span> — pulled-thread lattice, never cut
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= SIZE & CARE ================= */}
      <section id="size" className="size">
        <div className="jaali layer" aria-hidden="true" style={{ opacity: 0.5 }} />
        <div className="wrap sgrid" style={{ position: "relative", alignItems: "start" }}>
          <div className="panel reveal" style={{ gridColumn: "span 7", display: "flex", flexDirection: "column", gap: 20 }}>
            <p className="eyebrow" style={{ color: "#5C6B60" }}>
              Size guide
            </p>
            <h2 style={{ fontSize: 44, lineHeight: 1 }}>Measure yourself, not the garment</h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--ink-2)" }}>
              Body measurements in inches. Anarkalis and angrakhas run roomier than straight kurtas. Unsure between two
              sizes? Message us your measurements on WhatsApp.
            </p>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>US</th>
                    <th>Bust</th>
                    <th>Waist</th>
                    <th>Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((r) => (
                    <tr key={r.size}>
                      <td>{r.size}</td>
                      <td>{r.us}</td>
                      <td>{r.bust}</td>
                      <td>{r.waist}</td>
                      <td>{r.hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel reveal" style={{ gridColumn: "9 / span 4", display: "flex", flexDirection: "column", gap: 20 }}>
            <p className="eyebrow" style={{ color: "#5C6B60" }}>
              Care
            </p>
            <h3 style={{ fontSize: 32, lineHeight: 1.1 }}>Treat it like the hands that made it did</h3>
            <ul className="phanda" style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14, color: "var(--ink-2)" }}>
              <li>Dry clean zari, mirror, stone and sequin work.</li>
              <li>Otherwise cold hand-wash, mild detergent. Never machine wash: it opens the threads.</li>
              <li>No soaking, scrubbing, bleach or wringing. Dry flat, in shade.</li>
              <li>Iron on the reverse, low heat, never over embellishment.</li>
              <li>Fold into a muslin bag.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="contact">
        <div className="buti layer" aria-hidden="true" style={{ opacity: 0.55 }} />
        <div className="wrap sgrid reveal" style={{ position: "relative" }}>
          <div style={{ gridColumn: "span 7", display: "flex", flexDirection: "column", gap: 18 }}>
            <h2>
              Unsure about a size or a colour?
              <br />
              Write to us.
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)", maxWidth: 560 }}>
              We answer on WhatsApp within a few hours, send extra photographs in daylight on request, and can arrange
              alterations before dispatch.
            </p>
          </div>
          <div style={{ gridColumn: "9 / span 4", display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: "100%", aspectRatio: "4/3", overflow: "hidden", background: "#E7DECF" }}>
              <img
                src="https://images.unsplash.com/photo-1673551727871-951292d16bef?fm=jpg&q=70&w=900&auto=format&fit=crop"
                alt="Hands holding a cloth embroidered with flowers"
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <a className="stitch dark" href={whatsappLink()} target="_blank" rel="noopener">
              <Outline />
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
