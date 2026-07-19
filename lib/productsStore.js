import { promises as fs } from "fs";
import os from "os";
import path from "path";

const localDataDirectory = path.join(process.cwd(), "data");
const tempDataDirectory = path.join(os.tmpdir(), "annadata-chemicals-data");
const dataDirectory = process.env.NODE_ENV === "production" ? tempDataDirectory : localDataDirectory;
const productsFile = path.join(dataDirectory, "products.json");

async function ensureProductsFile() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(productsFile);
  } catch {
    await fs.writeFile(productsFile, "[]", "utf8");
  }
}

export async function readProducts() {
  await ensureProductsFile();
  const file = await fs.readFile(productsFile, "utf8");

  let products = [];

  try {
    products = JSON.parse(file || "[]");
  } catch {
    products = [];
  }

  return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function writeProducts(products) {
  await ensureProductsFile();
  await fs.writeFile(productsFile, JSON.stringify(products, null, 2), "utf8");
}

export function normalizeProduct(input) {
  const productName = String(input.productName ?? "").trim();
  const supplierName = String(input.supplierName ?? "").trim();
  const price = Number(input.price);
  const date = input.date ? String(input.date) : "";

  if (!productName) {
    return { error: "Product name is required." };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be a valid positive number." };
  }

  if (!supplierName) {
    return { error: "Supplier name is required." };
  }

  return {
    product: {
      productName,
      price,
      supplierName,
      date,
    },
  };
}
