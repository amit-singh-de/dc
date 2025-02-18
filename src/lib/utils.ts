import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAffiliateLink(originalURL: string): string {
  try {
    const url = new URL(originalURL);
    const affiliateTags: Record<string, string> = {
      shopee: "?af=tempo_aff",
      lazada: "?spm=tempo_aff",
      amazon: "?tag=tempo-20",
    };

    for (const [domain, tag] of Object.entries(affiliateTags)) {
      if (url.hostname.includes(domain)) {
        return originalURL + (url.search ? "&" : "") + tag.substring(1);
      }
    }

    return originalURL;
  } catch {
    return originalURL;
  }
}
