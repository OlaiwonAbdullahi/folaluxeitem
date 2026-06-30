"use client";

interface ProductActionsProps {
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  onChange: (
    key: "isFeatured" | "isNewArrival" | "isBestseller",
    value: boolean,
  ) => void;
}

export default function ProductActions({
  isFeatured,
  isNewArrival,
  isBestseller,
  onChange,
}: ProductActionsProps) {
  const actions = [
    {
      key: "isFeatured" as const,
      label: "Featured Product",
      description: "Display on featured section",
      value: isFeatured,
    },
    {
      key: "isNewArrival" as const,
      label: "New Arrival",
      description: "Mark as new arrival",
      value: isNewArrival,
    },
    {
      key: "isBestseller" as const,
      label: "Bestseller",
      description: "Mark as bestseller",
      value: isBestseller,
    },
  ];

  return (
    <div className="grid gap-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-200">
      <label className="text-xs font-bold text-zinc-500 uppercase">
        Product Actions
      </label>
      <div className="space-y-2">
        {actions.map((action) => (
          <label
            key={action.key}
            className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              checked={action.value}
              onChange={(e) => onChange(action.key, e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-zinc-900"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900">
                {action.label}
              </p>
              <p className="text-xs text-zinc-600">{action.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
