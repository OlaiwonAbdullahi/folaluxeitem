import type { Product, Order, User } from "@prisma/client";

// Prisma returns `id` (string) + Date objects. The frontend `lib/api.ts` types
// expect `_id` and ISO date strings, so map at the API boundary.

export function serializeProduct(p: Product) {
  return {
    _id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice ?? undefined,
    category: p.category,
    stock: p.stock,
    images: p.images,
    colors: p.colors,
    sizes: p.sizes,
    isFeatured: p.isFeatured,
    isNewArrival: p.isNewArrival,
    isBestseller: p.isBestseller,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export function serializeOrder(o: Order) {
  return {
    _id: o.id,
    orderNumber: o.orderNumber,
    customerInfo: o.customerInfo,
    shippingAddress: o.shippingAddress,
    items: o.items,
    totalPrice: o.totalPrice,
    shippingFee: o.shippingFee,
    orderStatus: o.orderStatus,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    paymentReference: o.paymentReference ?? undefined,
    trackingNumber: o.trackingNumber ?? undefined,
    notes: o.notes ?? undefined,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

export function serializeUser(u: User) {
  return {
    _id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phoneNumber: u.phoneNumber,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  };
}
