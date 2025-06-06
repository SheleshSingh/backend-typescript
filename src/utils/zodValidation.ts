import { ZodSchema } from "zod";
import createHttpError from "http-errors";

export const validationWithZodScema = <T>(
  schema: ZodSchema<T>,
  data: unknown
): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => err.message)
      .join(", ");
    throw createHttpError(400, `Validation error: ${errorMessage}`);
  }
  return result.data;
};
