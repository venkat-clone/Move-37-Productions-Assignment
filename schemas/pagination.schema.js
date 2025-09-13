import { z } from 'zod';

const paginationSchema = z.object({
    pageNo: z.preprocess(
        (val) => (val !== undefined ? parseInt(val, 10) : undefined),
        z.number().int().positive().optional().default(1)
    ),
    pageSize: z.preprocess(
        (val) => (val !== undefined ? parseInt(val, 10) : undefined),
        z.number().int().positive().optional().default(10)
    ),
    query: z.string().optional().default(''),
    sortOrder: z
        .enum(['asc', 'desc'])
        .optional()
        .transform((val) => (val || 'asc').toLowerCase())
        .default('asc'),
});

export default paginationSchema;
