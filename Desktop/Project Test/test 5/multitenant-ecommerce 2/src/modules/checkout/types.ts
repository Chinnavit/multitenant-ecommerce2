import type Stripe from "stripe";
import { Product } from "@/payload-types"; // 👈 (เพิ่ม import นี้)

export type ProductMetadata = {
  stripeAccountId: string;
  id: string;
  name: string;
  price: number;
};

export type CheckoutMetadata = {
  userId: string;
};

export type ExpandLineItem = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: ProductMetadata;
    };
  };
};

//
// vvvvv ( เพิ่มโค้ดส่วนนี้เข้าไปครับ ) vvvvv
//

// (นี่คือ Type สำหรับ 'size' 1 แถว จาก Products Collection)
export type ProductSize = NonNullable<Product["sizes"]>[0];

// (นี่คือ Type สำหรับ "ของในตะกร้า" ที่มีข้อมูลครบถ้วน)
export interface CartItem {
  id: string; // ID ที่ไม่ซ้ำกัน เช่น "productId_sizeId"
  product: Product;
  selectedSize: ProductSize; // 👈 (เก็บ Object ของ Size ที่เลือก)
  finalPrice: number;
}

//
// ^^^^^ ( จบส่วนที่เพิ่ม ) ^^^^^
//
