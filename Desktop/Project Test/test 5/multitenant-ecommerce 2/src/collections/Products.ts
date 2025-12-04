import type { CollectionConfig } from "payload";

import { Tenant } from "@/payload-types";
import { isSuperAdmin } from "@/lib/access";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true;

      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;

      return Boolean(tenant?.stripeDetailsSubmitted);
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your account before creating products",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "richText",
    },
    // --- เพิ่มส่วน matColors ---
    {
      name: "matColors",
      label: "Available Mat Colors",
      type: "array",
      minRows: 0,
      admin: {
        description: "Add available mat colors for this product.",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: "Color Name (e.g., White)",
        },
        {
          name: "hex",
          type: "text",
          required: true,
          label: "Hex Code (e.g., #FFFFFF)",
        },
      ],
    },

    // ✅ 2. เพิ่ม Field: Protection Options
    {
      name: "protectionOptions",
      label: "Protection/Glass Options",
      type: "array",
      minRows: 0,
      admin: {
        description: "Options for protection layer and glass types (e.g., Film, Acrylic)",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: "Option Name (e.g. Film Coating)",
        },
        {
          name: "price",
          type: "number",
          required: true,
          defaultValue: 0,
          label: "Price (+THB)",
        },
        {
          name: "slug",
          type: "text",
          required: true,
          label: "Slug/ID (Important: Must use 'film', 'acrylic', or 'normal' to match frontend logic)",
        },
        {
          name: "description",
          type: "textarea",
          label: "Description (Displayed below option name)",
        }
      ],
    },
    // ----------------------------------------
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "Price in THB (This is the base price)", // Description in English
      },
    },
    {
      type: "row", // จัดให้อยู่แถวเดียวกัน
      fields: [
        {
          name: "width",
          type: "number",
          required: true,
          defaultValue: 8,
          label: "Default Width (inches)",
          admin: { description: "ความกว้างเริ่มต้น (เช่น 8)" },
        },
        {
          name: "height",
          type: "number",
          required: true,
          defaultValue: 10,
          label: "Default Height (inches)",
          admin: { description: "ความสูงเริ่มต้น (เช่น 10)" },
        },
      ],
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refunds"],
      defaultValue: "30-day",
    },
    {
      name: "content",
      type: "textarea",
      admin: {
        description:
          "Protected content only visible to customer after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown formatting",
      },
    },
    {
      name: "isPrivate",
      label: "Private",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description:
          "If checked, this product will not be shown on the public storefront",
      },
    },
    {
      name: "isArchived",
      label: "Archived",
      defaultValue: false,
      type: "checkbox",
      admin: {
        description: "If checked, this product will be archived ",
      },
    },
  ],
};
