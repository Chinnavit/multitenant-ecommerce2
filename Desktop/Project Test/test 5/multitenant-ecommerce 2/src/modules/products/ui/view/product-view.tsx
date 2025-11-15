"use client";

// TODO: Add real ratings

import Link from "next/link";
import Image from "next/image";
import { Fragment, useState } from "react";
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

            {/* Price & Action Row: ใช้ justify-between เพื่อดันราคาไปซ้าย ปุ่มไปขวา */}
            <div className="flex items-start justify-between w-full gap-4">
              {/* Price: ซ้าย (สีดำ) */}
              <div className="flex items-center h-10">
                <p className="text-3xl font-bold text-black">
                  {formatCurrency(data.price)}
                </p>
              </div>

              {/* Actions Group: ขวา (ปุ่ม + Refund text) */}
              <div className="flex flex-col items-end gap-2">
                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <CartButton
                    isPurchased={data.isPurchased}
                    productId={productId}
                    tenantSlug={tenantSlug}
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

                {/* Refund Policy (ชิดขวา ใต้ปุ่ม) */}
                <p className="text-sm font-medium text-muted-foreground text-right">
                  {data.refundPolicy === "no-refunds"
                    ? "No refunds"
                    : `${data.refundPolicy} money back guarantee`}
                </p>
              </div>
            </div>

            {/* Store & Ratings */}
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
          </div>

          {/* ... (ส่วน Description และ Reviews เหมือนเดิม ไม่ต้องแก้) ... */}
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
