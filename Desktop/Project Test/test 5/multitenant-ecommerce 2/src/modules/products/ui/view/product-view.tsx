"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { CheckIcon, LinkIcon, StarIcon, Check } from "lucide-react"; 
import { useSuspenseQuery } from "@tanstack/react-query";
import { RichText } from "@payloadcms/richtext-lexical/react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/star-rating";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; 
import { formatCurrency, generateTenantURL, cn } from "@/lib/utils"; 

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

  // 1. ดึงข้อมูลจาก Database
  const matColors = data.matColors || [];
  // ✅ ดึง Protection Options จาก DB (ถ้าไม่มี ให้เป็น array ว่าง)
  const protectionOptions = data.protectionOptions || [];

  const [isCopied, setIsCopied] = useState(false);

  // --- Logic State ---
  const [width, setWidth] = useState<number>(8);
  const [height, setHeight] = useState<number>(10);
  
  // Mat Board State
  const [hasMat, setHasMat] = useState<boolean>(false);
  const [matColor, setMatColor] = useState<string>(
    (matColors.length > 0 && matColors[0]?.id) ? matColors[0].id : ""
  );

  // Protection State
  const [hasProtection, setHasProtection] = useState<boolean>(false); 
  // ✅ ใช้ slug ของตัวเลือกแรก หรือ 'film' เป็นค่าเริ่มต้น (ถ้ามี)
  const [protectionType, setProtectionType] = useState<string>(() => {
    const defaultOption = protectionOptions.find(opt => opt.slug === 'film');
    return defaultOption ? 'film' : (protectionOptions[0]?.slug || "");
  });
   
  const [calculatedPrice, setCalculatedPrice] = useState<number>(data.price);

  useEffect(() => {
    const area = width * height;
    const framePricePerSqIn = 0.5; 
    
    // 1. ราคาพื้นฐาน + ขนาด
    let total = data.price + (area * framePricePerSqIn);

    // 2. บวกราคา Mat Board (ราคาคงที่ 20 บาท)
    if (hasMat) {
      total += 20; 
    }

    // 3. บวกราคา Protection Layer (ดึงราคาจาก DB)
    if (hasProtection && protectionType) {
      const selectedOption = protectionOptions.find(opt => opt.slug === protectionType);
      if (selectedOption) {
        total += selectedOption.price;
      }
    }

    setCalculatedPrice(total);
  }, [width, height, hasMat, hasProtection, protectionType, data.price, protectionOptions]);

  // Handlers ... (เหมือนเดิม)
  const handleDimensionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: number) => void
  ) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setter(0);
      return;
    }
    let val = parseFloat(inputValue);
    if (val > 40) val = 40; 
    if (!isNaN(val)) setter(val);
  };

  const handleBlur = (val: number, setter: (val: number) => void) => {
    if (val < 4) setter(4);
  };

  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border rounded-sm bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* --- LEFT: Image --- */}
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

        {/* --- RIGHT: Content --- */}
        <div className="flex flex-col h-full">
          <div className="p-6 pb-0 flex flex-col gap-4">
            <h1 className="text-4xl font-medium">{data.name}</h1>

            {/* Price & Actions */}
            <div className="flex items-start justify-between w-full gap-4">
              <div className="flex items-center h-10">
                <p className="text-3xl font-bold text-black">
                  {formatCurrency(calculatedPrice)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <CartButton
                    isPurchased={data.isPurchased}
                    productId={productId}
                    tenantSlug={tenantSlug}
                    width={width}
                    height={height}
                    matColor={hasMat ? matColor : undefined}
                    protectionType={hasProtection ? protectionType : undefined}
                    price={calculatedPrice}
                  />
                  <Button
                    className="size-10"
                    variant="elevated"
                    onClick={() => {
                      setIsCopied(true);
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("URL copied");
                      setTimeout(() => setIsCopied(false), 1000);
                    }}
                    disabled={isCopied}
                  >
                    {isCopied ? <CheckIcon className="size-4" /> : <LinkIcon className="size-4" />}
                  </Button>
                </div>
                <p className="text-sm font-medium text-muted-foreground text-right">
                  {data.refundPolicy === "no-refunds" ? "No refunds" : `${data.refundPolicy} guarantee`}
                </p>
              </div>
            </div>

            {/* Store & Ratings */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
              <Link href={generateTenantURL(tenantSlug)} className="flex items-center gap-2 hover:opacity-80 transition">
                {data.tenant.image?.url && (
                  <Image src={data.tenant.image.url} alt={data.tenant.name} width={24} height={24} className="rounded-full border size-6" />
                )}
                <span className="underline font-medium text-black">{data.tenant.name}</span>
              </Link>
              <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <StarRating rating={data.reviewRating} iconClassName="size-4" />
                <span className="font-medium text-black">{data.reviewCount} ratings</span>
              </div>
            </div>

            {/* --- Customization Section --- */}
            <div className="pt-6 space-y-6">
               
              {/* 1. Size Selection (คงเดิม) */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Custom Size (4&quot; - 40&quot;):
                </label>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label htmlFor="width-input" className="text-xs text-muted-foreground mb-1 block">Width (in)</label>
                    <input
                      id="width-input"
                      placeholder="8"
                      type="number"
                      value={width === 0 ? '' : width}
                      onChange={(e) => handleDimensionChange(e, setWidth)}
                      onBlur={() => handleBlur(width, setWidth)}
                      min={4} max={40}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="pb-2 text-muted-foreground font-medium">x</div>
                  <div className="flex-1">
                    <label htmlFor="height-input" className="text-xs text-muted-foreground mb-1 block">Height (in)</label>
                    <input
                      id="height-input"
                      placeholder="10"
                      type="number"
                      value={height === 0 ? '' : height}
                      onChange={(e) => handleDimensionChange(e, setHeight)}
                      onBlur={() => handleBlur(height, setHeight)}
                      min={4} max={40}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Mat Selection (คงเดิม) */}
              <div className="flex flex-col gap-4 border p-4 rounded-md bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mat-switch" className="text-base font-medium text-black">
                      Add Mat Board
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Adds a decorative border.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                      {hasMat && (
                          <span className="text-sm font-medium text-green-600">
                              + {formatCurrency(20)}
                          </span>
                      )}
                      <Switch
                          id="mat-switch"
                          checked={hasMat}
                          onCheckedChange={setHasMat}
                      />
                  </div>
                </div>

                {hasMat && matColors.length > 0 && (
                  <div className="pt-2 border-t mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <span className="text-xs text-muted-foreground mb-3 block font-medium uppercase tracking-wider">
                        Select Mat Color
                      </span>
                      <div className="flex gap-3 flex-wrap">
                        {matColors.map((color: any) => (
                          <button
                            key={color.id}
                            onClick={() => setMatColor(color.id)}
                            className={cn(
                              "group relative size-10 rounded-full border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all",
                              "border-gray-200",
                              matColor === color.id ? "ring-2 ring-offset-2 ring-black border-transparent scale-110" : "hover:scale-105"
                            )}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {matColor === color.id && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <Check className={cn(
                                  "size-5",
                                  ["black", "navy", "forest", "gray"].some(n => color.name.toLowerCase().includes(n)) ? "text-white" : "text-black"
                                )} />
                              </span>
                            )}
                            <span className="sr-only">{color.name}</span>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Selected: <span className="font-medium text-black">
                          {matColors.find((c: any) => c.id === matColor)?.name}
                        </span>
                      </p>
                  </div>
                )}
              </div>

              {/* 3. Protection Layer (Dynamic from DB) */}
              <div className="flex flex-col gap-4 border p-4 rounded-md bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="protection-switch" className="text-base font-medium text-black">
                      Add Protection Layer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Glass or Film coating options.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasProtection && protectionType && (
                       // แสดงราคาของตัวที่เลือกอยู่
                       (() => {
                         const selected = protectionOptions.find((opt:any) => opt.slug === protectionType);
                         if(selected && selected.price > 0) {
                           return (
                             <span className="text-sm font-medium text-green-600">
                               + {formatCurrency(selected.price)}
                             </span>
                           );
                         }
                         return null;
                       })()
                    )}
                    <Switch
                      id="protection-switch"
                      checked={hasProtection}
                      onCheckedChange={setHasProtection}
                    />
                  </div>
                </div>

                {hasProtection && protectionOptions.length > 0 && (
                  <div className="pt-2 border-t mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-xs text-muted-foreground mb-3 block font-medium uppercase tracking-wider">
                        Select Type
                    </span>
                    <RadioGroup 
                      value={protectionType} 
                      onValueChange={setProtectionType}
                      className="flex flex-col gap-3"
                    >
                      {/* ✅ Loop สร้างตัวเลือกจาก Database */}
                      {protectionOptions.map((option: any) => (
                        <div key={option.id}>
                          <RadioGroupItem value={option.slug} id={`type-${option.slug}`} className="peer sr-only" />
                          <Label
                            htmlFor={`type-${option.slug}`}
                            className="flex items-center justify-between rounded-md border-2 border-muted bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-black peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-black cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">{option.name}</span>
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                              </div>
                            </div>
                            {option.price > 0 && (
                                <span className="text-sm text-green-600 font-medium">
                                    + {formatCurrency(option.price)}
                                </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>

            </div>
            {/* --- End Customization --- */}

          </div>

          {/* ... (ส่วน Description และ Reviews เหมือนเดิม) ... */}
          <div className="mx-6 mt-6 border-b"></div>
          <div className="p-6 pt-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            {data.description ? <RichText data={data.description} /> : <p className="text-muted-foreground italic">No description provided</p>}
          </div>
          <div className="mx-6 border-b"></div>
          <div className="m-6 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            <div className="flex items-center gap-x-2 font-medium mb-4">
              <StarIcon className="size-5 fill-black text-black" />
              <p className="text-xl">{data.reviewRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Based on {data.reviewCount} reviews</p>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-center">
              {[5, 4, 3, 2, 1].map((stars) => (
                <Fragment key={stars}>
                  <div className="font-medium text-sm w-12">{stars} star</div>
                  <Progress value={data.ratingDistribution[stars]} className="h-2" />
                  <div className="font-medium text-sm w-10 text-right">{data.ratingDistribution[stars]}%</div>
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
          <Image src={"/placeholder.png"} alt="Placeholder" fill className="object-cover object-top" />
        </div>
        <div className="h-96 bg-gray-50/50"></div>
      </div>
    </div>
  );
};