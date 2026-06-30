import crypto from "crypto";
import { HttpError } from "./apiResponse";

const BASE_URL =
  process.env.QUESTPAY_BASE_URL || "https://payments-server.questlabs.cc/api";

function getApiKey(): string {
  const key = process.env.QUESTPAY_API_KEY;
  if (!key) throw new HttpError(500, "QUESTPAY_API_KEY is not configured");
  return key;
}

export interface InitializeCheckoutInput {
  reference: string;
  email: string;
  amount: number;
  description?: string;
  metadata?: Record<string, unknown>;
  return_url?: string;
}

export interface QuestpayCheckout {
  checkout_url: string;
  reference: string;
  [key: string]: unknown;
}

// POST /v1/checkout/initialize — creates a hosted checkout session.
export async function initializeCheckout(
  input: InitializeCheckoutInput,
): Promise<QuestpayCheckout> {
  const res = await fetch(`${BASE_URL}/v1/checkout/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.data?.checkout_url) {
    const message =
      json?.message || `Questpay initialize failed (${res.status})`;
    throw new HttpError(502, message);
  }
  return json.data as QuestpayCheckout;
}

// GET /v1/checkout/verify/:reference — server-side confirmation of a session.
export async function verifyCheckout(
  reference: string,
): Promise<Record<string, unknown> | null> {
  const res = await fetch(
    `${BASE_URL}/v1/checkout/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${getApiKey()}` },
    },
  );
  const json = await res.json().catch(() => null);
  if (!res.ok) return null;
  return (json?.data as Record<string, unknown>) ?? null;
}

// Pull the gross amount the customer actually paid out of a webhook/verify
// payload. QuestPay reports gross under payment.amountPaid or fees.grossAmount;
// data.amount is the net (post-fee) figure, so it is only a last resort.
export function extractGrossAmount(
  data: Record<string, unknown> | null | undefined,
): number | null {
  if (!data) return null;
  const payment = data.payment as Record<string, unknown> | undefined;
  const fees = data.fees as Record<string, unknown> | undefined;
  const candidates = [payment?.amountPaid, fees?.grossAmount, data.amount];
  for (const c of candidates) {
    const n = typeof c === "string" ? Number(c) : c;
    if (typeof n === "number" && Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

// Verify the HMAC-SHA256 webhook signature against the raw request body using a
// timing-safe comparison. The secret is the Questpay API key.
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  if (!signature) return false;
  const calculated = crypto
    .createHmac("sha256", getApiKey())
    .update(rawBody)
    .digest("hex");
  const expected = Buffer.from(calculated, "utf8");
  const received = Buffer.from(signature, "utf8");
  if (expected.length !== received.length) return false;
  return crypto.timingSafeEqual(expected, received);
}
