import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useCartStore, CartItem } from "../store/use-card-store"; // Import CartItem

export const useCart = (tenantSlug: string) => {
    const addProduct = useCartStore((state) => state.addProduct);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const clearCart = useCartStore((state) => state.clearCart);
    const clearAllCarts = useCartStore((state) => state.clearAllCarts);

    // ✅ ดึง items ออกมา
    const items = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.items || []));
    
    // Helper: สร้าง list ของ ID เพื่อเช็คสถานะ (เช่น ปุ่ม Add/Remove)
    const productIds = items.map(item => item.productId);

    // ✅ รับ options เพิ่ม
    const toggleProduct = useCallback(( productId:string, options?: Partial<CartItem> ) => {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId);
        } else {
            addProduct(tenantSlug, productId, options); // ส่ง options ไปด้วย
        }
    }, [addProduct, removeProduct, productIds, tenantSlug]);

    const isProductInCart = useCallback(( productId: string) => {
        return productIds.includes(productId);
    }, [productIds]);

    const clearTenantCart = useCallback(() => {
        clearCart(tenantSlug);
    }, [tenantSlug, clearCart]);

    const handleAddProduct = useCallback(( productId: string, options?: Partial<CartItem>) => { // Update signature
        addProduct(tenantSlug, productId, options);
    }, [addProduct, tenantSlug]);

    const handleRemoveProduct = useCallback(( productId: string) => {
        removeProduct(tenantSlug, productId);
    }, [removeProduct, tenantSlug]);

    return {
        items, // ส่ง items กลับไปเผื่อใช้
        productIds,
        addProduct: handleAddProduct,
        removeProduct: handleRemoveProduct,
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        isProductInCart,
        totalItems: items.length,
    };
};