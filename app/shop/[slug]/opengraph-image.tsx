import { ImageResponse } from "next/og";
import { getProduct } from "@/lib/products-data";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export const alt = "FolaLuxe product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette (mirrors app/globals.css — satori can't read CSS variables).
const ROSE = "#b84c6e";
const BLUSH = "#f8ecef";
const CREAM = "#fdf9f6";
const DARK = "#1a1118";
const MUTED = "#8a5f6d";

const CATEGORY_LABELS: Record<string, string> = {
  bags: "Bags",
  clothing: "Clothing",
  accessories: "Accessories",
};

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Graceful brand-only fallback so shares always render something on-brand.
  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: CREAM,
            color: ROSE,
            fontSize: 96,
            letterSpacing: 12,
            fontWeight: 600,
          }}
        >
          FOLALUXE
        </div>
      ),
      { ...size },
    );
  }

  const mainImage =
    product.images.find((img) => img.isMain) || product.images[0];
  const price = product.salePrice ?? product.price;
  const category = CATEGORY_LABELS[product.category] ?? product.category;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: CREAM,
        }}
      >
        {/* Product image panel */}
        <div
          style={{
            display: "flex",
            width: 520,
            height: "100%",
            background: BLUSH,
          }}
        >
          {mainImage && (
            <img
              src={mainImage.url}
              alt={mainImage.altText || product.name}
              width={520}
              height={630}
              style={{ width: 520, height: 630, objectFit: "cover" }}
            />
          )}
        </div>

        {/* Text panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "64px 60px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 10,
              color: ROSE,
              fontWeight: 600,
            }}
          >
            FOLALUXE
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {category}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 64,
              lineHeight: 1.1,
              fontWeight: 600,
              color: DARK,
              // Clamp to two lines so long names don't overflow the canvas.
              maxHeight: 150,
              overflow: "hidden",
            }}
          >
            {product.name}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 36,
              gap: 18,
            }}
          >
            <span style={{ fontSize: 52, fontWeight: 700, color: ROSE }}>
              {formatPrice(price)}
            </span>
            {product.salePrice && (
              <span
                style={{
                  fontSize: 30,
                  color: MUTED,
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "auto",
              fontSize: 22,
              color: MUTED,
            }}
          >
            {siteConfig.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
