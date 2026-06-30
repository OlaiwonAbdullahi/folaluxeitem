/**
 * Utility functions for product operations
 * Ensures proper FormData construction according to API spec
 */

export interface ProductFormInput {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: "bags" | "clothing" | "accessories";
  stock: number;
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller?: boolean;
  images?: File[];
}

/**
 * Converts product form data to FormData object
 * Properly formats all fields according to API specification
 */
export function createProductFormData(data: ProductFormInput): FormData {
  console.log(
    "🔵 [productUtils] createProductFormData called with input:",
    data,
  );

  const formData = new FormData();

  // Text fields
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("stock", String(data.stock));

  // Numeric fields
  formData.append("price", String(data.price));
  if (data.salePrice !== undefined && data.salePrice > 0) {
    console.log("📊 [productUtils] Adding salePrice:", data.salePrice);
    formData.append("salePrice", String(data.salePrice));
  }

  // Boolean fields - send as strings for FormData compatibility
  formData.append("isFeatured", String(data.isFeatured));
  formData.append("isNewArrival", String(data.isNewArrival));
  if (data.isBestseller !== undefined) {
    formData.append("isBestseller", String(data.isBestseller));
  }

  // JSON fields - stringify arrays/objects
  const colorsString = JSON.stringify(data.colors);
  const sizesString = JSON.stringify(data.sizes);

  console.log("🎨 [productUtils] Colors JSON:", colorsString);
  console.log("📏 [productUtils] Sizes JSON:", sizesString);

  formData.append("colors", colorsString);
  formData.append("sizes", sizesString);

  // File uploads
  if (data.images && data.images.length > 0) {
    console.log(`🖼️  [productUtils] Adding ${data.images.length} images`);
    data.images.forEach((file, index) => {
      console.log(
        `  📸 Image ${index + 1}:`,
        file.name,
        `(${file.size} bytes)`,
      );
      formData.append("images", file);
    });
  } else {
    console.log("ℹ️  [productUtils] No images provided");
  }

  // Log FormData contents for debugging
  console.log("✅ [productUtils] FormData created. Contents:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}:`, `File(${value.name})`);
    } else {
      console.log(`  ${key}:`, value);
    }
  }

  return formData;
}

/**
 * Validates product form data
 */
export function validateProductForm(data: ProductFormInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name?.trim()) {
    errors.push("Product name is required");
  }

  if (!data.description?.trim()) {
    errors.push("Product description is required");
  }

  if (!data.price || data.price <= 0) {
    errors.push("Product price must be greater than 0");
  }

  if (data.salePrice !== undefined && data.salePrice < 0) {
    errors.push("Sale price cannot be negative");
  }

  if (data.salePrice && data.salePrice >= data.price) {
    errors.push("Sale price must be less than regular price");
  }

  if (!data.stock || data.stock < 0) {
    errors.push("Stock must be a positive number");
  }

  if (!data.colors || data.colors.length === 0) {
    errors.push("At least one color is required");
  }

  if (!data.sizes || data.sizes.length === 0) {
    errors.push("At least one size is required");
  }

  // Validate colors structure
  if (data.colors) {
    data.colors.forEach((color, index) => {
      if (!color.name?.trim()) {
        errors.push(`Color ${index + 1}: Name is required`);
      }
      if (!color.hex?.match(/^#[0-9A-Fa-f]{6}$/)) {
        errors.push(`Color ${index + 1}: Invalid hex color code`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Converts API Product response to form input
 */
export function productToFormData(product: any): ProductFormInput {
  return {
    name: product.name,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    category: product.category,
    stock: product.stock,
    colors: product.colors || [],
    sizes: product.sizes || [],
    isFeatured: product.isFeatured || false,
    isNewArrival: product.isNewArrival || false,
    isBestseller: product.isBestseller || false,
  };
}

/**
 * Default product template
 */
export const DEFAULT_PRODUCT_FORM: ProductFormInput = {
  name: "",
  description: "",
  price: 0,
  salePrice: undefined,
  category: "bags",
  stock: 0,
  colors: [{ name: "Blush Pink", hex: "#FFB6C1" }],
  sizes: ["One Size"],
  isFeatured: false,
  isNewArrival: false,
  isBestseller: false,
};
