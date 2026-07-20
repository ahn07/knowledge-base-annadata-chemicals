import AdminProductsManager from "../../components/AdminProductsManager";
import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const initialProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <AdminProductsManager initialProducts={initialProducts} />;
}
