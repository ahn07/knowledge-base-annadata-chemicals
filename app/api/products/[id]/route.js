import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const runtime = "nodejs";

function normalizeProduct(input) {
  const name = String(input.name ?? input.productName ?? "").trim();
  const category = String(input.category ?? "General").trim();
  const unit = String(input.unit ?? "unit").trim();
  const costPrice = Number(input.costPrice ?? input.price ?? NaN);
  const sellingPrice = Number(input.sellingPrice ?? input.price ?? NaN);
  const stock = Number.isFinite(Number(input.stock)) ? Number(input.stock) : 0;

  if (!name) {
    return { error: "Product name is required." };
  }

  if (!category) {
    return { error: "Product category is required." };
  }

  if (!unit) {
    return { error: "Product unit is required." };
  }

  if (!Number.isFinite(costPrice) || costPrice < 0) {
    return { error: "Cost price must be a valid non-negative number." };
  }

  if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
    return { error: "Selling price must be a valid non-negative number." };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "Stock must be a valid non-negative integer." };
  }

  return {
    product: {
      name,
      category,
      unit,
      costPrice,
      sellingPrice,
      stock,
    },
  };
}

export async function PUT(request, context) {
  const { id } = await context.params;
  const body = await request.json();
  const { product, error } = normalizeProduct(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: product,
  });

  return NextResponse.json({ product: updatedProduct });
}

export async function DELETE(_request, context) {
  const { id } = await context.params;
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (!existingProduct) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
