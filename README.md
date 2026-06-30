This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# FolaLuxe — backend, payments & images

The storefront and admin dashboard are powered by a self-contained backend built with **Next.js Route Handlers + Prisma + MongoDB**, with **QuestPay** for checkout and **ImageKit** for product image hosting. There is no separate API server — everything lives under `app/api/**`.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** — copy `.env.example` to `.env.local` and fill it in. `DATABASE_URL` must **also** be present in `.env` (the Prisma CLI reads `.env`). Make sure the Mongo URI includes an explicit database name in the path (e.g. `/folaluxe`).

3. **Create the database schema** (MongoDB uses push, not migrations):
   ```bash
   npm run db:generate   # generate the Prisma client
   npm run db:push       # sync schema to MongoDB
   ```
   > Requires a network that can resolve the Atlas SRV record (`mongodb+srv://`). Some restricted networks/DNS resolvers block SRV lookups — run this on a normal connection, or use a non-SRV `mongodb://` URI.

4. **Seed the admin user** (no products are seeded — the catalogue starts empty):
   ```bash
   npm run db:seed
   ```
   This creates an admin from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. Log in at `/admin/login`, then add products via the dashboard (images upload to ImageKit automatically).

## QuestPay integration

- **Checkout flow:** `/checkout` creates an order (`POST /api/orders`), initializes a hosted checkout (`POST /api/orders/:id/initialize-payment`), and redirects the customer to QuestPay. On return, `/checkout/callback` confirms status.
- **Webhook (source of truth):** point **QuestPay Settings → Webhook URL** at:
  ```
  https://YOUR_DOMAIN/api/webhooks/questpay
  ```
  The handler reads the raw body, verifies the `x-questpay-signature` HMAC-SHA256 (timing-safe) against `QUESTPAY_API_KEY`, then marks the order **paid** on `payment.received` (idempotently) or **cancelled** on `checkout.failed`. Duplicate deliveries are safe; stock is decremented exactly once.

### Test the webhook locally

```bash
# Send a signed payment.received for an existing order id
ORDER_ID=<a real order _id>
REF="FL-$ORDER_ID-$(date +%s)"
BODY=$(printf '{"event":"payment.received","data":{"reference":"%s","status":"success","metadata":{"orderId":"%s"}}}' "$REF" "$ORDER_ID")
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$QUESTPAY_API_KEY" | sed 's/^.* //')

curl -i -X POST http://localhost:3000/api/webhooks/questpay \
  -H "Content-Type: application/json" \
  -H "x-questpay-event: payment.received" \
  -H "x-questpay-signature: $SIG" \
  --data "$BODY"
# → 200 OK, order flips to paid/processing. A tampered signature → 400.
```

## ImageKit

Product images are uploaded server-side from the admin product form (the private key never reaches the browser) and served from `ik.imagekit.io` (whitelisted in `next.config.ts`). Set `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
