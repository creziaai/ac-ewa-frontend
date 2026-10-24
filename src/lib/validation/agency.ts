import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  ownerEmail: z.string().min(1, "Owner email is required").email("Enter a valid email address"),
});
export type CreateClientInput = z.infer<typeof createClientSchema>;

export const brandSettingsSchema = z.object({
  brandName: z.string().optional().or(z.literal("")),
  logoUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  primaryColor: z.string().optional().or(z.literal("")),
  supportEmail: z.string().email("Enter a valid email").optional().or(z.literal("")),
  customDomain: z.string().optional().or(z.literal("")),
});
export type BrandSettingsInput = z.infer<typeof brandSettingsSchema>;

export const createApiKeySchema = z.object({ name: z.string().min(1, "Key name is required") });
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;

