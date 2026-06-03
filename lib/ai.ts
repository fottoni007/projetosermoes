const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

export interface PdfAnalysisResult {
  hasLinks: boolean;
  summary: string | null;
  error?: string;
}

export async function analyzePdf(pdfBuffer: Buffer): Promise<PdfAnalysisResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { hasLinks: false, summary: null, error: "Chave API não configurada." };

  const pdfBase64 = pdfBuffer.toString("base64");

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "pdfs-2024-09-25",
        "content-type": "application/json",
      },
      signal: AbortSignal.timeout(25000),
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 2048,
        messages: [{
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
            },
            {
              type: "text",
              text: `Analisa este PDF e responde APENAS com JSON válido (sem markdown):
{"has_links":false,"summary":"resumo aqui"}

Regras:
- has_links: true se o PDF tiver hiperlinks, URLs ou links clicáveis; false caso contrário
- summary: se has_links for false, escreve um resumo em português europeu com 3-4 parágrafos cobrindo tema bíblico, pontos-chave, aplicações práticas e conclusão. Se has_links for true, coloca null.`,
            },
          ],
        }],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic error:", await response.text());
      return { hasLinks: false, summary: null, error: "Erro na análise IA." };
    }

    const data = await response.json();
    const text = (data.content?.[0]?.text ?? "").trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { hasLinks: false, summary: null };

    const result = JSON.parse(jsonMatch[0]);
    return {
      hasLinks: result.has_links === true,
      summary: result.summary ?? null,
    };
  } catch (err) {
    console.error("PDF analysis error:", err);
    return { hasLinks: false, summary: null };
  }
}
