import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg'] as const;

export const uploadFileSchema = z.object({
  filename: z.string().min(1),
  contentType: z.enum(ALLOWED_FILE_TYPES),
  size: z.number().max(MAX_FILE_SIZE),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;
