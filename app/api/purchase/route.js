import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export const runtime = "nodejs";

function validatePurchase(input) {
  const productId = String(input.productId ?? "").trim();
  const quantity = Number(input.quantity);
  const cost = Number(input.cost);
  const supplier = String(input.supplier ?? "").trim();
  const transportCost = Number(input.transportCost ?? 0);
  const date = input.date ? new Date(input.date) : new Date();

  if (!productId) {
    return { error: "Product ID is required." };
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { error: "Quantity must be a positive integer." };
  }

  if (!Number.isFinite(cost) || cost < 0) {
    return { error: "Cost must be a valid non-negative number." };
  }

  if (!supplier) {
    return { error: "Supplier is required." };
  }

  if (!Number.isFinite(transportCost) || transportCost < 0) {
    return { error: "Transport cost must be a valid non-negative number." };
  }

  if (Number.isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  return {
    purchase: {
      productId,
      quantity,
      cost,
      supplier,
      transportCost,
      totalCost: cost + transportCost,
      date,
    },
  };
}

export async function GET() {
  const purchases = await prisma.purchase.findMany({
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ purchases });
}

export async function POST(request) {
  const body = await request.json();
  const { purchase, error } = validatePurchase(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: purchase.productId } });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const createdPurchase = await prisma.purchase.create({
    data: {
      productId: purchase.productId,
      quantity: purchase.quantity,
      cost: purchase.cost,
      supplier: purchase.supplier,
      transportCost: purchase.transportCost,
      totalCost: purchase.totalCost,
      date: purchase.date,
    },
  });

  await prisma.product.update({
    where: { id: product.id },
    data: {
      stock: product.stock + purchase.quantity,
    },
  });

  return NextResponse.json({ purchase: createdPurchase }, { status: 201 });
}
