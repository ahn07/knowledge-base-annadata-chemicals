import { NextResponse } from "next/server";
import { normalizeProduct, readProducts, writeProducts } from "../../../../lib/productsStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();
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

export async function DELETE(_request, context) {
  const { id } = await context.params;
  const products = await readProducts();
  const remainingProducts = products.filter((item) => item.id !== id);

  if (remainingProducts.length === products.length) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await writeProducts(remainingProducts);

  return NextResponse.json({ success: true });
}
