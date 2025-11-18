import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// (เพิ่ม) กำหนดหน้าตาของ "สินค้าในตะกร้า"
// เราต้องเก็บ size และ price แยกต่างหากสำหรับแต่ละชิ้น
export interface CartItem {
  id: string; // Unique ID เช่น "product123-large"
  productId: string;
  name: string;
  price: number; // ราคาสุดท้ายที่บวกเพิ่มแล้ว
  imageUrl?: string | null;
  size: string; // ชื่อขนาด เช่น "Small", "Large"
  quantity: number; // เผื่ออนาคตอยากทำระบบจำนวน
}

interface TenantCart {
  items: CartItem[]; // (แก้ไข) เปลี่ยนจาก productIds เป็น items
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  
  // (แก้ไข) รับ item ทั้งก้อนแทนที่จะรับแค่ ID
  addItem: (tenantSlug: string, item: CartItem) => void;
  
  // (แก้ไข) ลบโดยใช้ ID ของ CartItem
  removeItem: (tenantSlug: string, itemId: string) => void;
  
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      tenantCarts: {},

      // ฟังก์ชันเพิ่มสินค้า
      addItem: (tenantSlug, item) =>
        set((state) => {
          const currentItems = state.tenantCarts[tenantSlug]?.items || [];
          
          // เช็คว่ามีสินค้านี้ (id เดียวกัน = สินค้าเดียวกัน + ขนาดเดียวกัน) อยู่แล้วไหม
          const existingItemIndex = currentItems.findIndex((i) => i.id === item.id);

          let newItems;

          if (existingItemIndex > -1) {
            // ถ้ามีแล้ว ให้ update (เช่น เพิ่มจำนวน หรืออัปเดตราคา)
            newItems = [...currentItems];
            // ตอนนี้เราแค่แทนที่ของเดิมไปก่อน (หรือจะทำ logic เพิ่มจำนวนก็ได้ในอนาคต)
            newItems[existingItemIndex] = item; 
          } else {
            // ถ้ายังไม่มี ให้เพิ่มเข้าไปใหม่
            newItems = [...currentItems, item];
          }

          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                items: newItems,
              },
            },
          };
        }),

      // ฟังก์ชันลบสินค้า
      removeItem: (tenantSlug, itemId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              items:
                state.tenantCarts[tenantSlug]?.items.filter(
                  (item) => item.id !== itemId
                ) || [],
            },
          },
        })),

      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              items: [],
            },
          },
        })),

      clearAllCarts: () =>
        set({
          tenantCarts: {},
        }),
    }),
    {
      name: "Centra-Art-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);