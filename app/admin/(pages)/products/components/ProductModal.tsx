/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/api";
import {
  ProductFormInput,
  createProductFormData,
  validateProductForm,
  productToFormData,
  DEFAULT_PRODUCT_FORM,
} from "@/lib/productUtils";
import ProductBasicFields from "./ProductBasicFields";
import ProductImages from "./ProductImages";
import ProductColors from "./ProductColors";
import ProductSizes from "./ProductSizes";
import ProductActions from "./ProductActions";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
  editingProduct?: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}: ProductModalProps) {
  const [formData, setFormData] =
    useState<ProductFormInput>(DEFAULT_PRODUCT_FORM);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleOpen = () => {
    setErrors([]);
    if (editingProduct) {
      const converted = productToFormData(editingProduct);
      setFormData(converted);
      setPreviewUrls(editingProduct.images.map((img) => img.url));
      setSelectedFiles([]);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData(DEFAULT_PRODUCT_FORM);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setErrors([]);
  };

  const handleFilesAdd = (files: File[]) => {
    const newFiles = Array.from(files).slice(0, 10 - selectedFiles.length);
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setSelectedFiles([...selectedFiles, ...newFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const handleFileRemove = (index: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    // Only revoke URLs for newly added files (in memory)
    if (index >= previewUrls.length - selectedFiles.length) {
      URL.revokeObjectURL(newPreviews[index]);
    }

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleSave = async () => {
    console.log("🟠 [ProductModal] handleSave called");
    console.log("📝 [ProductModal] Form data:", formData);
    console.log("🖼️  [ProductModal] Selected files:", selectedFiles);

    const validation = validateProductForm(formData);

    console.log("✔️  [ProductModal] Validation result:", validation);

    if (!validation.isValid) {
      console.error("❌ [ProductModal] Validation failed:", validation.errors);
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    setLoading(true);

    try {
      console.log("🔄 [ProductModal] Creating FormData with:", {
        ...formData,
        imagesCount: selectedFiles.length,
      });

      const formDataWithFiles = createProductFormData({
        ...formData,
        images: selectedFiles.length > 0 ? selectedFiles : undefined,
      });

      console.log("📤 [ProductModal] Calling onSave with FormData");
      await onSave(formDataWithFiles);

      console.log("✅ [ProductModal] Save successful");
      onClose();
      resetForm();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save product";
      console.error("❌ [ProductModal] Save error:", error);
      console.error("❌ [ProductModal] Error message:", message);
      setErrors([message]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          resetForm();
        } else {
          handleOpen();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <p className="text-xs text-zinc-500">
            {editingProduct
              ? "Update the details of your existing product below."
              : "Fill in the details to add a new product to your catalog."}
          </p>
        </DialogHeader>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs font-medium text-red-900 mb-2">
              Please fix the following errors:
            </p>
            <ul className="text-xs text-red-800 space-y-1">
              {errors.map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
          <ProductBasicFields
            name={formData.name}
            price={formData.price}
            salePrice={formData.salePrice}
            category={formData.category}
            stock={formData.stock}
            description={formData.description}
            onNameChange={(value) => setFormData({ ...formData, name: value })}
            onPriceChange={(value) =>
              setFormData({ ...formData, price: value })
            }
            onSalePriceChange={(value) =>
              setFormData({ ...formData, salePrice: value })
            }
            onCategoryChange={(value) =>
              setFormData({ ...formData, category: value })
            }
            onStockChange={(value) =>
              setFormData({ ...formData, stock: value })
            }
            onDescriptionChange={(value) =>
              setFormData({ ...formData, description: value })
            }
          />

          <ProductImages
            selectedFiles={selectedFiles}
            previewUrls={previewUrls}
            onFilesAdd={handleFilesAdd}
            onFileRemove={handleFileRemove}
          />

          <ProductColors
            colors={formData.colors}
            onChange={(colors) => setFormData({ ...formData, colors })}
          />

          <ProductSizes
            sizes={formData.sizes}
            onChange={(sizes) => setFormData({ ...formData, sizes })}
          />

          <ProductActions
            isFeatured={formData.isFeatured}
            isNewArrival={formData.isNewArrival}
            isBestseller={formData.isBestseller || false}
            onChange={(key, value) =>
              setFormData({ ...formData, [key]: value })
            }
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editingProduct
                ? "Save Changes"
                : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
