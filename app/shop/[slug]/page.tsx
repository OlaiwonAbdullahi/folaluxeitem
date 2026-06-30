"use client";

import { useParams } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = "force-dynamic";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.slug as string;
  
  return <ProductDetailClient id={id} />;
}
