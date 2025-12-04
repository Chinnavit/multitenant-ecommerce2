import z from "zod";
import type Stripe from "stripe";
import { TRPCError } from "@trpc/server";
import { stripe } from "@/lib/stripe";
import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { PLATFORM_FEE_PERCENTAGE } from "@/constants";
import { generateTenantURL } from "@/lib/utils";

// Helper function คำนวณราคาฝั่ง Server (ต้องตรงกับหน้า ProductView)
const calculateItemPrice = (basePrice: number, item: any, protectionOptions: any[]) => {
    const width = item.width || 8;
    const height = item.height || 10;
    const area = width * height;
    const framePricePerSqIn = 0.5; 
    
    let total = basePrice + (area * framePricePerSqIn);

    // Mat Board (Fixed 20 THB)
    if (item.matColor) {
        total += 20;
    }

    // Protection Options
    if (item.protectionType) {
        const option = protectionOptions.find((opt: any) => opt.slug === item.protectionType);
        if (option) {
            total += option.price;
        }
    }

    return total;
};

export const checkoutRouter = createTRPCRouter({
  // ... (verify procedure เหมือนเดิม)

  purchase: protectedProcedure
    .input(
      z.object({
        tenantSlug: z.string().min(1),
        // ✅ รับ items เป็น array object แทน ID อย่างเดียว
        items: z.array(z.object({
            productId: z.string(),
            width: z.number().optional(),
            height: z.number().optional(),
            matColor: z.string().optional(),
            protectionType: z.string().optional(),
            price: z.number().optional(), // รับมาเผื่อเทียบ (แต่เราจะคำนวณใหม่)
        })).min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const productIds = input.items.map(i => i.productId);

      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
            id: { in: productIds },
            "tenant.slug": { equals: input.tenantSlug },
            isArchived: { not_equals: true },
        },
      });

      // เช็ค Tenant
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        pagination: false,
        where: { slug: { equals: input.tenantSlug } },
      });
      const tenant = tenantsData.docs[0];

      if (!tenant || !tenant.stripeDetailsSubmitted) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Tenant not ready" });
      }

      let totalAmount = 0;

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = input.items.map((cartItem) => {
          const product = products.docs.find(p => p.id === cartItem.productId);
          if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });

          // ✅ คำนวณราคาจริง ฝั่ง Server
          const finalPrice = calculateItemPrice(product.price, cartItem, product.protectionOptions || []);
          
          totalAmount += finalPrice * 100; // หน่วยสตางค์

          // สร้างคำอธิบายสินค้า (เช่น ขนาด 8x10, Mat: White)
          let description = `Size: ${cartItem.width || 8}"x${cartItem.height || 10}"`;
          if(cartItem.matColor) description += `, Mat: ${cartItem.matColor}`;
          if(cartItem.protectionType) description += `, Option: ${cartItem.protectionType}`;

          return {
            quantity: 1,
            price_data: {
                unit_amount: Math.round(finalPrice * 100),
                currency: "thb",
                product_data: {
                    name: product.name,
                    description: description, // ใส่รายละเอียดลงในใบเสร็จ Stripe
                    metadata: {
                        stripeAccountId: tenant.stripeAccountId,
                        id: product.id,
                        name: product.name,
                        price: finalPrice,
                    } as ProductMetadata,
                },
            },
          };
      });

      const platformFeeAmount = Math.round(totalAmount * (PLATFORM_FEE_PERCENTAGE / 100));
      const domain = generateTenantURL(input.tenantSlug);

      const checkout = await stripe.checkout.sessions.create({
          customer_email: ctx.session.user.email,
          success_url: `${domain}/checkout?success=true`,
          cancel_url: `${domain}/checkout?cancel=true`,
          mode: "payment",
          line_items: lineItems,
          invoice_creation: { enabled: true },
          metadata: { userId: ctx.session.user.id } as CheckoutMetadata,
          payment_intent_data: { application_fee_amount: platformFeeAmount },
      }, {
          stripeAccount: tenant.stripeAccountId,
      });

      if (!checkout.url) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed" });
      }

      return { url: checkout.url };
    }),

    // ... (getProducts procedure เหมือนเดิม หรือแก้ให้รับแค่ IDs ก็พอเพราะใช้แค่ดึงรูป/ชื่อ)
    getProducts: baseProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
        // ... (Code เดิมใช้ได้เลยครับ เพราะเราใช้แค่ดึงรายละเอียดพื้นฐานมาโชว์)
        // ก๊อปปี้โค้ดเดิมส่วน getProducts มาวางได้เลยครับ
        const data = await ctx.db.find({
            collection: "products",
            depth: 2,
            where: { id: { in: input.ids }, isArchived: { not_equals: true } },
        });
        return {
            ...data,
            // totalPrice ไม่ต้องใช้จากตรงนี้แล้ว เพราะเราคำนวณหน้าเว็บเอง
            docs: data.docs.map((doc) => ({
                ...doc,
                image: doc.image as Media | null,
                tenant: doc.tenant as Tenant & { image: Media | null },
            })),
        };
    }),
});