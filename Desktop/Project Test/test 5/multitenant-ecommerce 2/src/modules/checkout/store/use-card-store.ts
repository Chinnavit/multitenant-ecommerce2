import { create } from "zustand";
import { createJSONStorage , persist } from "zustand/middleware"

// ✅ 1. เพิ่ม protectionType ใน Interface CartItem
export interface CartItem {
    productId: string;
    width?: number;
    height?: number;
    matColor?: string;
    price?: number;
    protectionType?: string; // <--- เพิ่มบรรทัดนี้ครับ
}

interface TenantCart {
    items: CartItem[];
};

interface CartState {
    tenantCarts : Record<string, TenantCart>;
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
                    // ตรวจสอบว่าสินค้ามีอยู่แล้วหรือไม่
                    const exists = currentItems.some(item => item.productId === productId);
                    
                    if (exists) return state; 

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