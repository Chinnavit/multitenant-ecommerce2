"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { 
  CheckIcon, 
  UploadIcon, 
  Image as ImageIcon, 
  FileTextIcon, 
  BoxIcon, 
  ScissorsIcon,
  TruckIcon,
  SmileIcon,
  AwardIcon,
  ShareIcon
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Dynamic import สำหรับ CartButton เพื่อเลี่ยงปัญหา Hydration
const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="w-full py-6 text-lg bg-[#EDE667] text-black hover:bg-[#EDE667]/90">
        Add to Cart
      </Button>
    ),
  }
);

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL copied to clipboard");
    setTimeout(() => setIsCopied(false), 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] bg-white w-full overflow-hidden">
      
      {/* LEFT: Preview Area (ยืดเต็มพื้นที่ที่เหลือ) */}
      <div className="flex-1 bg-[#F8F8F8] flex items-center justify-center relative overflow-hidden p-4 sm:p-8">
        {/* กรอบรูปจำลองแบบไม้ */}
        <div className="relative w-full max-w-[550px] max-h-[90%] aspect-[3/4] shadow-2xl bg-[#DBCBB6] p-4 sm:p-6 rounded-md transition-transform duration-300 hover:scale-[1.01]">
            {/* Mat Board (ขอบขาวด้านใน) */}
            <div className="relative w-full h-full border-[1px] border-neutral-200 bg-white p-6 sm:p-10 flex items-center justify-center rounded-sm">
                 <div className="relative w-full h-full shadow-inner rounded-sm overflow-hidden">
                    <Image
                        src={data.image?.url || "/placeholder.png"}
                        alt={data.name}
                        fill
                        className="object-cover"
                    />
                 </div>
            </div>
            
            {/* Frame Border (กรอบไม้) - เปลี่ยนสีและเพิ่มเงาให้ดูเป็น 3 มิติ */}
            <div className="absolute inset-0 border-[20px] border-[#DBCBB6] pointer-events-none rounded-md
                          shadow-[inset_0_0_10px_rgba(0,0,0,0.1),_0_4px_8px_rgba(0,0,0,0.1)]" /> 
            
            {/* เลเยอร์เงาจำลองที่ขอบด้านในของกรอบไม้ */}
            <div className="absolute inset-[20px] border-[1px] border-black/10 pointer-events-none rounded-md" />
        </div>
      </div>

      {/* RIGHT: Sidebar (Scrollable, Fixed Width 480px) */}
      <div className="w-full lg:w-[480px] bg-white border-l border-neutral-200 flex flex-col h-full z-10 shadow-xl">
        
        {/* Header */}
        <div className="p-8 border-b border-neutral-100 text-center relative shrink-0">
            <button 
                onClick={handleCopyLink}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-black transition-all"
            >
                {isCopied ? <CheckIcon className="size-5"/> : <ShareIcon className="size-5" />}
            </button>

            <h1 className="text-4xl font-serif font-medium mb-2 tracking-tight text-neutral-900">{data.name}</h1>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
                {data.category ? (typeof data.category === 'string' ? data.category : data.category.name) : "STYLE FRAME"}
            </p>
            <p className="text-2xl font-medium mt-6 text-neutral-900">{formatCurrency(data.price)}</p>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8">
                {/* ส่วนการเลือกกรอบรูปจะเพิ่มเข้ามาในอนาคต */}
                {/* <p className="font-medium mb-4 text-neutral-900">Select Frame Style</p>
                <div className="mb-8 p-4 border rounded-md bg-neutral-50 flex justify-between items-center">
                    <span className="font-medium">Current Frame: Wooden Style</span>
                    <Button variant="outline">Change</Button>
                </div> */}

                <p className="font-medium mb-4 text-neutral-900">What Do You Want To Frame?</p>
                <Accordion type="single" collapsible defaultValue="digital" className="w-full">
                    <AccordionItem value="digital" className="border-b border-neutral-100">
                        <AccordionTrigger className="hover:no-underline py-5 text-neutral-700 hover:text-black transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 border border-neutral-200 rounded-full"><UploadIcon className="size-4"/></div>
                                <span className="text-base">Digital Photos</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-neutral-500 pl-14 pb-4">
                            Upload your photo and we&apos;ll print and frame it for you.
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="physical" className="border-b border-neutral-100">
                        <AccordionTrigger className="hover:no-underline py-5 text-neutral-700 hover:text-black transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 border border-neutral-200 rounded-full"><ImageIcon className="size-4"/></div>
                                <span className="text-base">Physical Photo or Art</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-neutral-500 pl-14 pb-4">
                        Send us your art and we&apos;ll frame it with care.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="document" className="border-b border-neutral-100">
                        <AccordionTrigger className="hover:no-underline py-5 text-neutral-700 hover:text-black transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 border border-neutral-200 rounded-full"><FileTextIcon className="size-4"/></div>
                                <span className="text-base">Documents or Paper</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-neutral-500 pl-14 pb-4">
                            Diplomas, certificates, and posters.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="object" className="border-b border-neutral-100">
                        <AccordionTrigger className="hover:no-underline py-5 text-neutral-700 hover:text-black transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 border border-neutral-200 rounded-full"><BoxIcon className="size-4"/></div>
                                <span className="text-base">Objects with Depth</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-neutral-500 pl-14 pb-4">
                            Jerseys, medals, and memorabilia (Shadowbox).
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="textile" className="border-b-0">
                        <AccordionTrigger className="hover:no-underline py-5 text-neutral-700 hover:text-black transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 border border-neutral-200 rounded-full"><ScissorsIcon className="size-4"/></div>
                                <span className="text-base">Textiles</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-neutral-500 pl-14 pb-4">
                            Canvas, embroidery, and fabric art.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Value Props */}
            <div className="p-6 bg-[#F9F9F9] border-t border-neutral-200">
                <div className="flex justify-between text-center px-2">
                    <div className="flex flex-col items-center gap-2 max-w-[80px]">
                        <TruckIcon className="size-6 text-neutral-700"/>
                        <span className="text-[10px] font-medium text-neutral-600 leading-tight">FREE shipping on orders $100+</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 max-w-[80px]">
                        <SmileIcon className="size-6 text-neutral-700"/>
                        <span className="text-[10px] font-medium text-neutral-600 leading-tight">Happiness Guaranteed</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 max-w-[80px]">
                        <AwardIcon className="size-6 text-neutral-700"/>
                        <span className="text-[10px] font-medium text-neutral-600 leading-tight">Highest Quality Materials</span>
                    </div>
                </div>
            </div>

            {/* What's Included */}
            <div className="p-8 border-t border-neutral-200">
                <h3 className="font-serif text-xl font-medium text-center mb-6">What&apos;s Included</h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="size-16 bg-neutral-200 rounded-sm overflow-hidden relative">
                            <Image src="/custom-frame.png" alt="Frame" fill className="object-cover opacity-80"/>
                        </div>
                        <p className="text-xs text-neutral-600 max-w-[120px]">Custom frame built & designed for you</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="size-16 bg-neutral-200 rounded-sm overflow-hidden relative">
                            {/* Placeholder for mat */}
                            <div className="absolute inset-2 bg-blue-100 border-4 border-white shadow-sm"></div>
                        </div>
                        <p className="text-xs text-neutral-600 max-w-[120px]">Acid-free mat (if you want one!)</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="size-16 bg-neutral-200 rounded-sm overflow-hidden relative">
                            {/* Placeholder glazing */}
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"></div>
                        </div>
                        <p className="text-xs text-neutral-600 max-w-[120px]">Acrylic glazing with UV protection</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="size-16 bg-neutral-200 rounded-sm overflow-hidden relative">
                            {/* Placeholder Hardware */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-neutral-400"></div>
                        </div>
                        <p className="text-xs text-neutral-600 max-w-[120px]">Hanging hardware appropriate for your frame size</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Action Area (Fixed at bottom of sidebar) */}
        <div className="p-6 bg-white border-t border-neutral-100 shrink-0">
            <div className="[&>button]:w-full [&>button]:h-14 [&>button]:text-lg [&>button]:font-semibold [&>button]:bg-[#EBE578] [&>button]:text-black [&>button]:rounded-md [&>button]:border-none [&>button:hover]:bg-[#E0DA65] [&>button]:transition-colors [&>button]:uppercase [&>button]:tracking-wide">
                 <CartButton
                    isPurchased={data.isPurchased}
                    productId={productId}
                    tenantSlug={tenantSlug}
                  />
            </div>
        </div>

      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] bg-white animate-pulse overflow-hidden w-full">
        <div className="flex-1 bg-[#F8F8F8] h-full"></div>
        <div className="w-full lg:w-[480px] border-l h-full bg-white"></div>
    </div>
  );
};