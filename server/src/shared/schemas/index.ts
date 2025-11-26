import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce
    .number({ required_error: 'page is required' })
    .int({ message: 'page must be an integer' })
    .positive({
      message: 'page must be a positive integer',
    })
    .default(1),
  limit: z.coerce
    .number({ required_error: 'limit is required' })
    .int({ message: 'limit must be an integer' })
    .positive({ message: 'limit must be a positive integer' })
    .max(100, { message: 'limit must be at most 100' })
    .default(10),
});
