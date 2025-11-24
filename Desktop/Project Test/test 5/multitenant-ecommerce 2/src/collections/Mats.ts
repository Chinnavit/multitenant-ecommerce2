import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Mats: CollectionConfig = {
  slug: "mats", // ชื่อเรียกในฐานข้อมูล
  admin: {
    useAsTitle: "name",
    description: "จัดการสีกระดาษขอบ (Mat Boards)",
  },
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "ชื่อสี (เช่น ขาวออฟไวท์, ดำด้าน)",
      required: true,
    },
    {
      name: "colorCode", 
      type: "text",
      label: "รหัสสี Hex (เช่น #FFFFFF สำหรับสีขาว, #000000 สำหรับสีดำ)",
      required: true,
      // ตัวนี้สำคัญ! เราจะเอาไปใช้ระบายสีในหน้าเว็บให้ลูกค้าเห็นภาพจริง
    },
    {
      name: "price", 
      type: "number",
      label: "ราคาบวกเพิ่ม (บาท) - ใส่ 0 ถ้าฟรี",
      defaultValue: 0,
    },
    {
      name: "texture", 
      type: "upload",
      relationTo: "media",
      label: "รูป Texture กระดาษ (ถ้ามี)",
    }
  ],
};