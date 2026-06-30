"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { Plus, Trash2 } from "@hugeicons/core-free-icons";

interface ProductColor {
  name: string;
  hex: string;
}

interface ProductColorsProps {
  colors: ProductColor[];
  onChange: (colors: ProductColor[]) => void;
}

export default function ProductColors({
  colors,
  onChange,
}: ProductColorsProps) {
  const addColor = () => {
    onChange([
      ...colors,
      {
        name: "",
        hex: "#000000",
      },
    ]);
  };

  const updateColor = (index: number, field: "name" | "hex", value: string) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    onChange(newColors);
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      onChange(colors.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-500 uppercase">
          Colors
        </label>
        <Button
          onClick={addColor}
          variant="outline"
          size="sm"
          className="rounded-lg h-7 text-xs gap-1"
        >
          <HugeiconsIcon icon={Plus} size={14} />
          Add Color
        </Button>
      </div>

      <div className="space-y-2 bg-zinc-50 p-3 rounded-2xl border border-zinc-200">
        {colors.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">
            Add at least one color
          </p>
        ) : (
          colors.map((color, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1 grid gap-1">
                <label className="text-xs text-zinc-600 font-medium">
                  Color Name
                </label>
                <Input
                  value={color.name}
                  onChange={(e) => updateColor(index, "name", e.target.value)}
                  placeholder="e.g., Blush Pink"
                  className="h-8"
                />
              </div>

              <div className="flex gap-2 items-end">
                <div className="grid gap-1">
                  <label className="text-xs text-zinc-600 font-medium">
                    Hex Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) =>
                        updateColor(index, "hex", e.target.value)
                      }
                      className="w-8 h-8 rounded cursor-pointer border border-zinc-300"
                    />
                    <Input
                      value={color.hex}
                      onChange={(e) =>
                        updateColor(index, "hex", e.target.value)
                      }
                      placeholder="#000000"
                      className="w-24 h-8 font-mono text-xs"
                      maxLength={7}
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeColor(index)}
                  type="button"
                  disabled={colors.length === 1}
                  className="w-8 h-8 flex items-center justify-center rounded text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <HugeiconsIcon icon={Trash2} size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
