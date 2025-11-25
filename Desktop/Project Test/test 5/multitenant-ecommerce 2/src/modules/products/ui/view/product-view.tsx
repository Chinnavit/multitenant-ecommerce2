"use client";

// TODO: Add real ratings

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { CheckIcon, LinkIcon, StarIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/star-rating";
import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { Product } from "@/payload-types";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled className="flex-1 bg-pink-400">
        Add to cart
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

  // (แก้ไข) --- เริ่มส่วน Logic Custom Size (หน่วย in, 4-40) ---
  
  // กำหนดขนาดเริ่มต้น (เช่น 8x10 นิ้ว)
  const [width, setWidth] = useState<number>(8);
  const [height, setHeight] = useState<number>(10);
  
  // State เก็บราคาสุดท้ายที่คำนวณแล้ว
  const [calculatedPrice, setCalculatedPrice] = useState<number>(data.price);

  // คำนวณราคาใหม่ทุกครั้งที่ขนาดเปลี่ยน
  useEffect(() => {
    // สูตร: ราคาพื้นฐาน + (พื้นที่ตารางนิ้ว * ราคาต่อนิ้ว)
    const area = width * height;
    const pricePerSquareInch = 0.5; // (ตัวอย่าง) ราคา 0.5 ต่อตารางนิ้ว แก้ไขตามต้องการ
    const sizeSurcharge = area * pricePerSquareInch;

    const newPrice = data.price + sizeSurcharge;
    setCalculatedPrice(newPrice);
  }, [width, height, data.price]);

  // Handler สำหรับตรวจสอบค่าเมื่อมีการพิมพ์ (จำกัด Max 40)
  const handleDimensionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: number) => void
  ) => {
    let val = parseFloat(e.target.value);
    
    // ถ้าเกิน 40 ให้ปัดลงมาเหลือ 40 ทันที
    if (val > 40) val = 40;
    
    if (!isNaN(val)) {
      setter(val);
    } else {
        // กรณีลบจนว่าง ให้ใส่ 0 ไปก่อนหรือปล่อยว่าง (ในที่นี้ให้ setter ทำงานเผื่อ user ลบตัวเลข)
       setter(0); 
    }
  };

  // Handler เมื่อพิมพ์เสร็จแล้วเอาเมาส์ออก (Blur) เพื่อกันค่าที่ต่ำกว่า 4
  const handleBlur = (
    val: number,
    setter: (val: number) => void
  ) => {
    if (val < 4) {
        setter(4); // ถ้าต่ำกว่า 4 ให้ดีดกลับเป็น 4
    }
  };
  // (แก้ไข) --- จบส่วน Logic ---

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* --- LEFT: รูปภาพ --- */}
        <div className="relative border-b lg:border-b-0 lg:border-r aspect-square lg:aspect-auto">
          <Image
            src={data.image?.url || "/placeholder.png"}
            alt={data.name}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* --- RIGHT: เนื้อหา --- */}
        <div className="flex flex-col h-full">
          {/* Header Group */}
          <div className="p-6 pb-0 flex flex-col gap-4">
            <h1 className="text-4xl font-medium">{data.name}</h1>

            {/* Price & Action Row */}
            <div className="flex items-start justify-between w-full gap-4">
              {/* Price */}
              <div className="flex items-center h-10">
                <p className="text-3xl font-bold text-black">
                  {formatCurrency(calculatedPrice)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <CartButton
                    isPurchased={data.isPurchased}
                    productId={productId}
                    tenantSlug={tenantSlug}
                    // TODO: ส่งค่า width, height, unit='in' ไปที่ CartButton
                  />
                  <Button
                    className="size-10"
                    variant="elevated"
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("URL copied to clipboard");
                      setTimeout(() => setIsCopied(false), 1000);
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      <LinkIcon className="size-4" />
                    )}
                  </Button>
                </div>

                <p className="text-sm font-medium text-muted-foreground text-right">
                  {data.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${data.refundPolicy} money back guarantee`}
                </p>
              </div>
            </div>

            {/* Store Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
              <Link
                href={generateTenantURL(tenantSlug)}
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                {data.tenant.image?.url && (
                  <Image
                    src={data.tenant.image.url}
                    alt={data.tenant.name}
                    width={24}
                    height={24}
                    className="rounded-full border shrink-0 size-6"
                  />
                )}
                <span className="underline font-medium text-black">
                  {data.tenant.name}
                </span>
              </Link>
              <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <StarRating rating={data.reviewRating} iconClassName="size-4" />
                <span className="font-medium text-black">
                  {data.reviewCount} ratings
                </span>
              </div>
            </div>

            {/* --- (แก้ไข) ส่วน Custom Size Inputs (4-40 in) --- */}
            <div className="pt-4">
              <label className="text-sm font-medium text-gray-900 mb-2 block">
                Custom Size (4" - 40"):
              </label>
              <div className="flex gap-4 items-end">
                {/* Width Input */}
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground mb-1 block">Width (in)</span>
                  <input
                    type="number"
                    value={width === 0 ? '' : width} // ยอมให้ว่างตอนลบ
                    onChange={(e) => handleDimensionChange(e, setWidth)}
                    onBlur={() => handleBlur(width, setWidth)}
                    min={4}
                    max={40}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                
                <div className="pb-2 text-muted-foreground font-medium">x</div>
                
                {/* Height Input */}
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground mb-1 block">Height (in)</span>
                  <input
                    type="number"
                    value={height === 0 ? '' : height}
                    onChange={(e) => handleDimensionChange(e, setHeight)}
                    onBlur={() => handleBlur(height, setHeight)}
                    min={4}
                    max={40}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              </div>
            </div>
            {/* --- (จบส่วนที่แก้ไข) --- */}

          </div>

          <div className="mx-6 mt-6 border-b"></div>

          <div className="p-6 pt-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            {data.description ? (
              <RichText data={data.description} />
            ) : (
              <p className="font-medium text-muted-foreground italic">
                No description provided
              </p>
            )}
          </div>

          <div className="mx-6 border-b"></div>

          <div className="m-6 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            <div className="flex items-center gap-x-2 font-medium mb-4">
              <StarIcon className="size-5 fill-black text-black" />
              <p className="text-xl">{data.reviewRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">
                Based on {data.reviewCount} reviews
              </p>
            </div>

            <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
              {[5, 4, 3, 2, 1].map((stars) => (
                <Fragment key={stars}>
                  <div className="font-medium text-sm w-12">{stars} star</div>
                  <Progress
                    value={data.ratingDistribution[stars]}
                    className="h-2"
                  />
                  <div className="font-medium text-sm w-10 text-right">
                    {data.ratingDistribution[stars]}%
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[500px] lg:h-full border-b lg:border-b-0 lg:border-r">
          <Image
            src={"/placeholder.png"}
            alt="Placeholder"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="h-96 bg-gray-50/50"></div>
      </div>
    </div>
  );
};