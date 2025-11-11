import { getPayload } from "payload";
import config from "@payload-config";

import { stripe } from "./lib/stripe";

const categories = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Style Frame",
    color: "#FFB347",
    slug: "style-frame",
    subcategories: [
      { name: "Loft", slug: "loft"},
      { name: "Louis", slug: "louis" },
      { name: "Ornate", slug: "ornate"},
      { name: "Modern", slug: "modern" },
      { name: "Vintage", slug: "vintage" },
      { name: "Scandinavian", slug: "scandinavian" },
      { name: "Classic Style", slug: "classic-style" },
    ],
  },
  {
    name: "Material",
    color: "#7EC8E3",
    slug: "material",
    subcategories: [
      { name: "PS Frame", slug: "ps-frame" },
      { name: "Polystyrene", slug: "polystyrene" },
      { name: "Metal Frame", slug: "metal-frame" },
      { name: "Wooden Frame", slug: "wooden-frame" },
      { name: "Acrylic Frame", slug: "acrylic-frame" },
    ],
  },
  {
    name: "Structure & Use",
    color: "#D8B5FF",
    slug: "structure-use",
    subcategories: [
      { name: "Clip Frame", slug: "clip-frame" },
      { name: "Floating Frame", slug: "floating-frame" },
      { name: "Shadow Box Frame", slug: "shadow-box-frame" },
      { name: "Digital Photo Frame", slug: "digital-photo-frame" },
      { name: "Canvas Floater Frame", slug: "canvas-floater-frame" },
    ],
  },
  {
    name: "Other",
    slug: "other",
  },
]

const seed = async () => {
    const payload = await getPayload({ config });

    let adminAccount;
    try {
      adminAccount = await stripe.accounts.create({});
    } catch (error) {
      console.error('Failed to create Stripe account:', error);
      throw new Error('Stripe account creation failed during seeding');
    }

    // Create admin tenant
    const adminTenant = await payload.create({
      collection: "tenants",
      data: {
        name: "admin",
        slug: "admin",
        stripeAccountId: adminAccount.id,
      },
    });

    // Create admin user
    await payload.create({
      collection:"users",
      data:{
        email: "admin@demo.com",
        password: "demo",
        roles: ["super-admin"],
        username: "admin",
        tenants: [
          {
            tenant: adminTenant.id,
          },
        ],
      },
    });

    for (const category of categories) {
        const parentCategory =  await payload.create({
            collection: "categories",
            data: {
                name: category.name,
                slug: category.slug,
                color: category.color,
                parent: null,
            },
        });
            for (const subCategory of category.subcategories || []) {
                await payload.create({
                    collection: "categories",
                    data: {
                        name: subCategory.name,
                        slug: subCategory.slug,
                        parent: parentCategory.id,
        },
      });
    }
  }
}

try {
  await seed();
  console.log('Seeding compeleted successfully');
  process.exit(0);
} catch (error) {
  console.log('Error during seeding:',error);
  process.exit(1);
}