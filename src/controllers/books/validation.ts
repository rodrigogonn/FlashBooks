import { z } from 'zod';
import { ContentType, KeyPointType } from '../../models/book';
import { categories } from '../../constants/categories';
import { File } from 'formidable';

const validCategoryIds = new Set(categories.map((category) => category.id));

const paragraphSchema = z.object({
  type: z.literal(ContentType.PARAGRAPH),
  text: z.string().min(1, { message: 'Paragraph text is required.' }),
});

const keyPointSchema = z.object({
  type: z.literal(ContentType.KEY_POINT),
  keyPointType: z.nativeEnum(KeyPointType),
  text: z.string().min(1, { message: 'Key point text is required.' }),
  context: z.string().optional(),
  reference: z.string().optional(),
});

const chapterSchema = z.object({
  title: z.string().min(1, { message: 'Chapter title is required.' }),
  content: z
    .array(z.discriminatedUnion('type', [paragraphSchema, keyPointSchema]))
    .nonempty({
      message: 'Chapter content cannot be empty.',
    }),
});

export const createBookSchema = z.object({
  title: z.string().min(1, { message: 'Book title is required.' }),
  author: z.string().min(1, { message: 'Author name is required.' }),
  image: z
    .any()
    .transform((file) => file as File)
    .refine(
      (file) =>
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          file?.mimetype!
        ),
      {
        message:
          'Invalid image format. Only JPEG, PNG, GIF, and WebP are allowed.',
      }
    ),
  description: z.string().min(1, { message: 'Book description is required.' }),
  chapters: z
    .string()
    .transform((val) => {
      try {
        const parsed = JSON.parse(val);
        return parsed as z.infer<typeof chapterSchema>[];
      } catch (e) {
        throw new Error('Invalid JSON format for chapters.');
      }
    })
    .refine((data) => Array.isArray(data) && data.length > 0, {
      message: 'Chapters must be a non-empty array.',
    })
    .refine((data) => chapterSchema.array().safeParse(data).success, {
      message: 'Invalid chapter structure.',
    }),
  categoryIds: z
    .string()
    .transform((val) => {
      if (!val) return [];
      try {
        const parsed = JSON.parse(val).map((id: string) => parseInt(id, 10));
        return parsed as number[];
      } catch (e) {
        throw new Error('Invalid JSON format for category IDs.');
      }
    })
    .refine(
      (categoryIds) =>
        categoryIds.every((id: number) => validCategoryIds.has(id)),
      {
        message: 'Invalid category ID(s).',
      }
    ),
  purchaseLink: z
    .string()
    .url({ message: 'Purchase link must be a valid URL.' })
    .optional(),
});
