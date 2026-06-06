import { z } from "zod";

const maxPdfSize = 15 * 1024 * 1024;

export const sermonSchema = z.object({
  title: z.string().trim().min(2, "Indique um título com pelo menos 2 caracteres."),
  preacher_name: z.string().trim().min(2, "Indique o nome do pregador."),
  date: z.string().min(1, "Indique a data do sermão."),
  biblical_text: z.string().trim().min(2, "Indique o texto bíblico principal."),
  sermon_type: z.enum(["expositivo", "textual", "tematico", "narrativo"], {
    errorMap: () => ({ message: "Selecione o tipo de sermão." }),
  }),
  is_series: z.boolean(),
  series_theme: z.string().trim().min(2, "Indique o tema ou o nome da série."),
  notes: z.string().trim().min(1, "Adicione pelo menos uma nota."),
  pdf: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size === 0 || f.type === "application/pdf", {
      message: "O ficheiro deve ser um PDF.",
    })
    .refine((f) => !f || f.size <= maxPdfSize, {
      message: "O PDF deve ter no máximo 15 MB.",
    }),
});

export type SermonInput = z.infer<typeof sermonSchema>;

export const pastorProfileSchema = z.object({
  full_name: z.string().trim().min(3, "Indique o nome completo."),
  church_name: z.string().trim().min(2, "Indique o nome da igreja."),
  address: z.string().trim().min(5, "Indique a morada completa."),
  years_of_ministry: z.coerce
    .number({ invalid_type_error: "Indique o tempo de pastorado." })
    .int()
    .min(0, "Valor inválido.")
    .max(80, "Valor inválido."),
  pastor_type: z.enum(["senior", "colaborador"], {
    errorMap: () => ({ message: "Selecione o tipo de pastor." }),
  }),
  academic_background: z.string().trim().min(2, "Indique a formação académica."),
  instagram_url: z.string().trim().url("URL inválido.").or(z.literal("")).optional(),
  facebook_url: z.string().trim().url("URL inválido.").or(z.literal("")).optional(),
  youtube_url: z.string().trim().url("URL inválido.").or(z.literal("")).optional(),
  phone_country_code: z.string().min(1, "Selecione o indicativo."),
  phone_number: z
    .string()
    .trim()
    .min(6, "Número inválido.")
    .regex(/^[0-9 \-]+$/, "Apenas dígitos, espaços ou hífens."),
  contact_email: z.string().trim().email("Email inválido."),
});

export type PastorProfileInput = z.infer<typeof pastorProfileSchema>;
