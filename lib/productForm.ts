import { prisma } from "./prisma";
import { uploadProductImages, type UploadedImage } from "./imagekit";
import { HttpError } from "./apiResponse";

const CATEGORIES = ["bags", "clothing", "accessories"] as const;
type Category = (typeof CATEGORIES)[number];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Guarantee a unique slug, ignoring the product currently being edited.
export async function uniqueSlug(
  name: string,
  ignoreId?: string,
): Promise<string> {
  const base = slugify(name) || "product";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${++n}`;
  }
}

function parseBool(value: FormDataEntryValue | null): boolean {
  return value === "true" || value === "on" || value === "1";
}

function parseJsonArray<T>(value: FormDataEntryValue | null, field: string): T[] {
  if (value == null || value === "") return [];
  try {
    const parsed = JSON.parse(String(value));
    if (!Array.isArray(parsed)) throw new Error("not an array");
    return parsed as T[];
  } catch {
    throw new HttpError(400, `Invalid JSON for "${field}"`);
  }
}

export interface ParsedProduct {
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: Category;
  stock: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  images: UploadedImage[];
}

// Parse the multipart product form the admin submits. On update, existing image
// URLs are preserved via the optional `existingImages` JSON field and newly
// uploaded files are appended.
export async function parseProductForm(
  formData: FormData,
  opts: { isUpdate: boolean; currentImages?: UploadedImage[] },
): Promise<ParsedProduct> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "") as Category;
  const price = Number(formData.get("price"));
  const stockRaw = formData.get("stock");
  const stock = stockRaw == null || stockRaw === "" ? 0 : Number(stockRaw);
  const salePriceRaw = formData.get("salePrice");
  const salePrice =
    salePriceRaw == null || salePriceRaw === "" ? null : Number(salePriceRaw);

  const colors = parseJsonArray<{ name: string; hex: string }>(
    formData.get("colors"),
    "colors",
  );
  const sizes = parseJsonArray<string>(formData.get("sizes"), "sizes");

  // Validation
  if (!name) throw new HttpError(400, "Product name is required");
  if (!description) throw new HttpError(400, "Product description is required");
  if (!CATEGORIES.includes(category)) {
    throw new HttpError(400, "Category must be bags, clothing or accessories");
  }
  if (!Number.isFinite(price) || price <= 0) {
    throw new HttpError(400, "Price must be greater than 0");
  }
  if (salePrice !== null && (!Number.isFinite(salePrice) || salePrice < 0)) {
    throw new HttpError(400, "Sale price cannot be negative");
  }
  if (salePrice !== null && salePrice >= price) {
    throw new HttpError(400, "Sale price must be less than regular price");
  }
  if (!Number.isFinite(stock) || stock < 0) {
    throw new HttpError(400, "Stock must be a non-negative number");
  }
  if (colors.length === 0) throw new HttpError(400, "At least one colour is required");
  for (const c of colors) {
    if (!c.name?.trim()) throw new HttpError(400, "Each colour needs a name");
    if (!/^#[0-9A-Fa-f]{6}$/.test(c.hex ?? "")) {
      throw new HttpError(400, `Invalid hex colour for "${c.name}"`);
    }
  }
  if (sizes.length === 0) throw new HttpError(400, "At least one size is required");

  // Images: kept existing (update only) + newly uploaded files.
  const kept: UploadedImage[] = opts.isUpdate
    ? parseJsonArray<UploadedImage>(
        formData.get("existingImages"),
        "existingImages",
      ).filter((img) => img?.url)
    : [];

  const files = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0);

  const uploaded = files.length
    ? await uploadProductImages(files, name, kept.length === 0)
    : [];

  let images: UploadedImage[];
  if (opts.isUpdate) {
    // If the admin sent neither kept list nor new files, keep current images.
    const sentExisting = formData.get("existingImages") != null;
    const base = sentExisting ? kept : (opts.currentImages ?? []);
    images = [...base, ...uploaded];
  } else {
    images = uploaded;
  }

  // Exactly one main image (the first), if any images exist.
  images = images.map((img, i) => ({ ...img, isMain: i === 0 }));

  return {
    name,
    description,
    price: Math.round(price),
    salePrice: salePrice === null ? null : Math.round(salePrice),
    category,
    stock: Math.round(stock),
    colors,
    sizes,
    isFeatured: parseBool(formData.get("isFeatured")),
    isNewArrival: parseBool(formData.get("isNewArrival")),
    isBestseller: parseBool(formData.get("isBestseller")),
    images,
  };
}
