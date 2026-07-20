import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export const runtime = "nodejs";

function validateSale(input) {
  const productId = String(input.productId ?? "").trim();
  const quantity = Number(input.quantity);
  const sellingPrice = Number(input.sellingPrice);
  const customer = String(input.customer ?? "").trim();
  const date = input.date ? new Date(input.date) : new Date();

  if (!productId) {
    return { error: "Product ID is required." };
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { error: "Quantity must be a positive integer." };
  }

  if (!Number.isFinite(sellingPrice) || sellingPrice < 0) {
    return { error: "Selling price must be a valid non-negative number." };
  }

  if (!customer) {
    return { error: "Customer is required." };
  }

  if (Number.isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  return {
    sale: {
      productId,
      quantity,
      sellingPrice,
      customer,
      totalRevenue: quantity * sellingPrice,
      date,
    },
  };
}

export async function GET() {
  const sales = await prisma.sale.findMany({
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ sales });
}

export async function POST(request) {
  const body = await request.json();
  const { sale, error } = validateSale(body);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: sale.productId } });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  if (product.stock < sale.quantity) {
    return NextResponse.json({ error: "Insufficient stock for this sale." }, { status: 400 });
  }

  const profit = sale.totalRevenue - product.costPrice * sale.quantity;

  const createdSale = await prisma.sale.create({
    data: {
      productId: sale.productId,
      quantity: sale.quantity,
      sellingPrice: sale.sellingPrice,
      customer: sale.customer,
      totalRevenue: sale.totalRevenue,
      profit,
      date: sale.date,
    },
  });

  await prisma.product.update({
    where: { id: product.id },
    data: {
      stock: product.stock - sale.quantity,
    },
  });

  return NextResponse.json({ sale: createdSale }, { status: 201 });
}
