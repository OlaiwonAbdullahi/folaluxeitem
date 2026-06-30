"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductBasicFieldsProps {
  name: string;
  price: number;
  salePrice?: number;
  category: "bags" | "clothing" | "accessories";
  stock: number;
  description: string;
  onNameChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  onSalePriceChange: (value: number | undefined) => void;
  onCategoryChange: (value: "bags" | "clothing" | "accessories") => void;
  onStockChange: (value: number) => void;
  onDescriptionChange: (value: string) => void;
}

export default function ProductBasicFields({
  name,
  price,
  salePrice,
  category,
  stock,
  description,
  onNameChange,
  onPriceChange,
  onSalePriceChange,
  onCategoryChange,
  onStockChange,
  onDescriptionChange,
}: ProductBasicFieldsProps) {
  return (
    <>
      <div className="grid gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">
          Product Name *
        </label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g., Elegant Silk Scarf"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">
            Price (NGN) *
          </label>
          <Input
            type="number"
            value={price || ""}
            onChange={(e) => onPriceChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            min="0"
            required
          />
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">
            Sale Price (NGN)
          </label>
          <Input
            type="number"
            value={salePrice || ""}
            onChange={(e) =>
              onSalePriceChange(
                e.target.value ? parseInt(e.target.value) : undefined,
              )
            }
            placeholder="Optional"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">
            Category *
          </label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bags">Bags</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">
            Stock *
          </label>
          <Input
            type="number"
            value={stock || ""}
            onChange={(e) => onStockChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-xs font-bold text-zinc-500 uppercase">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Provide detailed product description..."
          className="w-full min-h-[100px] rounded-2xl border border-zinc-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all resize-none"
          required
        />
      </div>
    </>
  );
}
