import type { Metadata } from "next";
import { CustomerForm } from "@/admin/customers";

export const metadata: Metadata = {
  title: "Create customer",
};

export default function CreateCustomerPage() {
  return <CustomerForm mode="create" />;
}
