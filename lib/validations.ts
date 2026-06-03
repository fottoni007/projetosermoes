import { z } from "zod";

const maxPdfSize = 15 * 1024 * 1024;

export const sermonSchema = z.object({
  title: z.string().trim().min(2, "Indique um título com pelo menos 2 caracteres."),
  preacher_name: z
    .string()
    .trim()
    .min(2, "Indique o nome do pregador."),
  date: z.string().min(1, "Indique a data do sermão."),
  biblical_text: z
    .string()
    .trim()
    .min(2, "Indique o texto bíblico principal."),
  series_theme: z
    .string()
    .trim()
    .min(2, "Indique o tema da série."),
  notes: z.string().trim().min(1, "Adicione pelo menos uma nota."),
  pdf: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size === 0 || file.type === "application/pdf", {
      message: "O ficheiro deve ser um PDF."
    })
    .refine((file) => !file || file.size <= maxPdfSize, {
      message: "O PDF deve ter no máximo 15 MB."
    })
});

export type SermonInput = z.infer<typeof sermonSchema>;
