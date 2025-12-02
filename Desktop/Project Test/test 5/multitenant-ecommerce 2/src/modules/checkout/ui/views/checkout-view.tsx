"use client";

import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { InboxIcon, LoaderIcon  } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { generateTenantURL, formatCurrency } from "@/lib/utils";

import { useCart } from "../../hooks/use-cart";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { useCheckoutStates } from "../../hooks/use-checkout-states";

interface CheckoutViewProps {
    tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
    const router = useRouter();
    const [states, setStates] = useCheckoutStates();
    // เปลี่ยนจาก productIds เป็น items เพื่อเอาข้อมูลขนาด/ราคา มาใช้
    const { items, removeProduct, clearCart } = useCart(tenantSlug); 

    // ดึง ID ทั้งหมดเพื่อไป fetch ข้อมูลรูปภาพ/ชื่อสินค้า
    const productIds = useMemo(() => items.map((item) => item.productId), [items]);

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    
    const { data, error, isLoading } = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productIds,
    }, {
        enabled: productIds.length > 0 // fetch เมื่อมีของในตะกร้าเท่านั้น
    }));

    const purchase = useMutation(trpc.checkout.purchase.mutationOptions ({
        onMutate: () => {
            setStates({ success: false, cancal: false});
        },
        onSuccess: (data) => {
            window.location.href = data.url;
        },
        onError:(error) => {
            if(error.data?.code === "UNAUTHORIZED"){
                router.push("/sign-in");
            }
            toast.error(error.message);
        },
    }));
    
    // คำนวณราคารวมใหม่ จากของในตะกร้า (ไม่ใช่จาก Database ตรงๆ)
    const totalPrice = useMemo(() => {
        return items.reduce((acc, item) => acc + (item.price || 0), 0);
    }, [items]);

    useEffect(() => {
        if (states.success){
            setStates({ success: false,  cancal: false });
            clearCart();
            queryClient.invalidateQueries(trpc.library.getMany.infiniteQueryFilter())
            router.push("/library");
        }
    }, [states.success, clearCart, router, setStates, queryClient, trpc.library.getMany]);

    if (isLoading) {
        return (
            <div className="lg:pt-16 pt-4 px-4 lg:px-12">
                <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                <LoaderIcon className="text-muted-foreground animate-spin"/>
                </div>
            </div>
        )
    }

    if(items.length === 0) { // เช็คจาก items ในตะกร้าแทน
        return (
            <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
                <InboxIcon />
                <p className="text-base font-medium">No products found</p>
            </div>
        );
    }

    return (
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
                <div className="lg:col-span-4">
                    <div className="border rounded-md overflow-hidden bg-white">
                        {/* ✅ วนลูป items ในตะกร้า แทน data.docs */}
                        {items.map((item, index) => {
                            // หาข้อมูลสินค้า (รูป, ชื่อ) จากที่ fetch มา
                            const productDetails = data?.docs.find(d => d.id === item.productId);
                            
                            if (!productDetails) return null;

                            return (
                                <CheckoutItem
                                    key={`${item.productId}-${index}`} // ใช้ index ช่วยเผื่อสินค้าซ้ำ
                                    isLast={index === items.length - 1}
                                    imageUrl={productDetails.image?.url}
                                    name={`${productDetails.name} (${item.width}" x ${item.height}")`} // แสดงขนาด
                                    productUrl={`${generateTenantURL(productDetails.tenant.slug)}/products/${productDetails.id}`}
                                    tenantUrl={generateTenantURL(productDetails.tenant.slug)}
                                    tenantName={productDetails.tenant.name}
                                    price={item.price || productDetails.price} // ✅ ใช้ราคาที่คำนวณแล้วจากตะกร้า
                                    onRemove={() => removeProduct(item.productId)}
                                />
                            );
                        })}
                    </div>
                </div>
                
                <div className="lg:col-span-3">
                    <CheckoutSidebar
                        total={totalPrice} // ✅ ใช้ราคารวมที่คำนวณใหม่
                        // ส่ง items ทั้งหมด (ที่มีขนาด/สี) ไปให้ backend
                        onPurchase={() => purchase.mutate({ tenantSlug, items })} 
                        isCanceled={states.cancal}
                        disabled={purchase.isPending}
                    />
                </div>
            </div>
        </div>
    );
};