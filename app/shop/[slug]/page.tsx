import { use } from "react";
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found — FolaLuxe",
    };
  }

  return {
    title: `${product.name} — FolaLuxe`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient slug={slug} />;
}

// Generate static params for all products
export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
