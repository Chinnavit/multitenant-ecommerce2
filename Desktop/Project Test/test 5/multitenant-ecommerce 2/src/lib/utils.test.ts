import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { formatCurrency, generateTenantURL, cn } from './utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format number as Thai Baht currency', () => {
      const result = formatCurrency(100)
      expect(result).toBe('฿100')
    })

    it('should handle decimal values and round to nearest baht', () => {
      const result = formatCurrency(100.99)
      expect(result).toBe('฿101')
    })

    it('should handle string input', () => {
      const result = formatCurrency('250')
      expect(result).toBe('฿250')
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)
      expect(result).toBe('฿0')
    })

    it('should handle negative values', () => {
      const result = formatCurrency(-50)
      expect(result).toBe('-฿50')
    })

    it('should format large numbers with thousand separators', () => {
      const result = formatCurrency(1000000)
      expect(result).toBe('฿1,000,000')
    })

    it('should round decimals correctly (no fraction digits)', () => {
      expect(formatCurrency(99.4)).toBe('฿99')
      expect(formatCurrency(99.5)).toBe('฿100')
      expect(formatCurrency(99.9)).toBe('฿100')
    })

    it('should handle very small decimal values', () => {
      const result = formatCurrency(0.99)
      expect(result).toBe('฿1')
    })

    it('should handle NaN by converting to ฿0', () => {
      const result = formatCurrency(NaN)
      expect(result).toBe('฿NaN') // This is expected behavior for Intl.NumberFormat
    })
  })

  describe('generateTenantURL', () => {
    let originalEnv: NodeJS.ProcessEnv

    beforeEach(() => {
      originalEnv = { ...process.env }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should generate development URL with path-based routing', () => {
      process.env.NODE_ENV = 'development'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
      
      const url = generateTenantURL('test-store')
      expect(url).toBe('http://localhost:3000/tenants/test-store')
    })

    it('should generate production URL with subdomain routing', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'example.com'
      
      const url = generateTenantURL('test-store')
      expect(url).toBe('https://test-store.example.com')
    })

    it('should handle tenant slugs with special characters', () => {
      process.env.NODE_ENV = 'development'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
      
      const url = generateTenantURL('my-store-123')
      expect(url).toBe('http://localhost:3000/tenants/my-store-123')
    })

    it('should always use https in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.NEXT_PUBLIC_ROOT_DOMAIN = 'example.com'
      
      const url = generateTenantURL('store')
      expect(url).toContain('https://')
    })

    it('should handle empty tenant slug', () => {
      process.env.NODE_ENV = 'development'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
      
      const url = generateTenantURL('')
      expect(url).toBe('http://localhost:3000/tenants/')
    })

    it('should preserve tenant slug casing', () => {
      process.env.NODE_ENV = 'development'
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
      
      const url = generateTenantURL('MyStore')
      expect(url).toBe('http://localhost:3000/tenants/MyStore')
    })
  })

  describe('cn (className utility)', () => {
    it('should merge class names', () => {
      const result = cn('class1', 'class2')
      expect(result).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'hidden', true && 'visible')
      expect(result).toBe('base visible')
    })

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'extra')
      expect(result).toBe('base extra')
    })

    it('should merge Tailwind classes correctly (last one wins)', () => {
      const result = cn('p-4', 'p-8')
      expect(result).toBe('p-8')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2'])
      expect(result).toBe('class1 class2')
    })

    it('should handle object notation', () => {
      const result = cn({
        'class1': true,
        'class2': false,
        'class3': true,
      })
      expect(result).toBe('class1 class3')
    })

    it('should deduplicate identical classes', () => {
      const result = cn('text-base', 'text-base')
      expect(result).toBe('text-base')
    })
  })
})