export type SermonType = "expositivo" | "textual" | "tematico" | "narrativo";

export const SERMON_TYPE_LABELS: Record<SermonType, string> = {
  expositivo: "Expositivo",
  textual: "Textual",
  tematico: "Temático (Tópico)",
  narrativo: "Narrativo (Biográfico)",
};

export const SERMON_TYPE_OPTIONS: { value: SermonType; label: string }[] = [
  { value: "expositivo", label: "Expositivo" },
  { value: "textual", label: "Textual" },
  { value: "tematico", label: "Temático (Tópico)" },
  { value: "narrativo", label: "Narrativo (Biográfico)" },
];

export function sermonTypeLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return SERMON_TYPE_LABELS[value as SermonType] ?? null;
}
