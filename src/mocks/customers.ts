import type { MockCustomer } from "./types";

export const mockCustomers: MockCustomer[] = [
  {
    id: "cus-1",
    name: "Abdul Malek",
    phone: "+8801711001001",
    email: "malek@example.com",
    notes: "Mirpur area customer",
    status: "active",
    deviceIds: ["dev-1", "dev-2", "dev-13"],
  },
  {
    id: "cus-2",
    name: "Sadia Afrin",
    phone: "+8801711001002",
    status: "active",
    deviceIds: ["dev-3", "dev-10", "dev-14"],
  },
  {
    id: "cus-3",
    name: "Mahbub Alam",
    phone: "+8801811002003",
    email: "mahbub@example.com",
    notes: "Repeat unlock request",
    status: "active",
    deviceIds: ["dev-4", "dev-9"],
  },
  {
    id: "cus-4",
    name: "Jannatul Ferdous",
    phone: "+8801911003004",
    status: "active",
    deviceIds: ["dev-5", "dev-11"],
  },
  {
    id: "cus-5",
    name: "Kamrul Islam",
    phone: "+8801611004005",
    email: "kamrul@example.com",
    status: "inactive",
    deviceIds: ["dev-6", "dev-12"],
  },
  {
    id: "cus-6",
    name: "Nasrin Sultana",
    phone: "+8801511005006",
    status: "active",
    deviceIds: ["dev-7", "dev-8", "dev-15"],
  },
];
