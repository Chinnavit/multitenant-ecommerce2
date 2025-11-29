import Link from "next/link";

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button";

import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
    tenantSlug: string;
    productId: string;
    isPurchased?: boolean;
    // --- เพิ่ม Props ใหม่ ---
    width?: number;
    height?: number;
    matColor?: string;
    price?: number;
    // ---------------------
};

export const CartButton = ({ 
    tenantSlug, 
    productId, 
    isPurchased,
    // รับค่า props เข้ามา
    width,
    height,
    matColor,
    price
}: Props) => {
    const cart = useCart(tenantSlug);

    if (isPurchased) {
        return (
            <Button
                variant="elevated"
                asChild
                className="flex-1 font-medium bg-white"
            >
                <Link prefetch href={`/library/${productId}`}>
                    View in Library
                </Link>
            </Button>
        );
    }
    
    return(
        <Button
            variant="elevated" 
            className={cn("flex-1 bg-pink-400", cart.isProductInCart(productId) && "bg-white")}
            onClick={() => {
                // ส่งค่า options ไปที่ toggleProduct
                cart.toggleProduct(productId, { width, height, matColor, price });
            }}
        >
            {cart.isProductInCart(productId) 
                ? "Remove from cart"
                : "Add to cart"
        }
        </Button>
    );
};