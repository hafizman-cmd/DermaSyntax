import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import type { Product } from "@/types/product";

function loadProducts(): Product[] {
  const filePath = join(process.cwd(), "src", "data", "products.json");
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Product[];
}

export async function GET() {
  const products = loadProducts();
  return NextResponse.json(products);
}
