export type ProductCategory = "bags" | "clothing";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string;
  featured: boolean;
  inStock: boolean;
  badge?: string;
};

export const products: Product[] = [
  // ── BAGS ──────────────────────────────────────────────────────────────────
  {
    id: "bag-001",
    slug: "the-luxe-tote",
    name: "The Luxe Tote",
    price: 45000,
    category: "bags",
    images: ["/products/luxe-tote.jpg"],
    sizes: ["One Size"],
    colors: ["Blush Pink", "Cream", "Cognac"],
    description:
      "A statement tote that carries everything — your essentials, your confidence, your whole vibe. Crafted from premium vegan leather with rose gold hardware and a sturdy base. Spacious enough for the gym run and elegant enough for dinner.",
    featured: true,
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: "bag-002",
    slug: "mini-crossbody",
    name: "Mini Crossbody Bag",
    price: 28000,
    originalPrice: 35000,
    category: "bags",
    images: ["/products/mini-crossbody.jpg"],
    sizes: ["One Size"],
    colors: ["Camel", "Black", "Dusty Rose"],
    description:
      "Mini but mighty. The perfect date-night bag — just enough room for your phone, keys and lip gloss. Adjustable gold chain strap that doubles as a clutch when detached.",
    featured: true,
    inStock: true,
    badge: "Sale",
  },
  {
    id: "bag-003",
    slug: "structured-shoulder-bag",
    name: "Structured Shoulder Bag",
    price: 52000,
    category: "bags",
    images: ["/products/shoulder-bag.jpg"],
    sizes: ["One Size"],
    colors: ["Cream White", "Taupe", "Black"],
    description:
      "Clean lines meet quiet luxury. This structured shoulder bag is shaped to command attention without trying too hard. Premium hardware, suede lining, and a magnetic clasp that snaps shut with satisfying precision.",
    featured: false,
    inStock: true,
  },
  {
    id: "bag-004",
    slug: "evening-clutch",
    name: "Evening Clutch",
    price: 18000,
    category: "bags",
    images: ["/products/evening-clutch.jpg"],
    sizes: ["One Size"],
    colors: ["Rose Gold", "Pearl", "Midnight"],
    description:
      "For nights that deserve to be remembered. A satin-finish clutch with a jewelled clasp — the kind your friends will be borrowing before the night is over.",
    featured: true,
    inStock: true,
    badge: "New In",
  },
  {
    id: "bag-005",
    slug: "chain-handle-bag",
    name: "Chain Handle Bag",
    price: 35000,
    category: "bags",
    images: ["/products/chain-bag.jpg"],
    sizes: ["One Size"],
    colors: ["Blush", "Nude", "Bordeaux"],
    description:
      "That bag everyone keeps asking about on your TikTok. Double chain handles, quilted panels, and the kind of structured body that photographs beautifully from every angle.",
    featured: false,
    inStock: true,
  },
  {
    id: "bag-006",
    slug: "weekend-duffle",
    name: "Weekend Duffle",
    price: 62000,
    category: "bags",
    images: ["/products/duffle.jpg"],
    sizes: ["One Size"],
    colors: ["Beige", "Chocolate", "Blush"],
    description:
      "Pack your whole personality into this one. A generous weekend bag with trolley sleeve, internal pockets, and a look that's equally at home in a boutique hotel lobby or on the boarding gate.",
    featured: false,
    inStock: true,
  },

  // ── CLOTHING ──────────────────────────────────────────────────────────────
  {
    id: "cloth-001",
    slug: "satin-slip-dress",
    name: "Satin Slip Dress",
    price: 38000,
    category: "clothing",
    images: ["/products/satin-dress.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Dusty Rose", "Champagne", "Ivory"],
    description:
      "The dress that launched a thousand enquiries. Bias-cut satin that moves with you, hits mid-calf, and looks effortlessly expensive. Wear it to a dinner, a picnic, or honestly just around the house.",
    featured: true,
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: "cloth-002",
    slug: "linen-coord-set",
    name: "Linen Coord Set",
    price: 42000,
    category: "clothing",
    images: ["/products/coord-set.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blush Pink", "Sage", "White"],
    description:
      "Power dressing, softened. A tailored blazer and wide-leg trouser set in breathable linen. The kind of outfit that makes you look like you have it all figured out — even on the days you don't.",
    featured: true,
    inStock: true,
    badge: "New In",
  },
  {
    id: "cloth-003",
    slug: "bodycon-midi-dress",
    name: "Bodycon Midi Dress",
    price: 32000,
    category: "clothing",
    images: ["/products/bodycon-dress.jpg"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Coral Pink", "Deep Rose", "Nude"],
    description:
      "It hugs you in all the right places, full stop. Stretch fabric that keeps it comfortable through dinner and the after-party. A front slit adds that final touch of drama.",
    featured: false,
    inStock: true,
  },
  {
    id: "cloth-004",
    slug: "wrap-blouse",
    name: "Wrap Blouse",
    price: 22000,
    category: "clothing",
    images: ["/products/wrap-blouse.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Dusty Rose", "Ivory", "Terracotta"],
    description:
      "The wrap top that works with everything in your wardrobe. Adjustable tie, flattering V-neckline, and a flowy silhouette that photographe beautifully. Tuck it into your wide-legs or let it flow free.",
    featured: false,
    inStock: true,
  },
  {
    id: "cloth-005",
    slug: "blazer-dress",
    name: "Blazer Dress",
    price: 55000,
    category: "clothing",
    images: ["/products/blazer-dress.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blush Pink", "Charcoal", "Cream"],
    description:
      "One piece, infinite boardroom to bar transitions. A structured blazer cut as a mini dress with peak lapels, gold button detail, and enough tailoring to make any room feel formal.",
    featured: true,
    inStock: true,
    badge: "Fan Fave",
  },
  {
    id: "cloth-006",
    slug: "ruched-top",
    name: "Ruched Top",
    price: 19000,
    originalPrice: 24000,
    category: "clothing",
    images: ["/products/ruched-top.jpg"],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Rose", "Blush", "White"],
    description:
      "A going-out top that earns its keep. Ruched through the centre for a flattering gathered effect, with a slight crop and elasticated hem. Pairs with everything from high-waist jeans to a full skirt.",
    featured: false,
    inStock: true,
    badge: "Sale",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
}
