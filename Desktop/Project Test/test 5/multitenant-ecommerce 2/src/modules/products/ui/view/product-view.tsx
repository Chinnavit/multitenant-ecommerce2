"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Fragment,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import {
  CheckIcon,
  LinkIcon,
  StarIcon,
  Check,
  UploadCloud,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Cropper, { Area } from "react-easy-crop";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/star-rating";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

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

// --- CONSTANTS: ตัวเลือกสีกรอบ (เติมส่วนนี้ลงไปครับ) ---
const FRAME_OPTIONS = [
  { id: 'black', name: 'Modern Black', hex: '#1a1a1a' },
  { id: 'white', name: 'Classic White', hex: '#f0f0f0' },
  { id: 'wood', name: 'Natural Wood', hex: '#8B5A2B' },
  { id: 'gold', name: 'Luxury Gold', hex: '#D4AF37' },
  { id: 'silver', name: 'Sleek Silver', hex: '#C0C0C0' },
];

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}

export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );

  const matColors = data.matColors || [];
  const protectionOptions = data.protectionOptions || [];

  const [isCopied, setIsCopied] = useState(false);

  const defaultWidth = data.width || 8;
  const defaultHeight = data.height || 10;

  // -------------------------------------------------------
  // ✅ NEW LOGIC: ตรวจจับชื่อสินค้าเพื่อตั้งค่าสีเริ่มต้น
  // -------------------------------------------------------
  const initialFrameColor = (() => {
    const name = data.name.toLowerCase();
    if (name.includes('wood')) return '#8B5A2B';
    if (name.includes('gold')) return '#D4AF37';
    if (name.includes('white')) return '#f0f0f0';
    if (name.includes('silver')) return '#C0C0C0';
    return '#1a1a1a'; // Default เป็นสีดำ
  })();
  // ✅ STATE: เก็บค่าสีของกรอบ (ใช้ค่าเริ่มต้นจาก Logic ข้างบน)
  const [frameColor, setFrameColor] = useState<string>(initialFrameColor);
  
  // --- Logic State ---
  const [width, setWidth] = useState<number>(defaultWidth);
  const [height, setHeight] = useState<number>(defaultHeight);

  const [hasMat, setHasMat] = useState<boolean>(false);
  const [matColor, setMatColor] = useState<string>(
    matColors.length > 0 && matColors[0]?.id ? matColors[0].id : ""
  );

  const [hasProtection, setHasProtection] = useState<boolean>(false);
  const [protectionType, setProtectionType] = useState<string>(() => {
    const defaultOption = protectionOptions.find((opt) => opt.slug === "film");
    return defaultOption ? "film" : protectionOptions[0]?.slug || "";
  });

  const [calculatedPrice, setCalculatedPrice] = useState<number>(data.price);

  // --- Upload & Crop Logic ---
  const [userImage, setUserImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
        toast.error("Please upload a JPG or PNG image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempImage(e.target?.result as string);
        setIsCropping(true);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
    // หมายเหตุ: เราไม่ reset value ตรงนี้ เพราะต้องรอ Crop หรือ Cancel ก่อน
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // ✅ เพิ่มฟังก์ชันนี้: สำหรับกดปุ่ม Cancel ในหน้า Crop
  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImage(null);
    // สำคัญ: ล้างค่า input file เพื่อให้เลือกไฟล์เดิมหรือไฟล์ใหม่ได้อีกรอบ
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async () => {
    if (!tempImage || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
      setUserImage(croppedImage);
      setIsCropping(false);
      setTempImage(null);

      // ล้างค่า input file หลัง crop เสร็จ เผื่ออยาก upload ใหม่
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Image cropped and applied!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  const handleRemoveImage = () => {
    setUserImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("Photo removed. Showing original product image.");
  };

  // ... (useEffect และ Handlers อื่นๆ เหมือนเดิม)
  useEffect(() => {
    // ✅ คำนวณพื้นที่ปัจจุบัน และ พื้นที่มาตรฐาน
    const currentArea = width * height;
    const defaultArea = defaultWidth * defaultHeight;

    const framePricePerSqIn = 0.5; // ราคาต่อตารางนิ้ว (ปรับได้ตามต้องการ)

    // ✅ สูตร: ราคาฐาน + (ส่วนต่างพื้นที่ * ราคาต่อหน่วย)
    // ตัวอย่าง: ถ้าเลือกขนาดเท่าเดิม (currentArea == defaultArea) -> ส่วนต่างเป็น 0 -> ราคาจะเท่ากับ data.price
    // ถ้าขนาดใหญ่ขึ้น -> บวกเพิ่มตามจริง
    // ถ้าขนาดเล็กลง -> ราคาก็จะลดลงจากราคาฐาน
    let total = data.price + (currentArea - defaultArea) * framePricePerSqIn;

    // บวกราคา Option อื่นๆ (Mat)
    if (hasMat) {
      total += 20;
    }

    // บวกราคา Option (Protection)
    if (hasProtection && protectionType) {
      const selectedOption = protectionOptions.find(
        (opt) => opt.slug === protectionType
      );
      if (selectedOption) {
        total += selectedOption.price;
      }
    }

    // ป้องกันราคาติดลบ (กรณี User ใส่ขนาดเล็กมากๆ)
    if (total < 0) total = 0;

    setCalculatedPrice(total);
  }, [
    width,
    height,
    hasMat,
    hasProtection,
    protectionType,
    data.price,
    protectionOptions,
    defaultWidth, // อย่าลืมเพิ่ม dependencies นี้
    defaultHeight, // อย่าลืมเพิ่ม dependencies นี้
  ]);

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
      {/* --- Crop Modal (Dialog) --- */}
      <Dialog
        open={isCropping}
        onOpenChange={(open) => {
          if (!open) {
            // กรณีปิดด้วยการคลิกข้างนอก หรือกด ESC ก็ให้เรียกฟังก์ชัน Cancel เหมือนกัน
            handleCropCancel();
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Your Image</DialogTitle>
            <DialogDescription>
              Drag to reposition and use the slider to zoom. The aspect ratio is
              locked to your frame size ({width}" x {height}").
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-[400px] bg-black/5 rounded-md overflow-hidden mt-4">
            {tempImage && (
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={width / height}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="py-4 flex items-center gap-4">
            <span className="text-sm font-medium min-w-[3rem]">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(vals) => setZoom(vals[0] ?? 1)}
              className="flex-1"
            />
          </div>

          <DialogFooter>
            {/* ✅ แก้ไข: เรียกใช้ handleCropCancel แทนการ set state ตรงๆ */}
            <Button variant="outline" onClick={handleCropCancel}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm}>Apply Crop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="border rounded-sm bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* --- LEFT: Image Section --- */}
        <div className="relative border-b lg:border-b-0 lg:border-r bg-gray-100 flex flex-col justify-center items-center p-8 min-h-[600px]">
          
          <div 
            className="relative transition-all duration-300 ease-in-out"
            style={{
               width: '100%', 
               maxWidth: '450px',
               // ถ้ามีรูป User ให้ใช้สัดส่วนตามที่กำหนด (Width/Height)
               // ถ้าไม่มีรูป ให้ใช้ 'auto' หรือสัดส่วนตามรูปสินค้าเดิม
               aspectRatio: userImage ? `${width} / ${height}` : 'auto' 
            }}
          >
            
            {/* CASE 1: ยังไม่อัปโหลดรูป (แสดงรูปสินค้าต้นฉบับที่เป็น JPG) */}
            {!userImage && (
                <div className="relative w-full aspect-[3/4] bg-white shadow-xl overflow-hidden rounded-sm">
                     <Image
                        src={data.image?.url || "/placeholder.png"} 
                        alt={data.name}
                        fill
                        className="object-contain"
                        priority
                      />
                </div>
            )}

            {/* CASE 2: อัปโหลดรูปแล้ว (สร้างกรอบด้วย CSS Border) */}
            {userImage && (
                <div 
                    className="relative w-full h-full shadow-2xl flex items-center justify-center transition-all duration-300"
                    style={{
                        // ✅ ใช้ frameColor ที่ User เลือก หรือที่ Logic คำนวณมาให้
                        border: `24px solid ${frameColor}`, 
                        borderRadius: '2px',         
                        backgroundColor: '#fff',     
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)', 
                    }}
                >
                    {/* ส่วนของ Mat (ขอบกระดาษ) */}
                    <div 
                        className="relative w-full h-full flex items-center justify-center overflow-hidden transition-all duration-300"
                        style={{
                            // 2. สี Mat: ถ้าเลือก Mat ให้ใช้สีที่เลือก, ถ้าไม่เลือกให้เป็นสีเดียวกับรูป User (ใส)
                            backgroundColor: hasMat 
                                ? (matColors.find((c: any) => c.id === matColor)?.hex || "#FFFFFF")
                                : "#FFFFFF", 
                            
                            // 3. ความหนา Mat: ถ้ามี Mat ให้ดันเข้ามา 30px
                            padding: hasMat ? '30px' : '0px',
                            
                            // เงาด้านในกรอบ (เพื่อให้ดูมีความลึกระหว่างกรอบไม้กับ Mat)
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
                        }}
                    >
                        
                         {/* Wrapper รูป User */}
                         <div className="relative w-full h-full bg-white shadow-sm">
                             <Image
                               src={userImage} 
                               alt="User Work"
                               fill
                               className="object-cover"
                             />
                             
                             {/* เงาด้านใน Mat (Bevel Cut Effect) */}
                             {hasMat && (
                                <div className="absolute inset-0 pointer-events-none shadow-[inset_1px_1px_4px_rgba(0,0,0,0.2)] z-10"></div>
                             )}
                         </div>

                    </div>
                </div>
            )}

          </div>

          {/* --- ปุ่ม Upload / Remove (คงเดิม) --- */}
          <div className="mt-8 flex gap-2 z-30">
             <input
              id="image-upload-input"
              title="Upload your photo"
              type="file"
              accept="image/jpeg, image/png"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            {!userImage ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="shadow-sm bg-white/80 backdrop-blur-sm hover:bg-white"
              >
                <UploadCloud className="size-4 mr-2" />
                Upload Your Photo
              </Button>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="shadow-sm"
              >
                <XCircle className="size-4 mr-2" />
                Remove Photo
              </Button>
            )}
          </div>
        </div>

        {/* --- RIGHT: Content --- */}
        <div className="flex flex-col h-full">
          {/* ... (ส่วนเนื้อหาด้านขวา เหมือนเดิมทุกประการ) ... */}
          <div className="p-6 pb-0 flex flex-col gap-4">
            <h1 className="text-4xl font-medium">{data.name}</h1>

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
                    : `${data.refundPolicy} guarantee`}
                </p>
              </div>
            </div>

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
                    className="rounded-full border size-6"
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

            <div className="pt-6 space-y-6">
              {/* 1. Size Selection */}
              <div>
                <label className="text-sm font-medium text-gray-900 mb-2 block">
                  Custom Size (4&quot; - 40&quot;):
                </label>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label
                      htmlFor="width-input"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Width (in)
                    </label>
                    <input
                      id="width-input"
                      placeholder="8"
                      type="number"
                      value={width === 0 ? "" : width}
                      onChange={(e) => handleDimensionChange(e, setWidth)}
                      onBlur={() => handleBlur(width, setWidth)}
                      min={4}
                      max={40}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                  <div className="pb-2 text-muted-foreground font-medium">
                    x
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="height-input"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      Height (in)
                    </label>
                    <input
                      id="height-input"
                      placeholder="10"
                      type="number"
                      value={height === 0 ? "" : height}
                      onChange={(e) => handleDimensionChange(e, setHeight)}
                      onBlur={() => handleBlur(height, setHeight)}
                      min={4}
                      max={40}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
              
              {/* --- NEW: Frame Color Selection (วางไว้ก่อน Mat Selection) --- */}
              <div className="flex flex-col gap-4 border p-4 rounded-md bg-gray-50/50 mb-6">
                 {/* ส่วนหัวข้อ (Header) */}
                 <div className="space-y-0.5">
                    <Label className="text-base font-medium text-black">
                      Frame Color
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Choose a finish for your custom frame.
                    </p>
                 </div>
                 
                 {/* ส่วนตัวเลือก (Options) - เพิ่มเส้นแบ่ง (border-t) ตรงนี้เพื่อให้เหมือน Mat Board */}
                 <div className="pt-2 border-t mt-2">
                    <span className="text-xs text-muted-foreground mb-3 block font-medium uppercase tracking-wider">
                      Select Frame
                    </span>
                    
                    <div className="flex gap-3 flex-wrap">
                        {FRAME_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setFrameColor(option.hex)}
                            className={cn(
                              "group relative size-10 rounded-full border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all",
                              "border-gray-200", 
                              frameColor === option.hex
                                ? "ring-2 ring-offset-2 ring-black border-transparent scale-110"
                                : "hover:scale-105"
                            )}
                            style={{ backgroundColor: option.hex }}
                            title={option.name}
                          >
                            {frameColor === option.hex && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <Check 
                                  className={cn(
                                    "size-5", 
                                    ['white', 'silver', 'gold'].includes(option.id) ? "text-black" : "text-white"
                                  )} 
                                />
                              </span>
                            )}
                            <span className="sr-only">{option.name}</span>
                          </button>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground mt-2">
                        Selected: <span className="font-medium text-black">
                          {FRAME_OPTIONS.find(o => o.hex === frameColor)?.name || "Custom"}
                        </span>
                    </p>
                 </div>
              </div>

              {/* 2. Mat Selection */}
              <div className="flex flex-col gap-4 border p-4 rounded-md bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="mat-switch"
                      className="text-base font-medium text-black"
                    >
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
                            matColor === color.id
                              ? "ring-2 ring-offset-2 ring-black border-transparent scale-110"
                              : "hover:scale-105"
                          )}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {matColor === color.id && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <Check
                                className={cn(
                                  "size-5",
                                  ["black", "navy", "forest", "gray"].some(
                                    (n) => color.name.toLowerCase().includes(n)
                                  )
                                    ? "text-white"
                                    : "text-black"
                                )}
                              />
                            </span>
                          )}
                          <span className="sr-only">{color.name}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Selected:{" "}
                      <span className="font-medium text-black">
                        {matColors.find((c: any) => c.id === matColor)?.name}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Protection Layer */}
              <div className="flex flex-col gap-4 border p-4 rounded-md bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="protection-switch"
                      className="text-base font-medium text-black"
                    >
                      Add Protection Layer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Glass or Film coating options.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasProtection &&
                      protectionType &&
                      (() => {
                        const selected = protectionOptions.find(
                          (opt: any) => opt.slug === protectionType
                        );
                        if (selected && selected.price > 0) {
                          return (
                            <span className="text-sm font-medium text-green-600">
                              + {formatCurrency(selected.price)}
                            </span>
                          );
                        }
                        return null;
                      })()}
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
                      {protectionOptions.map((option: any) => (
                        <div key={option.id}>
                          <RadioGroupItem
                            value={option.slug}
                            id={`type-${option.slug}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`type-${option.slug}`}
                            className="flex items-center justify-between rounded-md border-2 border-muted bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-black peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-black cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">
                                  {option.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.description}
                                </span>
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
          </div>

          <div className="mx-6 mt-6 border-b"></div>
          <div className="p-6 pt-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            {data.description ? (
              <RichText data={data.description} />
            ) : (
              <p className="text-muted-foreground italic">
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

// --- Utility Functions ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  );

  return new Promise((resolve) => {
    resolve(canvas.toDataURL("image/jpeg"));
  });
}

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
