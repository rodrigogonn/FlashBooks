import { z } from 'zod';

export const createBookCollectionSchema = z.object({
  name: z.string().min(1, { message: 'O nome da coleção é obrigatório.' }),
  books: z
    .array(
      z
        .string()
        .min(1, { message: 'Cada ID de livro deve ser uma string não vazia.' })
    )
    .nonempty({ message: 'A coleção deve possuir pelo menos um livro.' }),
});

export type CreateBookCollectionParams = z.infer<
  typeof createBookCollectionSchema
>;
