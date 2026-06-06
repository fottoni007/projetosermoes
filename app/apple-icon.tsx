import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Ícone para ecrã inicial em iOS (apple-touch-icon).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#586f4f",
          color: "#ffffff",
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        SF
      </div>
    ),
    { ...size }
  );
}
