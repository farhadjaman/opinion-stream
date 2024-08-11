import { z } from "zod";

export const verificationSchema = z.object({
  code: z.string().length(6, "Verification Code must be atleast 6 characters"),
});
