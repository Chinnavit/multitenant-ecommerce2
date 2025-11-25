import { describe, it, expect, vi } from 'vitest'
import { Products } from '../Products'

// Mock the access utility
vi.mock('@/lib/access', () => ({
  isSuperAdmin: vi.fn(),
}))

import { isSuperAdmin } from '@/lib/access'

describe('Products Collection Config', () => {
  describe('Basic Configuration', () => {
    it('should have correct slug', () => {
      expect(Products.slug).toBe('products')
    })

    it('should use name as title', () => {
      expect(Products.admin?.useAsTitle).toBe('name')
    })

    it('should have appropriate description', () => {
      expect(Products.admin?.description).toBe('You must verify your account before creating products')
    })
  })

  describe('Field Configuration', () => {
    it('should have all required fields', () => {
      const fieldNames = Products.fields.map((field: any) => field.name)
      
      expect(fieldNames).toContain('name')
      expect(fieldNames).toContain('description')
      expect(fieldNames).toContain('price')
      expect(fieldNames).toContain('category')
      expect(fieldNames).toContain('tags')
      expect(fieldNames).toContain('image')
      expect(fieldNames).toContain('cover')
      expect(fieldNames).toContain('refundPolicy')
      expect(fieldNames).toContain('content')
      expect(fieldNames).toContain('isPrivate')
      expect(fieldNames).toContain('isArchived')
    })

    it('should not have options field', () => {
      const fieldNames = Products.fields.map((field: any) => field.name)
      expect(fieldNames).not.toContain('options')
    })

    it('should have name field as required text', () => {
      const nameField = Products.fields.find((field: any) => field.name === 'name')
      expect(nameField).toBeDefined()
      expect(nameField.type).toBe('text')
      expect(nameField.required).toBe(true)
    })

    it('should have description as richText', () => {
      const descField = Products.fields.find((field: any) => field.name === 'description')
      expect(descField).toBeDefined()
      expect(descField.type).toBe('richText')
    })

    it('should have price as required number', () => {
      const priceField = Products.fields.find((field: any) => field.name === 'price')
      expect(priceField).toBeDefined()
      expect(priceField.type).toBe('number')
      expect(priceField.required).toBe(true)
    })

    it('should have correct price field description', () => {
      const priceField = Products.fields.find((field: any) => field.name === 'price')
      expect(priceField.admin?.description).toBe('Price in THB (This is the base price)')
    })

    it('should have category as single relationship', () => {
      const categoryField = Products.fields.find((field: any) => field.name === 'category')
      expect(categoryField).toBeDefined()
      expect(categoryField.type).toBe('relationship')
      expect(categoryField.relationTo).toBe('categories')
      expect(categoryField.hasMany).toBe(false)
    })

    it('should have tags as multiple relationship', () => {
      const tagsField = Products.fields.find((field: any) => field.name === 'tags')
      expect(tagsField).toBeDefined()
      expect(tagsField.type).toBe('relationship')
      expect(tagsField.relationTo).toBe('tags')
      expect(tagsField.hasMany).toBe(true)
    })

    it('should have image upload field', () => {
      const imageField = Products.fields.find((field: any) => field.name === 'image')
      expect(imageField).toBeDefined()
      expect(imageField.type).toBe('upload')
      expect(imageField.relationTo).toBe('media')
    })

    it('should have cover upload field', () => {
      const coverField = Products.fields.find((field: any) => field.name === 'cover')
      expect(coverField).toBeDefined()
      expect(coverField.type).toBe('upload')
      expect(coverField.relationTo).toBe('media')
    })

    it('should have refundPolicy as select with correct options', () => {
      const refundField = Products.fields.find((field: any) => field.name === 'refundPolicy')
      expect(refundField).toBeDefined()
      expect(refundField.type).toBe('select')
      expect(refundField.options).toEqual([
        '30-day',
        '14-day',
        '7-day',
        '3-day',
        '1-day',
        'no-refunds',
      ])
      expect(refundField.defaultValue).toBe('30-day')
    })

    it('should have content as richText with description', () => {
      const contentField = Products.fields.find((field: any) => field.name === 'content')
      expect(contentField).toBeDefined()
      expect(contentField.type).toBe('richText')
      expect(contentField.admin?.description).toContain('Protected content')
    })

    it('should have isPrivate checkbox with correct default', () => {
      const privateField = Products.fields.find((field: any) => field.name === 'isPrivate')
      expect(privateField).toBeDefined()
      expect(privateField.type).toBe('checkbox')
      expect(privateField.defaultValue).toBe(false)
      expect(privateField.label).toBe('Private')
    })

    it('should have isArchived checkbox with correct default', () => {
      const archivedField = Products.fields.find((field: any) => field.name === 'isArchived')
      expect(archivedField).toBeDefined()
      expect(archivedField.type).toBe('checkbox')
      expect(archivedField.defaultValue).toBe(false)
      expect(archivedField.label).toBe('Archived')
    })
  })

  describe('Access Control', () => {
    it('should allow super admin to create products', () => {
      const mockReq = {
        user: { id: 'admin-id', role: 'super-admin' },
      }
      
      vi.mocked(isSuperAdmin).mockReturnValue(true)
      
      const canCreate = Products.access?.create?.({ req: mockReq as any })
      expect(canCreate).toBe(true)
    })

    it('should allow verified tenant to create products', () => {
      const mockReq = {
        user: {
          id: 'user-id',
          tenants: [
            {
              tenant: {
                id: 'tenant-id',
                stripeDetailsSubmitted: true,
              },
            },
          ],
        },
      }
      
      vi.mocked(isSuperAdmin).mockReturnValue(false)
      
      const canCreate = Products.access?.create?.({ req: mockReq as any })
      expect(canCreate).toBe(true)
    })

    it('should not allow unverified tenant to create products', () => {
      const mockReq = {
        user: {
          id: 'user-id',
          tenants: [
            {
              tenant: {
                id: 'tenant-id',
                stripeDetailsSubmitted: false,
              },
            },
          ],
        },
      }
      
      vi.mocked(isSuperAdmin).mockReturnValue(false)
      
      const canCreate = Products.access?.create?.({ req: mockReq as any })
      expect(canCreate).toBe(false)
    })

    it('should not allow user without tenant to create products', () => {
      const mockReq = {
        user: {
          id: 'user-id',
          tenants: [],
        },
      }
      
      vi.mocked(isSuperAdmin).mockReturnValue(false)
      
      const canCreate = Products.access?.create?.({ req: mockReq as any })
      expect(canCreate).toBe(false)
    })

    it('should only allow super admin to delete products', () => {
      const mockReq = {
        user: { id: 'admin-id', role: 'super-admin' },
      }
      
      vi.mocked(isSuperAdmin).mockReturnValue(true)
      
      const canDelete = Products.access?.delete?.({ req: mockReq as any })
      expect(canDelete).toBe(true)
    })

    it('should not allow non-super-admin to delete products', () => {
      const mockReq = {
        user: { id: 'user-id', role: 'user' },
      }
      
      vi.mocked(isSuperAdmin).mockReturnValue(false)
      
      const canDelete = Products.access?.delete?.({ req: mockReq as any })
      expect(canDelete).toBe(false)
    })
  })

  describe('Options Field Removal', () => {
    it('should verify options field was completely removed', () => {
      const hasOptionsField = Products.fields.some((field: any) => field.name === 'options')
      expect(hasOptionsField).toBe(false)
    })

    it('should have exactly 11 fields after options removal', () => {
      // name, description, price, category, tags, image, cover, refundPolicy, content, isPrivate, isArchived
      expect(Products.fields).toHaveLength(11)
    })

    it('should not have any array-type fields', () => {
      const arrayFields = Products.fields.filter((field: any) => field.type === 'array')
      expect(arrayFields).toHaveLength(0)
    })
  })

  describe('Field Descriptions', () => {
    it('should have description for isPrivate field', () => {
      const privateField = Products.fields.find((field: any) => field.name === 'isPrivate')
      expect(privateField.admin?.description).toBe(
        'If checked, this product will not be shown on the public storefront'
      )
    })

    it('should have description for isArchived field', () => {
      const archivedField = Products.fields.find((field: any) => field.name === 'isArchived')
      expect(archivedField.admin?.description).toBe('If checked, this product will be archived ')
    })
  })
})