import AdminSalesForm from "../../components/AdminSalesForm";
import prisma from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSalesPage() {
  const initialProducts = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return <AdminSalesForm initialProducts={initialProducts} />;
}
