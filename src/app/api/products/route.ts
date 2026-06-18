import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import type { Product } from "@/types/product";
import { sanitizeProductData } from "@/lib/data-adapter";

function loadProducts(): Product[] {
  const filePath = join(process.cwd(), "src", "data", "products.json");
  const raw = readFileSync(filePath, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((item) => sanitizeProductData(item));
}

export async function GET() {
  const products = loadProducts();
  return NextResponse.json(products);
}
