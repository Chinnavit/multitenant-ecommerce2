// src/modules/checkout/store/use-card-store.ts
import { create } from "zustand";
import { createJSONStorage , persist } from "zustand/middleware"

// ✅ สร้าง Type สำหรับสินค้าในตะกร้า
export interface CartItem {
    productId: string;
    width?: number;
    height?: number;
    matColor?: string;
    protectionType?: string;
    price?: number;
}

interface TenantCard {
    items: CartItem[]; // ✅ เปลี่ยนจาก productIds: string[] เป็น items
};

interface CartState {
    tenantCarts : Record<string, TenantCard>;
    // ✅ อัปเดตฟังก์ชันรับ options
    addProduct: (tenantSlug: string, productId: string, options?: Partial<CartItem>) => void;
    removeProduct: (tenantSlug: string, productId: string) => void;
    clearCart: (tenantSlug: string) => void;
    clearAllCarts: () => void;
};

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            tenantCarts: {},
            addProduct: (tenantSlug, productId, options) =>
                set((state) => {
                    const currentItems = state.tenantCarts[tenantSlug]?.items || [];
                    // เช็คว่ามีสินค้านี้อยู่แล้วหรือไม่ (Logic เดิมคือ toggle ถ้ามีให้ลบ แต่ถ้าจะเก็บ Option อาจต้องปรับ Logic ในอนาคต)
                    // เบื้องต้นถ้ามี ID เดิมอยู่แล้ว จะไม่เพิ่มซ้ำ (หรือจะให้เพิ่มซ้ำได้ถ้า Option ต่างกันก็ได้)
                    const existingItemIndex = currentItems.findIndex(item => item.productId === productId);
                    
                    let newItems = [...currentItems];
                    
                    if (existingItemIndex > -1) {
                        // กรณีมีของอยู่แล้ว อัปเดต Option แทน
                         newItems[existingItemIndex] = { productId, ...options };
                    } else {
                        // กรณีไม่มี เพิ่มใหม่
                         newItems.push({ productId, ...options });
                    }

                    return {
                        tenantCarts:{
                            ...state.tenantCarts,
                            [tenantSlug]: {
                                items: newItems
                            }
                        }
                    }
                }),
            removeProduct: (tenantSlug, productId) =>
                set((state) => ({
                    tenantCarts:{
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            items: state.tenantCarts[tenantSlug]?.items.filter(
                                    (item) => item.productId !== productId
                                ) || [], 
                        }
                    }
                })),
            clearCart: (tenantSlug) =>
                set((state) => ({
                    tenantCarts:{
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
            name:"Centra-Art-cart",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);