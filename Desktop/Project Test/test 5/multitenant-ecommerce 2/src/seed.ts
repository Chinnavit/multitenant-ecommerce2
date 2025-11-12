import { getPayload } from "payload";
import config from "@payload-config";

import { stripe } from "./lib/stripe";

const categories = [
  {
    name: "Custom Wall Frames",
    color: "#FFB347",
    slug: "custom-wall-frames",
    subcategories: [
      { name: "Modern Frame", slug: "modern-frame" },
      { name: "Classic Frame", slug: "classic-frame" },
      { name: "Rustic Frame", slug: "rustic-frame" },
      { name: "Ornate Frame", slug: "ornate-frame" },
      { name: "Minimalist Frame", slug: "minimalist-frame" },
    ],
  },
  {
    name: "Holiday Gifts",
    color: "#7EC8E3",
    slug: "holiday-gifts",
    subcategories: [
      { name: "Christmas Frames", slug: "christmas-frames" },
      { name: "Birthday Frames", slug: "birthday-frames" },
      { name: "Anniversary Frames", slug: "anniversary-frames" },
      { name: "Graduation Frames", slug: "graduation-frames" },
      { name: "Wedding Frames", slug: "wedding-frames" },
    ],
  },
  {
    name: "Ornaments",
    color: "#D8B5FF",
    slug: "ornaments",
    subcategories: [
      { name: "Photo Ornaments", slug: "photo-ornaments" },
      { name: "Glass Ornaments", slug: "glass-ornaments" },
      { name: "Wooden Ornaments", slug: "wooden-ornaments" },
      { name: "Metal Ornaments", slug: "metal-ornaments" },
      { name: "Ceramic Ornaments", slug: "ceramic-ornaments" },
    ],
  },
  {
    name: "Tabletop Frames",
    color: "#FFE066",
    slug: "tabletop-frames",
    subcategories: [
      { name: "Desktop Frame", slug: "desktop-frame" },
      { name: "Easel Frame", slug: "easel-frame" },
      { name: "Collage Frame", slug: "collage-frame" },
      { name: "Multi-Photo Frame", slug: "multi-photo-frame" },
      { name: "Digital Tabletop Frame", slug: "digital-tabletop-frame" },
    ],
  },
  {
    name: "Gallery Walls",
    color: "#77DD77",
    slug: "gallery-walls",
    subcategories: [
      { name: "Pre-Designed Gallery", slug: "pre-designed-gallery" },
      { name: "Custom Layout", slug: "custom-layout" },
      { name: "Themed Gallery", slug: "themed-gallery" },
      { name: "Family Gallery", slug: "family-gallery" },
      { name: "Travel Gallery", slug: "travel-gallery" },
    ],
  },
];

const seed = async () => {
  const payload = await getPayload({ config });

  let adminAccount;
  try {
    adminAccount = await stripe.accounts.create({});
  } catch (error) {
    console.error("Failed to create Stripe account:", error);
    throw new Error("Stripe account creation failed during seeding");
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
    collection: "users",
    data: {
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
    const parentCategory = await payload.create({
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
};

try {
  await seed();
  console.log("Seeding compeleted successfully");
  process.exit(0);
} catch (error) {
  console.log("Error during seeding:", error);
  process.exit(1);
}
