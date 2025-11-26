import { paginationSchema } from '@/shared/schemas';
import { z } from 'zod';

export const insertProductSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .min(1, 'name must be at least 1 character')
    .max(255, 'name must be at most 255 characters'),
  description: z.string().optional(),
  category: z
    .string({ required_error: 'category is required' })
    .min(1, 'category is required')
    .max(100, 'category must be at most 100 characters')
    .transform((val) => val.trim().toLowerCase()),
  price: z
    .number({ required_error: 'price is required' })
    .positive('price must be a positive number'),
  quantity: z
    .number({ required_error: 'quantity is required' })
    .int()
    .min(0, 'quantity cannot be negative'),
  storeId: z.string({ required_error: 'storeId is required' }).uuid('storeId must be a valid UUID'),
  sku: z
    .string({ required_error: 'sku is required' })
    .max(50, 'sku must be at most 50 characters')
    .transform((val) => val.trim().toLowerCase()),
});

export const updateProductSchema = insertProductSchema.partial();

export const productFilterSchema = paginationSchema.extend({
  category: z.string().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minStock: z.coerce.number().int().min(0).optional(),
  maxStock: z.coerce.number().int().min(0).optional(),
  storeId: z.string().uuid().optional(),
});
