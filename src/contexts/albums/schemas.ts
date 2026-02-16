import { z } from "zod";

export const albumNewFormSchema = z.object({
    title: z.string().min(1, { message: "Campo obrigatório" }).max(255),
    photosIds: z.array(z.string().uuid()).optional()
});

// Transformando em tipo para ser usado no formulário
export type AlbumNewFormSchema = z.infer<typeof albumNewFormSchema>;
