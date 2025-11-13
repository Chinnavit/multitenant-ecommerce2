import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Frames: CollectionConfig = {
  slug: "frames", // ชื่อเรียกในฐานข้อมูล
  admin: {
    useAsTitle: "name",
    description: "จัดการลายกรอบรูปและราคาต่อนิ้ว (Moulding Inventory)",
  },
  access: {
    read: () => true, // ใครๆ ก็ขอดูลายกรอบได้
    create: ({ req }) => isSuperAdmin(req.user), // แอดมินเท่านั้นที่สร้างได้
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "ชื่อลายกรอบ (เช่น ไม้สักทอง, ดำด้าน)",
      required: true,
    },
    {
      name: "sku",
      type: "text",
      label: "รหัสสินค้า (SKU)",
    },
    {
      name: "image", // รูปตัวอย่างลายกรอบ
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "pricePerInch", // หัวใจสำคัญ! ราคาต่อนิ้ว
      type: "number",
      label: "ราคาต่อนิ้ว (บาท)",
      required: true,
      min: 0,
    },
    {
      name: "widthInches", // ความกว้างของขอบไม้ (มีผลต่อการคำนวณขนาดรวม)
      type: "number",
      label: "ความกว้างของหน้าไม้ (นิ้ว)",
      required: true,
    },
    {
      name: "material",
      type: "select",
      options: [
        { label: "ไม้แท้ (Wood)", value: "wood" },
        { label: "โลหะ (Metal)", value: "metal" },
        { label: "พลาสติก (Plastic)", value: "plastic" },
      ],
    },
  ],
};