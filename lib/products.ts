// Storefront-facing product shape used by the cart and its adapters.
// Live product data comes from MongoDB via the API client in `lib/api.ts`;
// this file only holds the lightweight cart type and the shared price formatter.

export { formatPrice } from "./format";

export type ProductCategory = "bags" | "clothing" | "accessories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  featured: boolean;
  inStock: boolean;
  badge?: string;
};
