"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";
import { Product } from "@/payload-types";

interface Props {
  tenantSlug: string;
  product: Product; // (แก้ไข) รับข้อมูลสินค้าทั้งก้อน
  selectedOption: { name: string; priceModifier: number }; // (เพิ่ม) รับขนาดที่เลือก
  finalPrice: number; // (เพิ่ม) รับราคาสุดท้าย
  isPurchased?: boolean;
  productId?: string; // (Optional)
}

export const CartButton = ({ 
  tenantSlug, 
  product, 
  selectedOption, 
  finalPrice, 
  isPurchased 
}: Props) => {
  const cart = useCart(tenantSlug);

  // สร้าง ID เฉพาะสำหรับ "สินค้า + ขนาด" นี้ เพื่อเช็คสถานะ
  const itemId = `${product.id}-${selectedOption.name}`;
  const isAdded = cart.isItemInCart(itemId);

  if (isPurchased) {
    return (
      <Button
        variant="elevated"
        asChild
        className="flex-1 font-medium bg-white"
      >
        <Link prefetch href={`/library/${product.id}`}>
          View in Library
        </Link>
      </Button>
    );
  }

  const handleClick = () => {
    if (isAdded) {
      cart.removeItem(itemId);
    } else {
      // ส่งข้อมูลครบชุดไปที่ Hook
      cart.addItem(product, selectedOption, finalPrice);
    }
  };

  return (
    <Button
      variant="elevated"
      className={cn(
        "flex-1 bg-pink-400",
        isAdded && "bg-white" // เปลี่ยนสีถ้าอยู่ในตะกร้าแล้ว
      )}
      onClick={handleClick}
    >
      {isAdded ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};