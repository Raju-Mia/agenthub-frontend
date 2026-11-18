import type { Metadata } from "next";
import { CustomersList } from "@/admin/customers";
import { mockCustomers, mockDevices } from "@/mocks";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return (
    <CustomersList customers={mockCustomers} devices={mockDevices} />
  );
}
