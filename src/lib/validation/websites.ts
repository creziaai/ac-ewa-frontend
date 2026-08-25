import { z } from "zod";

// Mirrors CreateWebsiteDto: @IsUrl({ require_protocol: true }) url, @IsString() name.
export const createWebsiteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().min(1, "URL is required").url("Include the protocol, e.g. https://example.com"),
});

export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;

export const startScanSchema = z.object({
  url: z.string().min(1, "URL is required").url("Include the protocol, e.g. https://example.com"),
});

export type StartScanInput = z.infer<typeof startScanSchema>;

