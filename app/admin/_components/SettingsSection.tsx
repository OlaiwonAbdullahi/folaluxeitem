"use client";

const STORE_FIELDS = [
  { id: "store-name",     label: "Store Name",     defaultValue: "FolaLuxe",           type: "text" },
  { id: "store-email",    label: "Contact Email",   defaultValue: "contact@folaluxe.com", type: "email" },
  { id: "store-whatsapp", label: "WhatsApp Number", defaultValue: "+234 800 000 0000",  type: "text" },
  { id: "store-currency", label: "Currency",        defaultValue: "NGN (₦)",            type: "text" },
] as const;

const NOTIFICATION_TOGGLES = [
  { id: "notif-new-order", label: "New order placed",    defaultChecked: true },
  { id: "notif-payment",   label: "Payment confirmed",   defaultChecked: true },
  { id: "notif-shipped",   label: "Order shipped",       defaultChecked: false },
];

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 placeholder:text-zinc-400";

export default function SettingsSection() {
  return (
    <div className="animate-fade-in max-w-2xl space-y-5">

      {/* Store settings */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-zinc-800" style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}>
          Store Settings
        </h2>

        {STORE_FIELDS.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={`settings-${field.id}`}
              className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-widest mb-1.5"
            >
              {field.label}
            </label>
            <input
              id={`settings-${field.id}`}
              type={field.type}
              defaultValue={field.defaultValue}
              className={inputCls}
            />
          </div>
        ))}

        <div className="pt-1">
          <button
            id="settings-save-btn"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-700 active:scale-95 transition-all duration-150"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Notification toggles */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5">
        <h2 className="text-sm font-semibold text-zinc-800 mb-4" style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}>
          Order Notifications
        </h2>
        <div className="space-y-0 divide-y divide-zinc-50">
          {NOTIFICATION_TOGGLES.map((toggle) => (
            <div key={toggle.id} className="flex items-center justify-between py-3">
              <label htmlFor={toggle.id} className="text-sm text-zinc-600 cursor-pointer">
                {toggle.label}
              </label>
              <input
                id={toggle.id}
                type="checkbox"
                defaultChecked={toggle.defaultChecked}
                className="w-4 h-4 cursor-pointer rounded accent-zinc-800"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5">
        <h2 className="text-sm font-semibold text-red-600 mb-1" style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}>
          Danger Zone
        </h2>
        <p className="text-xs text-zinc-400 mb-4">These actions are permanent and cannot be undone.</p>
        <button
          id="settings-clear-orders-btn"
          className="px-5 py-2 rounded-xl text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
        >
          Clear all mock orders
        </button>
      </div>
    </div>
  );
}
