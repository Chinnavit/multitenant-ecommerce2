import { create } from "zustand";
import { createJSONStorage , persist } from "zustand/middleware"

// สร้าง Interface สำหรับสินค้าในตะกร้า
export interface CartItem {
    productId: string;
    width?: number;
    height?: number;
    matColor?: string;
    price?: number;
}

interface TenantCart {
    items: CartItem[]; // เปลี่ยนจาก productIds: string[] เป็น items: CartItem[]
};

interface CartState {
    tenantCarts : Record<string, TenantCart>;
    // อัปเดต Type ของ Function ให้รับ options ได้
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
                    // ตรวจสอบว่ามีสินค้านี้อยู่แล้วหรือไม่ (ถ้ามีให้อัปเดต หรือไม่ทำอะไร)
                    const exists = currentItems.some(item => item.productId === productId);
                    
                    if (exists) return state; // หรือจะให้ update options ก็ได้ตาม logic ที่ต้องการ

                    return {
                        tenantCarts:{
                            ...state.tenantCarts,
                            [tenantSlug]: {
                                items: [
                                    ...currentItems,
                                    { productId, ...options }, 
                                ]
                            }
                        }
                    };
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