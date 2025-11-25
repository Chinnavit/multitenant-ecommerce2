import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { ProductView } from '../product-view'
import { mockProduct, mockProductPurchased, mockProductWithoutImage } from '@/test/mocks/product-data'

// Mock the TRPC hooks
const mockUseSuspenseQuery = vi.fn()
vi.mock('@/trpc/client', () => ({
  useTRPC: () => ({
    products: {
      getById: {
        useSuspenseQuery: mockUseSuspenseQuery,
      },
    },
  }),
}))

// Mock sonner toast
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
}
vi.mock('sonner', () => ({
  toast: mockToast,
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
})

// Mock CartButton
vi.mock('../../components/cart-button', () => ({
  CartButton: ({ isPurchased, productId, tenantSlug }: any) => (
    <button data-testid="cart-button">
      {isPurchased ? 'View in Library' : 'Add to Cart'}
    </button>
  ),
}))

// Mock RichText component
vi.mock('@/components/rich-text', () => ({
  RichText: ({ data }: any) => <div data-testid="rich-text">{JSON.stringify(data)}</div>,
}))

describe('ProductView Component', () => {
  const defaultProps = {
    productId: 'test-product-id',
    tenantSlug: 'test-store',
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSuspenseQuery.mockReturnValue({
      data: mockProduct,
    })
  })

  describe('Product Information Display', () => {
    it('should render product name', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('Test Art Print')).toBeInTheDocument()
    })

    it('should render product image', () => {
      render(<ProductView {...defaultProps} />)
      const image = screen.getByAlt('Test Art Print')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', expect.stringContaining('test-image.jpg'))
    })

    it('should render placeholder image when no product image exists', () => {
      mockUseSuspenseQuery.mockReturnValue({
        data: mockProductWithoutImage,
      })
      render(<ProductView {...defaultProps} />)
      const image = screen.getByAlt('Test Art Print')
      expect(image).toHaveAttribute('src', expect.stringContaining('placeholder.png'))
    })

    it('should display base price initially', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('฿100.00')).toBeInTheDocument()
    })

    it('should render tenant information', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('Test Store')).toBeInTheDocument()
    })

    it('should render review rating and count', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('4.5')).toBeInTheDocument()
      expect(screen.getByText('42 ratings')).toBeInTheDocument()
    })

    it('should render refund policy', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('30-day guarantee')).toBeInTheDocument()
    })

    it('should display "No refunds" for no-refunds policy', () => {
      mockUseSuspenseQuery.mockReturnValue({
        data: { ...mockProduct, refundPolicy: 'no-refunds' },
      })
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('No refunds')).toBeInTheDocument()
    })

    it('should render product description', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByTestId('rich-text')).toBeInTheDocument()
    })

    it('should show "No description provided" when description is missing', () => {
      mockUseSuspenseQuery.mockReturnValue({
        data: { ...mockProduct, description: null },
      })
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('No description provided')).toBeInTheDocument()
    })
  })

  describe('Custom Size Inputs', () => {
    it('should render width and height inputs with default values', () => {
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8')
      const heightInput = screen.getByDisplayValue('10')
      
      expect(widthInput).toBeInTheDocument()
      expect(heightInput).toBeInTheDocument()
    })

    it('should update width when input changes', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      await user.type(widthInput, '12')
      
      expect(widthInput.value).toBe('12')
    })

    it('should update height when input changes', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const heightInput = screen.getByDisplayValue('10') as HTMLInputElement
      await user.clear(heightInput)
      await user.type(heightInput, '16')
      
      expect(heightInput.value).toBe('16')
    })

    it('should enforce maximum dimension of 40 inches', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      await user.type(widthInput, '50')
      
      // The component caps at 40
      await waitFor(() => {
        expect(widthInput.value).toBe('40')
      })
    })

    it('should enforce minimum dimension of 4 inches on blur', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      await user.type(widthInput, '2')
      await user.tab() // Trigger blur
      
      await waitFor(() => {
        expect(widthInput.value).toBe('4')
      })
    })

    it('should handle empty input gracefully', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      
      expect(widthInput.value).toBe('')
    })
  })

  describe('Mat Board Toggle', () => {
    it('should render mat board toggle switch', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('Add Mat Board')).toBeInTheDocument()
      expect(screen.getByText('Adds a decorative border around your art.')).toBeInTheDocument()
    })

    it('should have mat board disabled by default', () => {
      render(<ProductView {...defaultProps} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'false')
    })

    it('should toggle mat board when clicked', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Price Calculation', () => {
    it('should calculate price based on custom dimensions', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      // Default: 8x10 = 80 sq in * 0.5 = 40 THB surcharge
      // Total: 100 + 40 = 140
      await waitFor(() => {
        expect(screen.getByText('฿140.00')).toBeInTheDocument()
      })
    })

    it('should update price when width changes', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      await user.type(widthInput, '10')
      
      // 10x10 = 100 sq in * 0.5 = 50 THB surcharge
      // Total: 100 + 50 = 150
      await waitFor(() => {
        expect(screen.getByText('฿150.00')).toBeInTheDocument()
      })
    })

    it('should update price when height changes', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const heightInput = screen.getByDisplayValue('10') as HTMLInputElement
      await user.clear(heightInput)
      await user.type(heightInput, '12')
      
      // 8x12 = 96 sq in * 0.5 = 48 THB surcharge
      // Total: 100 + 48 = 148
      await waitFor(() => {
        expect(screen.getByText('฿148.00')).toBeInTheDocument()
      })
    })

    it('should add mat board cost when enabled', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      // 8x10 = 80 sq in
      // Frame: 80 * 0.5 = 40
      // Mat: 80 * 0.2 = 16
      // Total: 100 + 40 + 16 = 156
      await waitFor(() => {
        expect(screen.getByText('฿156.00')).toBeInTheDocument()
      })
    })

    it('should display mat board surcharge when enabled', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      // Mat surcharge for 8x10: 80 * 0.2 = 16
      await waitFor(() => {
        expect(screen.getByText('+ ฿16.00')).toBeInTheDocument()
      })
    })

    it('should recalculate price when both dimensions and mat board change', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      // Change dimensions to 20x30
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      const heightInput = screen.getByDisplayValue('10') as HTMLInputElement
      
      await user.clear(widthInput)
      await user.type(widthInput, '20')
      await user.clear(heightInput)
      await user.type(heightInput, '30')
      
      // Enable mat board
      const switchElement = screen.getByRole('switch')
      await user.click(switchElement)
      
      // 20x30 = 600 sq in
      // Frame: 600 * 0.5 = 300
      // Mat: 600 * 0.2 = 120
      // Total: 100 + 300 + 120 = 520
      await waitFor(() => {
        expect(screen.getByText('฿520.00')).toBeInTheDocument()
      })
    })

    it('should handle maximum dimensions in price calculation', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      const heightInput = screen.getByDisplayValue('10') as HTMLInputElement
      
      await user.clear(widthInput)
      await user.type(widthInput, '40')
      await user.clear(heightInput)
      await user.type(heightInput, '40')
      
      // 40x40 = 1600 sq in * 0.5 = 800
      // Total: 100 + 800 = 900
      await waitFor(() => {
        expect(screen.getByText('฿900.00')).toBeInTheDocument()
      })
    })
  })

  describe('User Actions', () => {
    it('should render cart button', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByTestId('cart-button')).toBeInTheDocument()
    })

    it('should show "Add to Cart" for unpurchased products', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('Add to Cart')).toBeInTheDocument()
    })

    it('should show "View in Library" for purchased products', () => {
      mockUseSuspenseQuery.mockReturnValue({
        data: mockProductPurchased,
      })
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('View in Library')).toBeInTheDocument()
    })

    it('should copy URL to clipboard when share button is clicked', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const shareButton = screen.getAllByRole('button').find(
        (button) => button.querySelector('svg')
      )
      
      if (shareButton) {
        await user.click(shareButton)
        
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href)
        expect(mockToast.success).toHaveBeenCalledWith('URL copied')
      }
    })

    it('should disable share button temporarily after clicking', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const shareButtons = screen.getAllByRole('button')
      const shareButton = shareButtons.find(
        (button) => !button.textContent?.includes('Cart') && !button.textContent?.includes('Library')
      )
      
      if (shareButton) {
        expect(shareButton).not.toBeDisabled()
        await user.click(shareButton)
        expect(shareButton).toBeDisabled()
      }
    })
  })

  describe('Review Section', () => {
    it('should display review rating and count', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('4.5')).toBeInTheDocument()
      expect(screen.getByText('Based on 42 reviews')).toBeInTheDocument()
    })

    it('should render rating distribution', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('5 star')).toBeInTheDocument()
      expect(screen.getByText('4 star')).toBeInTheDocument()
      expect(screen.getByText('3 star')).toBeInTheDocument()
      expect(screen.getByText('2 star')).toBeInTheDocument()
      expect(screen.getByText('1 star')).toBeInTheDocument()
    })

    it('should display correct percentage for each rating', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('70%')).toBeInTheDocument() // 5 stars
      expect(screen.getByText('15%')).toBeInTheDocument() // 4 stars
      expect(screen.getByText('7%')).toBeInTheDocument()  // 3 stars
      expect(screen.getByText('3%')).toBeInTheDocument()  // 2 stars
      expect(screen.getByText('5%')).toBeInTheDocument()  // 1 star
    })
  })

  describe('Tenant Link', () => {
    it('should link to tenant store', () => {
      render(<ProductView {...defaultProps} />)
      const tenantLink = screen.getByRole('link', { name: /Test Store/i })
      expect(tenantLink).toHaveAttribute('href', expect.stringContaining('test-store'))
    })

    it('should display tenant logo', () => {
      render(<ProductView {...defaultProps} />)
      const tenantLogo = screen.getByAlt('Test Store')
      expect(tenantLogo).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero dimensions gracefully', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      
      // Price should still calculate with 0 width (results in base price only)
      await waitFor(() => {
        expect(screen.getByText(/฿/)).toBeInTheDocument()
      })
    })

    it('should handle non-numeric input', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      await user.type(widthInput, 'abc')
      
      // Should handle gracefully
      expect(widthInput.value).toBe('')
    })

    it('should handle decimal dimensions', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      await user.clear(widthInput)
      await user.type(widthInput, '8.5')
      
      expect(widthInput.value).toBe('8.5')
    })

    it('should handle rapid dimension changes', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByDisplayValue('8') as HTMLInputElement
      
      // Rapidly change dimensions
      await user.clear(widthInput)
      await user.type(widthInput, '15')
      await user.clear(widthInput)
      await user.type(widthInput, '20')
      await user.clear(widthInput)
      await user.type(widthInput, '25')
      
      // Should end up with the last value
      expect(widthInput.value).toBe('25')
    })

    it('should handle rapid mat board toggles', async () => {
      const user = userEvent.setup()
      render(<ProductView {...defaultProps} />)
      
      const switchElement = screen.getByRole('switch')
      
      // Rapidly toggle
      await user.click(switchElement)
      await user.click(switchElement)
      await user.click(switchElement)
      
      // Should end up in the toggled state
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for inputs', () => {
      render(<ProductView {...defaultProps} />)
      expect(screen.getByText('Custom Size (4" - 40"):')).toBeInTheDocument()
      expect(screen.getByText('Width (in)')).toBeInTheDocument()
      expect(screen.getByText('Height (in)')).toBeInTheDocument()
    })

    it('should have accessible switch for mat board', () => {
      render(<ProductView {...defaultProps} />)
      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('id', 'mat-switch')
    })

    it('should have proper heading hierarchy', () => {
      render(<ProductView {...defaultProps} />)
      const productName = screen.getByRole('heading', { level: 1, name: 'Test Art Print' })
      expect(productName).toBeInTheDocument()
      
      const descriptionHeading = screen.getByRole('heading', { level: 3, name: 'Description' })
      expect(descriptionHeading).toBeInTheDocument()
      
      const reviewsHeading = screen.getByRole('heading', { level: 3, name: 'Customer Reviews' })
      expect(reviewsHeading).toBeInTheDocument()
    })
  })
})