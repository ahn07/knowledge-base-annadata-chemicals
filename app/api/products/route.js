import { NextResponse } from "next/server";
import { normalizeProduct, readProducts, writeProducts } from "../../../lib/productsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const products = await readProducts();
  return NextResponse.json({ products });
}

export async function POST(request) {
  const body = await request.json();
  const { product, error } = normalizeProduct(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const products = await readProducts();
  const now = new Date().toISOString();
  const newProduct = {
    id: crypto.randomUUID(),
    ...product,
    createdAt: now,
    updatedAt: now,
  };

  products.unshift(newProduct);
  await writeProducts(products);

  return NextResponse.json({ product: newProduct }, { status: 201 });
}

export async function PUT(request) {
  const body = await request.json();
  const id = body.id;

  if (!id) {
    return NextResponse.json({ error: "Product id is required." }, { status: 400 });
  }

  const { product, error } = normalizeProduct(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const products = await readProducts();
  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const updatedProduct = {
    ...products[index],
    ...product,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  await writeProducts(products);

  return NextResponse.json({ product: updatedProduct });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");

  if (!id) {
    try {
      const body = await request.json();
      id = body.id;
    } catch {
      id = "";
    }
  }

  if (!id) {
    return NextResponse.json({ error: "Product id is required." }, { status: 400 });
  }

  const products = await readProducts();
  const remainingProducts = products.filter((item) => item.id !== id);

  if (remainingProducts.length === products.length) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await writeProducts(remainingProducts);

  return NextResponse.json({ success: true });
}
