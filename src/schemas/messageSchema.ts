import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must contain atleast 1 character")
    .max(500, "Message must contain at most 500 characters"),
});
