import { createHash } from "crypto";

const VT_BASE = "https://www.virustotal.com/api/v3";

export interface VtResult {
  safe: boolean;
  message: string;
}

export async function scanPdfBuffer(buffer: Buffer): Promise<VtResult> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) return { safe: true, message: "" };

  const hash = createHash("sha256").update(buffer).digest("hex");

  // 1. Hash lookup (instant)
  try {
    const res = await fetch(`${VT_BASE}/files/${hash}`, {
      headers: { "x-apikey": apiKey },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = await res.json();
      const stats = data.data.attributes.last_analysis_stats ?? {};
      const malicious = (stats.malicious ?? 0) + (stats.suspicious ?? 0);
      if (malicious > 0) {
        return {
          safe: false,
          message: `Ficheiro bloqueado: detectado como malicioso por ${malicious} motor(es) de antivírus.`,
        };
      }
      return { safe: true, message: "" };
    }

    // 2. Not in VT database — upload and quick poll
    if (res.status === 404) {
      return await uploadAndScan(buffer, apiKey);
    }
  } catch {
    // VT unreachable — allow
  }

  return { safe: true, message: "" };
}

async function uploadAndScan(buffer: Buffer, apiKey: string): Promise<VtResult> {
  try {
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: "application/pdf" }), "sermon.pdf");

    const upload = await fetch(`${VT_BASE}/files`, {
      method: "POST",
      headers: { "x-apikey": apiKey },
      body: formData,
      signal: AbortSignal.timeout(8000),
    });

    if (!upload.ok) return { safe: true, message: "" };

    const analysisId = (await upload.json()).data.id;

    // Poll up to 3 times × 3s = 9s max
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const analysis = await fetch(`${VT_BASE}/analyses/${analysisId}`, {
        headers: { "x-apikey": apiKey },
        signal: AbortSignal.timeout(4000),
      });

      if (!analysis.ok) continue;
      const aData = await analysis.json();

      if (aData.data.attributes.status === "completed") {
        const stats = aData.data.attributes.stats ?? {};
        const malicious = (stats.malicious ?? 0) + (stats.suspicious ?? 0);
        if (malicious > 0) {
          return {
            safe: false,
            message: `Ficheiro bloqueado: detectado como malicioso por ${malicious} motor(es) de antivírus.`,
          };
        }
        return { safe: true, message: "" };
      }
    }
  } catch {
    // Timeout or error — allow
  }

  return { safe: true, message: "" };
}
