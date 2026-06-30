import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ROSE = "#b84c6e";
const CREAM = "#fdf9f6";
const DARK = "#1a1118";
const MUTED = "#8a5f6d";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            letterSpacing: 16,
            color: ROSE,
            fontWeight: 600,
          }}
        >
          FOLALUXE
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 64,
            fontWeight: 600,
            color: DARK,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          Premium Fashion Boutique
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            color: MUTED,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Curated luxury clothing & designer bags
        </div>
      </div>
    ),
    { ...size },
  );
}
