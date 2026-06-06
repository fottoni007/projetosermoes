import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Servos Fiéis — Recursos para a pregação";

// Imagem de partilha (Open Graph / Twitter) — usada em pré-visualizações de
// links no WhatsApp, redes sociais, etc.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#f7f2ea",
          color: "#1f2933",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#586f4f",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#586f4f",
              color: "#ffffff",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: 0,
            }}
          >
            SF
          </div>
          Servos Fiéis
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Recursos úteis para o pregador
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "#586f4f" }}>
          Sermões · Fórum · Dicas Preciosas · Downloads
        </div>
      </div>
    ),
    { ...size }
  );
}
