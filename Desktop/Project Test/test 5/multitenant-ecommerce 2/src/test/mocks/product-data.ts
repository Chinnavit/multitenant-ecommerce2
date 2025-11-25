import { Product } from '@/payload-types'

export const mockProduct: Product = {
  id: 'test-product-id',
  name: 'Test Art Print',
  description: {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: 'A beautiful art print for your walls',
            },
          ],
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  price: 100,
  category: 'test-category',
  tags: [],
  image: {
    id: 'test-image-id',
    url: '/test-image.jpg',
    filename: 'test-image.jpg',
    mimeType: 'image/jpeg',
    filesize: 1024,
    width: 800,
    height: 600,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  refundPolicy: '30-day',
  isPrivate: false,
  isArchived: false,
  isPurchased: false,
  reviewRating: 4.5,
  reviewCount: 42,
  ratingDistribution: {
    1: 5,
    2: 3,
    3: 7,
    4: 15,
    5: 70,
  },
  tenant: {
    id: 'test-tenant-id',
    name: 'Test Store',
    slug: 'test-store',
    image: {
      id: 'tenant-image-id',
      url: '/tenant-logo.jpg',
      filename: 'tenant-logo.jpg',
      mimeType: 'image/jpeg',
      filesize: 512,
      width: 200,
      height: 200,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    stripeAccountId: 'acct_test123',
    stripeDetailsSubmitted: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

export const mockProductWithoutImage: Product = {
  ...mockProduct,
  image: undefined,
}

export const mockProductPurchased: Product = {
  ...mockProduct,
  isPurchased: true,
}