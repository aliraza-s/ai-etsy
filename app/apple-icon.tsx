import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "linear-gradient(135deg, #D7765A 0%, #E89272 100%)",
        color: "white",
        borderRadius: 38,
        fontSize: 128,
        fontWeight: 700,
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      C
    </div>,
    { ...size },
  );
}
