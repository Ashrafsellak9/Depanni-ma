import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "DEPANNI.ma — Artisans vérifiés à El Jadida";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number, text: string, italic = false) {
  const ital = italic ? "1" : "0";
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${ital},${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url).then((res) => res.text());
  const match = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  const fontUrl = match?.[1];
  if (!fontUrl) {
    throw new Error(`Police ${family} introuvable`);
  }
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

export default async function OpenGraphImage() {
  const title = "L'artisan qu'il vous faut, en quelques minutes.";
  const [fraunces, frauncesItalic, interTight] = await Promise.all([
    loadGoogleFont("Fraunces", 700, title + "DEPANNI", false),
    loadGoogleFont("Fraunces", 700, "faut", true),
    loadGoogleFont("Inter Tight", 500, "El Jadida · Maroc .ma", false),
  ]);

  const dots = Array.from({ length: 36 }, (_, i) => i);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5EFE6",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 36,
            display: "flex",
            flexWrap: "wrap",
            width: 168,
            gap: 10,
          }}
        >
          {dots.map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                background: "rgba(217, 69, 31, 0.2)",
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 64, maxWidth: 980 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Fraunces",
              fontSize: 72,
              lineHeight: 1.05,
              color: "#0B1B2B",
              letterSpacing: "-0.03em",
            }}
          >
            L’artisan qu’il vous{" "}
            <span
              style={{
                fontFamily: "Fraunces Italic",
                color: "#D9451F",
                marginLeft: 16,
              }}
            >
              faut
            </span>
            ,
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 72,
              lineHeight: 1.05,
              color: "#0B1B2B",
              letterSpacing: "-0.03em",
            }}
          >
            en quelques minutes.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: "Fraunces",
                fontSize: 36,
                fontWeight: 700,
                color: "#0B1B2B",
              }}
            >
              DEPANNI
            </span>
            <span
              style={{
                fontFamily: "Inter Tight",
                fontSize: 28,
                color: "#D9451F",
              }}
            >
              .ma
            </span>
          </div>
          <span
            style={{
              fontFamily: "Inter Tight",
              fontSize: 22,
              color: "#0B1B2B",
            }}
          >
            El Jadida · Maroc
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 700 },
        { name: "Fraunces Italic", data: frauncesItalic, style: "italic", weight: 700 },
        { name: "Inter Tight", data: interTight, style: "normal", weight: 500 },
      ],
    },
  );
}
