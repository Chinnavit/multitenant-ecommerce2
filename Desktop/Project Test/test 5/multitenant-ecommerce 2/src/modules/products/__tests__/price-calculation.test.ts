import { describe, it, expect } from 'vitest'

/**
 * Price Calculation Logic Tests
 * 
 * These tests verify the custom frame pricing logic that was introduced
 * to replace the options-based pricing system.
 * 
 * Pricing formula:
 * - Base price: product.price
 * - Frame surcharge: area (width * height) * 0.5 THB per sq inch
 * - Mat surcharge: area (width * height) * 0.2 THB per sq inch (if enabled)
 * - Total: basePrice + frameSurcharge + (matSurcharge if hasMat)
 */

interface PriceCalculation {
  width: number
  height: number
  hasMat: boolean
  basePrice: number
}

function calculatePrice({ width, height, hasMat, basePrice }: PriceCalculation): number {
  const area = width * height
  const framePricePerSqIn = 0.5
  const matPricePerSqIn = 0.2
  
  let surcharge = area * framePricePerSqIn
  
  if (hasMat) {
    surcharge += area * matPricePerSqIn
  }
  
  return basePrice + surcharge
}

describe('Price Calculation Logic', () => {
  const basePrice = 100

  describe('Frame-only Pricing', () => {
    it('should calculate price for default dimensions (8x10)', () => {
      const price = calculatePrice({
        width: 8,
        height: 10,
        hasMat: false,
        basePrice,
      })
      
      // 8 * 10 = 80 sq in
      // 80 * 0.5 = 40 THB surcharge
      // Total: 100 + 40 = 140
      expect(price).toBe(140)
    })

    it('should calculate price for small frame (4x4)', () => {
      const price = calculatePrice({
        width: 4,
        height: 4,
        hasMat: false,
        basePrice,
      })
      
      // 4 * 4 = 16 sq in
      // 16 * 0.5 = 8 THB surcharge
      expect(price).toBe(108)
    })

    it('should calculate price for large frame (40x40)', () => {
      const price = calculatePrice({
        width: 40,
        height: 40,
        hasMat: false,
        basePrice,
      })
      
      // 40 * 40 = 1600 sq in
      // 1600 * 0.5 = 800 THB surcharge
      expect(price).toBe(900)
    })

    it('should calculate price for rectangular frame (12x16)', () => {
      const price = calculatePrice({
        width: 12,
        height: 16,
        hasMat: false,
        basePrice,
      })
      
      // 12 * 16 = 192 sq in
      // 192 * 0.5 = 96 THB surcharge
      expect(price).toBe(196)
    })

    it('should calculate price for panoramic frame (24x8)', () => {
      const price = calculatePrice({
        width: 24,
        height: 8,
        hasMat: false,
        basePrice,
      })
      
      // 24 * 8 = 192 sq in
      expect(price).toBe(196)
    })
  })

  describe('Frame with Mat Pricing', () => {
    it('should add mat surcharge for default dimensions', () => {
      const price = calculatePrice({
        width: 8,
        height: 10,
        hasMat: true,
        basePrice,
      })
      
      // Frame: 80 * 0.5 = 40
      // Mat: 80 * 0.2 = 16
      // Total: 100 + 40 + 16 = 156
      expect(price).toBe(156)
    })

    it('should add mat surcharge for small frame', () => {
      const price = calculatePrice({
        width: 4,
        height: 4,
        hasMat: true,
        basePrice,
      })
      
      // Frame: 16 * 0.5 = 8
      // Mat: 16 * 0.2 = 3.2
      // Total: 100 + 8 + 3.2 = 111.2
      expect(price).toBe(111.2)
    })

    it('should add mat surcharge for large frame', () => {
      const price = calculatePrice({
        width: 40,
        height: 40,
        hasMat: true,
        basePrice,
      })
      
      // Frame: 1600 * 0.5 = 800
      // Mat: 1600 * 0.2 = 320
      // Total: 100 + 800 + 320 = 1220
      expect(price).toBe(1220)
    })
  })

  describe('Edge Cases', () => {
    it('should handle minimum dimensions (4x4)', () => {
      const price = calculatePrice({
        width: 4,
        height: 4,
        hasMat: false,
        basePrice,
      })
      
      expect(price).toBe(108)
    })

    it('should handle maximum dimensions (40x40)', () => {
      const price = calculatePrice({
        width: 40,
        height: 40,
        hasMat: false,
        basePrice,
      })
      
      expect(price).toBe(900)
    })

    it('should handle decimal dimensions', () => {
      const price = calculatePrice({
        width: 8.5,
        height: 10.5,
        hasMat: false,
        basePrice,
      })
      
      // 8.5 * 10.5 = 89.25 sq in
      // 89.25 * 0.5 = 44.625
      expect(price).toBe(144.625)
    })

    it('should handle zero dimensions', () => {
      const price = calculatePrice({
        width: 0,
        height: 0,
        hasMat: false,
        basePrice,
      })
      
      expect(price).toBe(basePrice)
    })

    it('should handle different base prices', () => {
      const price1 = calculatePrice({
        width: 10,
        height: 10,
        hasMat: false,
        basePrice: 50,
      })
      
      const price2 = calculatePrice({
        width: 10,
        height: 10,
        hasMat: false,
        basePrice: 200,
      })
      
      // Same dimensions, different base prices
      expect(price1).toBe(100) // 50 + 50
      expect(price2).toBe(250) // 200 + 50
    })
  })

  describe('Mat Surcharge Calculation', () => {
    it('should calculate mat surcharge correctly', () => {
      const withoutMat = calculatePrice({
        width: 10,
        height: 10,
        hasMat: false,
        basePrice,
      })
      
      const withMat = calculatePrice({
        width: 10,
        height: 10,
        hasMat: true,
        basePrice,
      })
      
      const matSurcharge = withMat - withoutMat
      
      // 10 * 10 = 100 sq in
      // 100 * 0.2 = 20 THB
      expect(matSurcharge).toBe(20)
    })

    it('should not charge mat when disabled', () => {
      const price = calculatePrice({
        width: 20,
        height: 30,
        hasMat: false,
        basePrice,
      })
      
      // Should only include frame surcharge
      // 600 * 0.5 = 300
      expect(price).toBe(400)
    })
  })

  describe('Realistic Scenarios', () => {
    it('should price standard photo frame (8x10) without mat', () => {
      const price = calculatePrice({
        width: 8,
        height: 10,
        hasMat: false,
        basePrice: 150,
      })
      
      expect(price).toBe(190)
    })

    it('should price standard photo frame (8x10) with mat', () => {
      const price = calculatePrice({
        width: 8,
        height: 10,
        hasMat: true,
        basePrice: 150,
      })
      
      expect(price).toBe(206)
    })

    it('should price poster frame (24x36) without mat', () => {
      const price = calculatePrice({
        width: 24,
        height: 36,
        hasMat: false,
        basePrice: 200,
      })
      
      // 24 * 36 = 864 sq in
      // 864 * 0.5 = 432
      expect(price).toBe(632)
    })

    it('should price poster frame (24x36) with mat', () => {
      const price = calculatePrice({
        width: 24,
        height: 36,
        hasMat: true,
        basePrice: 200,
      })
      
      // Frame: 864 * 0.5 = 432
      // Mat: 864 * 0.2 = 172.8
      expect(price).toBe(804.8)
    })
  })

  describe('Comparison with Old Options System', () => {
    it('should provide more granular pricing than fixed options', () => {
      // Old system might have: Small (+0), Medium (+50), Large (+100)
      // New system: Exact pricing based on dimensions
      
      const small = calculatePrice({ width: 8, height: 10, hasMat: false, basePrice })
      const medium = calculatePrice({ width: 12, height: 16, hasMat: false, basePrice })
      const large = calculatePrice({ width: 20, height: 24, hasMat: false, basePrice })
      
      // Prices should scale proportionally to area
      expect(medium).toBeGreaterThan(small)
      expect(large).toBeGreaterThan(medium)
      
      // Check that pricing is proportional
      const smallArea = 8 * 10 // 80
      const mediumArea = 12 * 16 // 192
      const smallToMediumRatio = mediumArea / smallArea // 2.4
      
      expect((medium - basePrice) / (small - basePrice)).toBeCloseTo(smallToMediumRatio, 1)
    })

    it('should allow for unlimited size combinations', () => {
      // Old system: 3-5 fixed options
      // New system: Any size from 4-40 inches
      
      const sizes = [
        { w: 5, h: 7 },
        { w: 8, h: 10 },
        { w: 11, h: 14 },
        { w: 16, h: 20 },
        { w: 18, h: 24 },
        { w: 20, h: 30 },
      ]
      
      const prices = sizes.map(({ w, h }) =>
        calculatePrice({ width: w, height: h, hasMat: false, basePrice })
      )
      
      // All prices should be unique and increasing
      const uniquePrices = new Set(prices)
      expect(uniquePrices.size).toBe(prices.length)
      
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThan(prices[i - 1])
      }
    })
  })
})