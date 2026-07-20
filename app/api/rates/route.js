import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export const runtime = "nodejs";

function normalizeRate(input) {
  const productId = String(input.productId ?? "").trim();
  const price = Number(input.price);
  const date = input.date ? new Date(input.date) : new Date();

  if (!productId) {
    return { error: "Product ID is required." };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be a valid non-negative number." };
  }

  if (Number.isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  return {
    rate: {
      productId,
      price,
      date,
    },
  };
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      category: true,
      unit: true,
      costPrice: true,
      sellingPrice: true,
      stock: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ products });
}

export async function POST(request) {
  const body = await request.json();
  const { rate, error } = normalizeRate(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: rate.productId } });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const updatedProduct = await prisma.product.update({
    where: { id: rate.productId },
    data: {
      sellingPrice: rate.price,
    },
  });

  const historyEntry = await prisma.rateHistory.create({
    data: {
      productId: rate.productId,
      price: rate.price,
      date: rate.date,
    },
  });

  return NextResponse.json({ product: updatedProduct, history: historyEntry }, { status: 201 });
}
