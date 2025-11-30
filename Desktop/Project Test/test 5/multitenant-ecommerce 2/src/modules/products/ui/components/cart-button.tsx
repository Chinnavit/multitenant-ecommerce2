import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
    tenantSlug: string;
    productId: string;
    isPurchased?: boolean;
    // ✅ เพิ่ม Props เหล่านี้เข้าไปครับ
    width?: number;
    height?: number;
    matColor?: string;
    protectionType?: string; 
};

export const CartButton = ({ 
    tenantSlug, 
    productId, 
    isPurchased,
    // ✅ รับค่าเข้ามา
    width,
    height,
    matColor,
    protectionType
}: Props) => {
    const cart = useCart(tenantSlug);

    if (isPurchased) {
        return (
            <Button variant="elevated" asChild className="flex-1 font-medium bg-white">
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
                // ✅ ส่งข้อมูล Options ไปบันทึกในตะกร้า (ต้องแก้ useCart ให้รับค่าด้วย)
                cart.toggleProduct(productId, { width, height, matColor, protectionType }); 
            }}
        >
            {cart.isProductInCart(productId) 
                ? "Remove from cart"
                : "Add to cart"
            }
        </Button>
    );
};