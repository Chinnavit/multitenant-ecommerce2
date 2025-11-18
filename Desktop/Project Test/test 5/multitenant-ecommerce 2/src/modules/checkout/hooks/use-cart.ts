import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useCartStore, CartItem } from "../store/use-card-store";
import { Product } from "@/payload-types";

export const useCart = (tenantSlug: string) => {
  const storeAddItem = useCartStore((state) => state.addItem);
  const storeRemoveItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  // ดึงรายการสินค้าทั้งหมดในตะกร้าของร้านนี้
  const items = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.items || []));

  // ฟังก์ชันเช็คว่า สินค้า+ขนาด นี้ มีในตะกร้าหรือยัง
  const isItemInCart = useCallback((itemId: string) => {
    return items.some((item) => item.id === itemId);
  }, [items]);

  // ฟังก์ชันเพิ่มสินค้า (รับข้อมูลครบชุด: สินค้า, ตัวเลือก, ราคา)
  const addItem = useCallback((
    product: Product, 
    option: { name: string, priceModifier: number }, 
    finalPrice: number
  ) => {
    // สร้าง ID เฉพาะ: รหัสสินค้า + ชื่อขนาด (เช่น "p123-Large")
    const itemId = `${product.id}-${option.name}`;

    // ดึง URL รูปภาพแบบปลอดภัย
    const imageUrl = typeof product.image === 'object' && product.image?.url 
      ? product.image.url 
      : "/placeholder.png";

    const newItem: CartItem = {
      id: itemId,
      productId: product.id,
      name: product.name,
      price: finalPrice, // ใช้ราคาที่คำนวณมาแล้ว
      imageUrl: imageUrl,
      size: option.name, // เก็บชื่อขนาด
      quantity: 1,
    };

    storeAddItem(tenantSlug, newItem);
    // ตรงนี้คุณอาจจะเพิ่ม toast.success("Added to cart") ได้ถ้าต้องการ
  }, [tenantSlug, storeAddItem]);

  // ฟังก์ชันลบสินค้า
  const removeItem = useCallback((itemId: string) => {
    storeRemoveItem(tenantSlug, itemId);
  }, [tenantSlug, storeRemoveItem]);

  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [tenantSlug, clearCart]);

  return {
    items,          // รายการสินค้า (CartItem[])
    addItem,        // ฟังก์ชันเพิ่ม
    removeItem,     // ฟังก์ชันลบ
    clearCart: clearTenantCart,
    clearAllCarts,
    isItemInCart,   // ฟังก์ชันเช็คสถานะ
    totalItems: items.length, // จำนวนรายการ
  };
};