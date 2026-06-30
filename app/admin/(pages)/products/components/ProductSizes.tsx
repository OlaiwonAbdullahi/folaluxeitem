"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plus, Trash2 } from "@hugeicons/core-free-icons";

interface ProductSizesProps {
  sizes: string[];
  onChange: (sizes: string[]) => void;
}

export default function ProductSizes({ sizes, onChange }: ProductSizesProps) {
  const addSize = () => {
    onChange([...sizes, ""]);
  };

  const updateSize = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    onChange(newSizes);
  };

  const removeSize = (index: number) => {
    if (sizes.length > 1) {
      onChange(sizes.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-500 uppercase">
          Available Sizes
        </label>
        <Button
          onClick={addSize}
          variant="outline"
          size="sm"
          className="rounded-lg h-7 text-xs gap-1"
        >
          <HugeiconsIcon icon={Plus} size={14} />
          Add Size
        </Button>
      </div>

      <div className="space-y-2 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
        {sizes.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">
            Add at least one size
          </p>
        ) : (
          <div className="space-y-2">
            {sizes.map((size, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={size}
                  onChange={(e) => updateSize(index, e.target.value)}
                  placeholder="e.g., S, M, L, XL or One Size"
                  className="h-8"
                />
                <button
                  onClick={() => removeSize(index)}
                  type="button"
                  disabled={sizes.length === 1}
                  className="w-8 h-8 flex items-center justify-center rounded text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                  <HugeiconsIcon icon={Trash2} size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
