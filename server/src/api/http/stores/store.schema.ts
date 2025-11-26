import { z } from 'zod';

export const insertStoreSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .min(1, 'name must be at least 1 character')
    .max(255, 'name must be at most 255 characters'),
  description: z.string().optional(),
});

export const updateStoreSchema = insertStoreSchema.partial();
