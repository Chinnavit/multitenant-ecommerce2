import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Products } from './Products'

// Mock dependencies
vi.mock('@/lib/access', () => ({
  isSuperAdmin: vi.fn(),
}))

describe('Products Collection Configuration', () => {
  describe('Collection Metadata', () => {
    it('should have correct slug', () => {
      expect(Products.slug).toBe('products')
    })

    it('should use name as title', () => {
      expect(Products.admin?.useAsTitle).toBe('name')
    })

    it('should have verification reminder description', () => {
      expect(Products.admin?.description).toBe('You must verify your account before creating products')
    })
  })

  describe('Access Control - Create', () => {
    let mockReq: any

    beforeEach(() => {
      mockReq = {
        user: {
          role: 'user',
          tenants: [],
        },
      }
      vi.clearAllMocks()
    })

    it('should allow super admin to create products', () => {
      const { isSuperAdmin } = require('@/lib/access')
      isSuperAdmin.mockReturnValue(true)
      
      const canCreate = Products.access?.create?.({ req: mockReq })
      expect(canCreate).toBe(true)
    })

    it('should allow verified tenant to create products', () => {
      const { isSuperAdmin } = require('@/lib/access')
      isSuperAdmin.mockReturnValue(false)
      
      mockReq.user.tenants = [{
        tenant: {
          stripeDetailsSubmitted: true,
        },
      }]
      
      const canCreate = Products.access?.create?.({ req: mockReq })
      expect(canCreate).toBe(true)
    })

    it('should deny unverified tenant from creating products', () => {
      const { isSuperAdmin } = require('@/lib/access')
      isSuperAdmin.mockReturnValue(false)
      
      mockReq.user.tenants = [{
        tenant: {
          stripeDetailsSubmitted: false,
        },
      }]
      
      const canCreate = Products.access?.create?.({ req: mockReq })
      expect(canCreate).toBe(false)
    })

    it('should deny users without tenant', () => {
      const { isSuperAdmin } = require('@/lib/access')
      isSuperAdmin.mockReturnValue(false)
      
      mockReq.user.tenants = []
      
      const canCreate = Products.access?.create?.({ req: mockReq })
      expect(canCreate).toBe(false)
    })

    it('should deny users with null tenant', () => {
      const { isSuperAdmin } = require('@/lib/access')
      isSuperAdmin.mockReturnValue(false)
      
      mockReq.user.tenants = [{ tenant: null }]
      
      const canCreate = Products.access?.create?.({ req: mockReq })
      expect(canCreate).toBe(false)
    })
  })

  describe('Access Control - Delete', () => {
    let mockReq: any

    beforeEach(() => {
      mockReq = {
        user: {
          role: 'user',
        },
      }
      vi.clearAllMocks()
    })

    it('should only allow super admin to delete products', () => {
      const { isSuperAdmin } = require('@/lib/access')
      isSuperAdmin.mockReturnValue(true)
      
      const canDelete = Products.access?.delete?.({ req: mockReq })
      expect(canDelete).toBe(true)
    })

    it('should deny non-super admin from deleting products', () => {
      const { isSuperAdmin } = require('@/lib/access')
      isSuperAdmin.mockReturnValue(false)
      
      const canDelete = Products.access?.delete?.({ req: mockReq })
      expect(canDelete).toBe(false)
    })
  })

  describe('Field Configurations', () => {
    const getField = (name: string) => {
      return Products.fields.find((field: any) => field.name === name)
    }

    it('should have required name field', () => {
      const nameField = getField('name')
      expect(nameField).toBeDefined()
      expect(nameField?.type).toBe('text')
      expect(nameField?.required).toBe(true)
    })

    it('should have optional description field with richText', () => {
      const descField = getField('description')
      expect(descField).toBeDefined()
      expect(descField?.type).toBe('richText')
      expect(descField?.required).toBeUndefined()
    })

    it('should have required price field', () => {
      const priceField = getField('price')
      expect(priceField).toBeDefined()
      expect(priceField?.type).toBe('number')
      expect(priceField?.required).toBe(true)
      expect(priceField?.admin?.description).toBe('Price in THB (This is the base price)')
    })

    it('should not have options field (removed in this change)', () => {
      const optionsField = getField('options')
      expect(optionsField).toBeUndefined()
    })

    it('should have category relationship field', () => {
      const categoryField = getField('category')
      expect(categoryField).toBeDefined()
      expect(categoryField?.type).toBe('relationship')
      expect(categoryField?.relationTo).toBe('categories')
      expect(categoryField?.hasMany).toBe(false)
    })

    it('should have tags relationship field with hasMany', () => {
      const tagsField = getField('tags')
      expect(tagsField).toBeDefined()
      expect(tagsField?.type).toBe('relationship')
      expect(tagsField?.relationTo).toBe('tags')
      expect(tagsField?.hasMany).toBe(true)
    })

    it('should have image upload field', () => {
      const imageField = getField('image')
      expect(imageField).toBeDefined()
      expect(imageField?.type).toBe('upload')
      expect(imageField?.relationTo).toBe('media')
    })

    it('should have cover upload field', () => {
      const coverField = getField('cover')
      expect(coverField).toBeDefined()
      expect(coverField?.type).toBe('upload')
      expect(coverField?.relationTo).toBe('media')
    })

    it('should have refundPolicy select field with correct options', () => {
      const refundField = getField('refundPolicy')
      expect(refundField).toBeDefined()
      expect(refundField?.type).toBe('select')
      expect(refundField?.options).toEqual([
        '30-day',
        '14-day',
        '7-day',
        '3-day',
        '1-day',
        'no-refunds'
      ])
      expect(refundField?.defaultValue).toBe('30-day')
    })

    it('should have protected content field for post-purchase', () => {
      const contentField = getField('content')
      expect(contentField).toBeDefined()
      expect(contentField?.type).toBe('richText')
      expect(contentField?.admin?.description).toContain('Protected content')
    })

    it('should have isPrivate checkbox with default false', () => {
      const privateField = getField('isPrivate')
      expect(privateField).toBeDefined()
      expect(privateField?.type).toBe('checkbox')
      expect(privateField?.label).toBe('Private')
      expect(privateField?.defaultValue).toBe(false)
    })

    it('should have all required fields for product management', () => {
      const requiredFieldNames = ['name', 'price']
      const fields = Products.fields as any[]
      
      requiredFieldNames.forEach(fieldName => {
        const field = fields.find(f => f.name === fieldName)
        expect(field, `Field ${fieldName} should exist`).toBeDefined()
        expect(field?.required, `Field ${fieldName} should be required`).toBe(true)
      })
    })
  })

  describe('Field Count and Structure', () => {
    it('should have expected number of fields', () => {
      // Count fields (not including removed options field)
      const expectedFieldCount = 9 // name, description, price, category, tags, image, cover, refundPolicy, content, isPrivate
      expect(Products.fields.length).toBeGreaterThanOrEqual(expectedFieldCount)
    })

    it('should have all fields with valid types', () => {
      const validTypes = [
        'text',
        'richText',
        'number',
        'relationship',
        'upload',
        'select',
        'checkbox',
      ]
      
      Products.fields.forEach((field: any) => {
        expect(validTypes).toContain(field.type)
      })
    })

    it('should have proper field structure', () => {
      Products.fields.forEach((field: any) => {
        expect(field).toHaveProperty('name')
        expect(field).toHaveProperty('type')
      })
    })
  })

  describe('Backwards Compatibility', () => {
    it('should not break existing product documents without options', () => {
      // This test ensures that removing the options field doesn't break the schema
      const fields = Products.fields as any[]
      const hasOptions = fields.some(f => f.name === 'options')
      
      // Options field should be removed
      expect(hasOptions).toBe(false)
    })

    it('should maintain other field configurations after options removal', () => {
      const getField = (name: string) => {
        return Products.fields.find((field: any) => field.name === name)
      }
      
      // Verify fields before and after options are still intact
      expect(getField('price')).toBeDefined()
      expect(getField('category')).toBeDefined()
      expect(getField('tags')).toBeDefined()
    })
  })

  describe('Validation Logic', () => {
    it('should enforce required fields', () => {
      const fields = Products.fields as any[]
      const requiredFields = fields.filter(f => f.required)
      
      expect(requiredFields.length).toBeGreaterThan(0)
      expect(requiredFields.some(f => f.name === 'name')).toBe(true)
      expect(requiredFields.some(f => f.name === 'price')).toBe(true)
    })

    it('should have sensible defaults', () => {
      const getField = (name: string) => {
        return Products.fields.find((field: any) => field.name === name)
      }
      
      expect(getField('refundPolicy')?.defaultValue).toBe('30-day')
      expect(getField('isPrivate')?.defaultValue).toBe(false)
    })
  })
})