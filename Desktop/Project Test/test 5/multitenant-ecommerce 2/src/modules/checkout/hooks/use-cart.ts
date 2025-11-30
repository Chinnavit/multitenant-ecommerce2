import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useCartStore, CartItem } from "../store/use-card-store";

export const useCart = (tenantSlug: string) => {
    const addProduct = useCartStore((state) => state.addProduct);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const clearCart = useCartStore((state) => state.clearCart);
    const clearAllCarts = useCartStore((state) => state.clearAllCarts);

    // ดึง items ออกมาแทน productIds
    const items = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.items || []));

    // แปลง items เป็น list ของ ID เพื่อให้ง่ายต่อการเช็ค isProductInCart แบบเดิม
    const productIds = items.map(item => item.productId);

    // รับ options เพิ่มเข้ามา
    const toggleProduct = useCallback(( productId: string, options?: Partial<CartItem> ) => {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId);
        } else {
            addProduct(tenantSlug, productId, options);
        }
    }, [addProduct, removeProduct, productIds, tenantSlug]);

    const isProductInCart = useCallback(( productId: string) => {
        return productIds.includes(productId);
    }, [productIds]);

    const clearTenantCart = useCallback(() => {
        clearCart(tenantSlug);
    }, [tenantSlug, clearCart]);

    return {
        items, // ส่ง items กลับไปเผื่อใช้แสดงผล
        productIds,
        addProduct: (id: string, opts?: Partial<CartItem>) => addProduct(tenantSlug, id, opts),
        removeProduct: (id: string) => removeProduct(tenantSlug, id),
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        isProductInCart,
        totalItems: items.length,
    };
};