"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  products as initialProducts,
  formatPrice,
  type Product,
  type ProductCategory,
} from "@/lib/products";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Link01Icon,
  Delete02Icon,
  Add01Icon,
  PencilEdit01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const SearchIcon = () => (
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
    <HugeiconsIcon icon={Search01Icon} size={18} />
  </div>
);

const AVAILABLE_IMAGES = [
  "blazer-dress.jpg",
  "bodycon-dress.jpg",
  "chain-bag.jpg",
  "coord-set.jpg",
  "duffle.jpg",
  "evening-clutch.jpg",
  "luxe-tote.jpg",
  "mini-crossbody.jpg",
  "satin-dress.jpg",
  "shoulder-bag.jpg",
  "wrap-blouse.jpg",
];

export default function ProductsSection() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    price: 0,
    category: "bags",
    images: ["/products/luxe-tote.jpg"],
    description: "",
    inStock: true,
    featured: false,
    colors: [],
    sizes: [],
  });

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
    setFormData({
      name: "",
      price: 0,
      category: "bags",
      images: ["/products/luxe-tote.jpg"],
      description: "",
      inStock: true,
      featured: false,
      colors: ["Blush Pink"],
      sizes: ["One Size"],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingProduct) {
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id ? ({ ...p, ...formData } as Product) : p,
        ),
      );
      toast.success("Product updated successfully");
    } else {
      const newProduct: Product = {
        ...(formData as Product),
        id: `prod-${Math.random().toString(36).substr(2, 9)}`,
        slug: formData.name!.toLowerCase().replace(/ /g, "-"),
      };
      setProductList((prev) => [newProduct, ...prev]);
      toast.success("Product added successfully");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* ── Controls ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon />
          <input
            id="admin-product-search"
            type="text"
            placeholder="Search products by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === "all"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  categoryFilter === cat
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
          >
            <HugeiconsIcon icon={Add01Icon} size={18} className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
        {filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-200">
            <p className="text-zinc-400 text-sm">
              No products found matching your criteria.
            </p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-zinc-100 p-4 hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              <div className="aspect-square rounded-xl mb-4 relative overflow-hidden bg-zinc-50">
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-white/90 backdrop-blur-sm text-[9px] font-bold px-2 py-1 rounded-lg text-zinc-500 border border-zinc-100 shadow-sm">
                    {p.id.toUpperCase()}
                  </span>
                </div>
                {p.badge && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-[var(--brand-rose)] text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm">
                      {p.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-sm font-semibold text-zinc-800 line-clamp-1 leading-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {p.name}
                  </h3>
                  <Link
                    href={`/shop/${p.slug}`}
                    target="_blank"
                    className="text-zinc-300 hover:text-[var(--brand-pink)] transition-colors"
                  >
                    <HugeiconsIcon icon={Link01Icon} size={15} />
                  </Link>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-[0.1em] font-medium">
                  {p.category}
                </p>

                <div className="pt-2 flex items-end justify-between">
                  <div>
                    <p className="text-base font-bold text-zinc-900">
                      {formatPrice(p.price)}
                    </p>
                    {p.originalPrice && (
                      <p className="text-[10px] text-zinc-400 line-through">
                        {formatPrice(p.originalPrice)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {p.colors?.slice(0, 3).map((c) => (
                      <div
                        key={c}
                        className="w-2.5 h-2.5 rounded-full border border-zinc-100 shadow-inner"
                        style={{
                          backgroundColor: c.toLowerCase().replace(/ /g, ""),
                        }}
                        title={c}
                      />
                    ))}
                    {p.colors?.length > 3 && (
                      <span className="text-[8px] text-zinc-400 font-bold">
                        +{p.colors.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2 pt-4 border-t border-zinc-50">
                <button
                  onClick={() => handleOpenEditModal(p)}
                  className="flex-1 py-2 rounded-xl bg-zinc-50 text-zinc-600 text-[11px] font-bold hover:bg-zinc-100 hover:text-zinc-900 transition-all flex items-center justify-center gap-1.5"
                >
                  <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                  Edit Details
                </button>
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="w-10 h-9 rounded-xl flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all group-hover:opacity-100"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Product Modal ── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Product Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Elegant Silk Scarf"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Price (NGN)
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      category: val as ProductCategory,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bags">Bags</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Product Image
              </label>
              <div className="grid grid-cols-4 gap-2 border rounded-2xl p-3 bg-zinc-50">
                {AVAILABLE_IMAGES.map((img) => (
                  <button
                    key={img}
                    onClick={() =>
                      setFormData({ ...formData, images: [`/products/${img}`] })
                    }
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      formData.images?.[0] === `/products/${img}`
                        ? "border-[var(--brand-pink)] ring-2 ring-[var(--brand-pink)]/20"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={`/products/${img}`}
                      alt={img}
                      fill
                      className="object-cover"
                    />
                    {formData.images?.[0] === `/products/${img}` && (
                      <div className="absolute inset-0 bg-[var(--brand-pink)]/20 flex items-center justify-center">
                        <HugeiconsIcon
                          icon={CheckmarkCircle01Icon}
                          size={20}
                          className="text-white bg-[var(--brand-pink)] rounded-full"
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full min-h-[100px] rounded-2xl border border-zinc-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all"
                placeholder="Product description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
            >
              {editingProduct ? "Save Changes" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
