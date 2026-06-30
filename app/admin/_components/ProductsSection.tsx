"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { api, type Product as ApiProduct } from "@/lib/api";
import ProductFilters from "../(pages)/products/components/ProductFilters";
import ProductGrid from "../(pages)/products/components/ProductGrid";
import ProductModal from "../(pages)/products/components/ProductModal";

export default function ProductsSection() {
  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts({ limit: 100 });
      setProductList(response.data.products);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return productList.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [search, categoryFilter, productList]);

  const categories = Array.from(new Set(productList.map((p) => p.category)));

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ApiProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await api.adminDeleteProduct(id);
        setProductList((prev) => prev.filter((p) => p._id !== id));
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error(error);
      }
    }
  };

  const handleSaveProduct = async (formData: FormData) => {
    console.log("🟡 [ProductsSection] handleSaveProduct called");
    console.log(
      "📋 [ProductsSection] FormData keys:",
      Array.from(formData.keys()),
    );
    console.log("📋 [ProductsSection] FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, `File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    try {
      console.log("🔵 [ProductsSection] editingProduct:", editingProduct?._id);

      if (editingProduct) {
        console.log(
          `📝 [ProductsSection] Updating product ${editingProduct._id}`,
        );
        const response = await api.adminUpdateProduct(
          editingProduct._id,
          formData,
        );
        console.log("✅ [ProductsSection] Update response:", response);
        setProductList((prev) =>
          prev.map((p) => (p._id === editingProduct._id ? response.data : p)),
        );
        toast.success("Product updated successfully");
      } else {
        console.log("📝 [ProductsSection] Creating new product");
        const response = await api.adminCreateProduct(formData);
        console.log("✅ [ProductsSection] Create response:", response);
        console.log("✅ [ProductsSection] Created product:", response.data);
        setProductList((prev) => [response.data, ...prev]);
        toast.success("Product added successfully");
      }
      setEditingProduct(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ [ProductsSection] Error saving product:", error);
      if (error instanceof Error) {
        console.error("❌ [ProductsSection] Error message:", error.message);
        console.error("❌ [ProductsSection] Error stack:", error.stack);
      }
      const message =
        error instanceof Error ? error.message : "Failed to save product";
      toast.error(message);
      throw error; // Re-throw for modal to handle
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-5">
        <div className="h-12 bg-zinc-100 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-zinc-100 p-4"
            >
              <div className="aspect-square rounded-xl bg-zinc-100 mb-4 animate-pulse"></div>
              <div className="h-4 bg-zinc-100 rounded mb-2 animate-pulse"></div>
              <div className="h-3 bg-zinc-100 rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="h-8 bg-zinc-100 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={categories}
        onAddProduct={handleOpenAddModal}
      />

      <ProductGrid
        products={filtered}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteProduct}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
}
