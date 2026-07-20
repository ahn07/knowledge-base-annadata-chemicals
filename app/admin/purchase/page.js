import AdminPurchaseForm from "../../components/AdminPurchaseForm";
import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPurchasePage() {
  const initialProducts = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return <AdminPurchaseForm initialProducts={initialProducts} />;
}
