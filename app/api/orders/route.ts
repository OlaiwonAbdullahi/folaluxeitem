import { prisma } from "@/lib/prisma";
import { created, fail, handleError } from "@/lib/apiResponse";
import { serializeOrder } from "@/lib/serialize";
import { buildOrderFromItems, generateOrderNumber } from "@/lib/order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) ?? {};
    const { customerInfo, shippingAddress, items, notes } = body;

    if (!customerInfo?.email || !customerInfo?.firstName) {
      return fail(400, "Customer name and email are required");
    }
    if (!shippingAddress?.street || !shippingAddress?.state) {
      return fail(400, "A delivery address is required");
    }

    const built = await buildOrderFromItems(items);
    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName ?? "",
          email: String(customerInfo.email).toLowerCase(),
          phoneNumber: customerInfo.phoneNumber ?? "",
        },
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city ?? "",
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode ?? "",
        },
        items: built.items,
        totalPrice: built.total,
        shippingFee: built.shippingFee,
        paymentMethod: "questpay",
        notes: notes ?? null,
      },
    });

    return created(serializeOrder(order), "Order created");
  } catch (error) {
    return handleError(error);
  }
}
