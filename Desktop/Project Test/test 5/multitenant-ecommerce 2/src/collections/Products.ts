import type { CollectionConfig } from 'payload'

import { Tenant } from '@/payload-types'
import { isSuperAdmin } from '@/lib/access'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true

      const tenant = req.user?.tenants?.[0]?.tenant as Tenant

      return Boolean(tenant?.stripeDetailsSubmitted)
    },
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  admin: {
    useAsTitle: 'name',
    description: 'You must verify your account before creating products',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      admin: {
        description: 'Price in THB (This is the base price)', // Description in English
      },
    },

    // --- (THIS IS THE NEW SECTION WE ARE ADDING) ---
    {
      name: 'options',
      label: 'Product Options (e.g., Size, Color)', // Description in English
      type: 'array',
      admin: {
        description:
          'Add product variants, like different frame sizes.', // Description in English
      },
      fields: [
        {
          name: 'name',
          label: 'Option Name (e.g., Medium, Large)', // Description in English
          type: 'text',
          required: true,
        },
        {
          name: 'priceModifier',
          label: 'Price Modifier (e.g., 50, -10, or 0)', // Description in English
          type: 'number',
          required: true,
          defaultValue: 0,
          admin: {
            description:
              'Enter 50 to add 50 THB, -10 to subtract 10 THB, or 0 for no price change.', // Description in English
          },
        },
      ],
    },
    // --- (END OF THE NEW SECTION) ---

    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'refundPolicy',
      type: 'select',
      options: ['30-day', '14-day', '7-day', '3-day', '1-day', 'no-refunds'],
      defaultValue: '30-day',
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description:
          'Protected content only visible to customer after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown formatting',
      },
    },
    {
      name: 'isPrivate',
      label: 'Private',
      defaultValue: false,
      type: 'checkbox',
      admin: {
        description:
          'If checked, this product will not be shown on the public storefront',
      },
    },
    {
      name: 'isArchived',
      label: 'Archived',
      defaultValue: false,
      type: 'checkbox',
      admin: {
        description: 'If checked, this product will be archived ',
      },
    },
  ],
}