import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/test-utils'
import { ProductView } from './product-view'

// Mock dependencies
vi.mock('@/trpc/client', () => ({
  useTRPC: () => ({
    products: {
      getOne: {
        queryOptions: vi.fn(),
      },
    },
  }),
}))

vi.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: vi.fn(() => ({
    data: {
      id: 'test-product-1',
      name: 'Test Product',
      price: 100,
      description: null,
      refundPolicy: '30-day',
      reviewRating: 4.5,
      reviewCount: 42,
      isPurchased: false,
      image: {
        url: '/test-image.jpg',
      },
      tenant: {
        name: 'Test Tenant',
        image: {
          url: '/tenant-image.jpg',
        },
      },
      ratingDistribution: {
        1: 5,
        2: 5,
        3: 10,
        4: 20,
        5: 60,
      },
    },
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('../components/cart-button', () => ({
  CartButton: ({ isPurchased }: { isPurchased: boolean }) => (
    <button data-testid="cart-button">
      {isPurchased ? 'View in Library' : 'Add to cart'}
    </button>
  ),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@payloadcms/richtext-lexical/react', () => ({
  RichText: ({ data }: { data: any }) => <div data-testid="rich-text">{JSON.stringify(data)}</div>,
}))

describe('ProductView Component', () => {
  const defaultProps = {
    productId: 'test-product-1',
    tenantSlug: 'test-tenant',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial Rendering', () => {
    it('should render product name', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('should render product image', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      const image = screen.getByAltText('Test Product')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', '/test-image.jpg')
    })

    it('should render tenant information', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByText('Test Tenant')).toBeInTheDocument()
    })

    it('should display review rating and count', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByText('42 ratings')).toBeInTheDocument()
      expect(screen.getByText('4.5')).toBeInTheDocument()
    })

    it('should render refund policy correctly', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByText('30-day guarantee')).toBeInTheDocument()
    })

    it('should render cart button', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByTestId('cart-button')).toBeInTheDocument()
    })
  })

  describe('Price Calculation - Base Price', () => {
    it('should display initial calculated price with default dimensions (8x10)', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      // Base price: 100, Area: 8*10=80, Frame: 80*0.5=40, Total: 140
      // Format: ฿140 (Thai Baht format)
      expect(screen.getByText(/฿140/)).toBeInTheDocument()
    })

    it('should calculate price correctly without mat board', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      // Default: 8x10 = 80 sq.in
      // Frame surcharge: 80 * 0.5 = 40
      // Total: 100 + 40 = 140
      expect(screen.getByText(/฿140/)).toBeInTheDocument()
    })
  })

  describe('Custom Size Input - Width', () => {
    it('should allow changing width within valid range', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      await user.type(widthInput, '12')
      
      expect(widthInput).toHaveValue(12)
    })

    it('should enforce maximum width of 40 inches', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      await user.type(widthInput, '50')
      
      // Should be capped at 40
      await waitFor(() => {
        expect(widthInput).toHaveValue(40)
      })
    })

    it('should enforce minimum width of 4 inches on blur', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      await user.type(widthInput, '2')
      await user.tab() // Trigger blur
      
      await waitFor(() => {
        expect(widthInput).toHaveValue(4)
      })
    })

    it('should handle empty width input and set to 0', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      
      expect(widthInput).toHaveValue(null)
    })

    it('should handle non-numeric width input', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      await user.type(widthInput, 'abc')
      
      // Non-numeric should result in 0
      expect(widthInput).toHaveValue(null)
    })

    it('should update price when width changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      await user.type(widthInput, '16')
      
      // New area: 16*10=160, Frame: 160*0.5=80, Total: 180
      await waitFor(() => {
        expect(screen.getByText(/฿180/)).toBeInTheDocument()
      })
    })
  })

  describe('Custom Size Input - Height', () => {
    it('should allow changing height within valid range', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const heightInput = screen.getByLabelText(/Height/i)
      await user.clear(heightInput)
      await user.type(heightInput, '14')
      
      expect(heightInput).toHaveValue(14)
    })

    it('should enforce maximum height of 40 inches', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const heightInput = screen.getByLabelText(/Height/i)
      await user.clear(heightInput)
      await user.type(heightInput, '45')
      
      await waitFor(() => {
        expect(heightInput).toHaveValue(40)
      })
    })

    it('should enforce minimum height of 4 inches on blur', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const heightInput = screen.getByLabelText(/Height/i)
      await user.clear(heightInput)
      await user.type(heightInput, '3')
      await user.tab()
      
      await waitFor(() => {
        expect(heightInput).toHaveValue(4)
      })
    })

    it('should update price when height changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const heightInput = screen.getByLabelText(/Height/i)
      await user.clear(heightInput)
      await user.type(heightInput, '20')
      
      // New area: 8*20=160, Frame: 160*0.5=80, Total: 180
      await waitFor(() => {
        expect(screen.getByText(/฿180/)).toBeInTheDocument()
      })
    })
  })

  describe('Mat Board Selection', () => {
    it('should render mat board switch', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByText('Add Mat Board')).toBeInTheDocument()
      expect(screen.getByText(/Adds a decorative border/i)).toBeInTheDocument()
    })

    it('should not show mat surcharge when mat is disabled', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      // Should not show the green surcharge text
      const matSurcharge = screen.queryByText(/^\+ ฿/)
      expect(matSurcharge).not.toBeInTheDocument()
    })

    it('should show mat surcharge when mat is enabled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const matSwitch = screen.getByRole('switch')
      await user.click(matSwitch)
      
      // Default 8x10 = 80 sq.in, Mat: 80*0.2 = 16
      await waitFor(() => {
        expect(screen.getByText(/\+ ฿16/)).toBeInTheDocument()
      })
    })

    it('should add mat price to total when enabled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const matSwitch = screen.getByRole('switch')
      await user.click(matSwitch)
      
      // Base: 100, Frame: 40, Mat: 16, Total: 156
      await waitFor(() => {
        expect(screen.getByText(/฿156/)).toBeInTheDocument()
      })
    })

    it('should remove mat price when disabled', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const matSwitch = screen.getByRole('switch')
      // Enable mat
      await user.click(matSwitch)
      await waitFor(() => {
        expect(screen.getByText(/฿156/)).toBeInTheDocument()
      })
      
      // Disable mat
      await user.click(matSwitch)
      await waitFor(() => {
        expect(screen.getByText(/฿140/)).toBeInTheDocument()
      })
    })

    it('should update mat surcharge display when dimensions change', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      // Enable mat first
      const matSwitch = screen.getByRole('switch')
      await user.click(matSwitch)
      
      // Change dimensions
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      await user.type(widthInput, '10')
      
      // New area: 10*10=100, Mat: 100*0.2=20
      await waitFor(() => {
        expect(screen.getByText(/\+ ฿20/)).toBeInTheDocument()
      })
    })
  })

  describe('Combined Price Calculations', () => {
    it('should calculate price correctly with custom size and mat', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      // Set custom size: 12x16
      const widthInput = screen.getByLabelText(/Width/i)
      const heightInput = screen.getByLabelText(/Height/i)
      await user.clear(widthInput)
      await user.type(widthInput, '12')
      await user.clear(heightInput)
      await user.type(heightInput, '16')
      
      // Enable mat
      const matSwitch = screen.getByRole('switch')
      await user.click(matSwitch)
      
      // Area: 12*16=192
      // Frame: 192*0.5=96
      // Mat: 192*0.2=38.4
      // Total: 100+96+38.4=234.4 -> ฿234
      await waitFor(() => {
        expect(screen.getByText(/฿234/)).toBeInTheDocument()
      })
    })

    it('should handle maximum dimensions with mat', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      const heightInput = screen.getByLabelText(/Height/i)
      await user.clear(widthInput)
      await user.type(widthInput, '40')
      await user.clear(heightInput)
      await user.type(heightInput, '40')
      
      const matSwitch = screen.getByRole('switch')
      await user.click(matSwitch)
      
      // Area: 40*40=1600
      // Frame: 1600*0.5=800
      // Mat: 1600*0.2=320
      // Total: 100+800+320=1220
      await waitFor(() => {
        expect(screen.getByText(/฿1,220/)).toBeInTheDocument()
      })
    })

    it('should handle minimum dimensions with mat', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      const heightInput = screen.getByLabelText(/Height/i)
      await user.clear(widthInput)
      await user.type(widthInput, '4')
      await user.tab()
      await user.clear(heightInput)
      await user.type(heightInput, '4')
      await user.tab()
      
      const matSwitch = screen.getByRole('switch')
      await user.click(matSwitch)
      
      // Area: 4*4=16
      // Frame: 16*0.5=8
      // Mat: 16*0.2=3.2
      // Total: 100+8+3.2=111.2 -> ฿111
      await waitFor(() => {
        expect(screen.getByText(/฿111/)).toBeInTheDocument()
      })
    })
  })

  describe('Copy URL Functionality', () => {
    it('should copy URL to clipboard when copy button is clicked', async () => {
      const user = userEvent.setup()
      const writeTextMock = vi.fn()
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      })
      
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)
      
      expect(writeTextMock).toHaveBeenCalledWith(window.location.href)
    })

    it('should show success toast when URL is copied', async () => {
      const user = userEvent.setup()
      const { toast } = await import('sonner')
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(),
        },
      })
      
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)
      
      expect(toast.success).toHaveBeenCalledWith('URL copied')
    })

    it('should disable copy button temporarily after copying', async () => {
      const user = userEvent.setup()
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(),
        },
      })
      
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const copyButton = screen.getByRole('button', { name: /copy/i })
      await user.click(copyButton)
      
      expect(copyButton).toBeDisabled()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero dimensions gracefully', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      
      // Price should be base price only (no surcharge)
      await waitFor(() => {
        expect(screen.getByText(/฿100/)).toBeInTheDocument()
      })
    })

    it('should handle decimal dimensions', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      await user.clear(widthInput)
      await user.type(widthInput, '8.5')
      
      // Area: 8.5*10=85, Frame: 85*0.5=42.5, Total: 142.5 -> ฿143
      await waitFor(() => {
        expect(screen.getByText(/฿14[23]/)).toBeInTheDocument()
      })
    })

    it('should handle rapid dimension changes', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const widthInput = screen.getByLabelText(/Width/i)
      
      // Rapid changes
      await user.clear(widthInput)
      await user.type(widthInput, '10')
      await user.clear(widthInput)
      await user.type(widthInput, '15')
      await user.clear(widthInput)
      await user.type(widthInput, '20')
      
      // Final calculation: 20*10=200, Frame: 100, Total: 200
      await waitFor(() => {
        expect(screen.getByText(/฿200/)).toBeInTheDocument()
      })
    })

    it('should handle toggling mat multiple times', async () => {
      const user = userEvent.setup()
      renderWithProviders(<ProductView {...defaultProps} />)
      
      const matSwitch = screen.getByRole('switch')
      
      // Toggle multiple times
      await user.click(matSwitch) // On
      await user.click(matSwitch) // Off
      await user.click(matSwitch) // On
      
      // Should end in "on" state
      await waitFor(() => {
        expect(screen.getByText(/฿156/)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels for inputs', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByLabelText(/Width/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Height/i)).toBeInTheDocument()
    })

    it('should have accessible mat board switch', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      const matSwitch = screen.getByRole('switch')
      expect(matSwitch).toBeInTheDocument()
      expect(matSwitch).toHaveAccessibleName(/Add Mat Board/i)
    })

    it('should have proper button roles', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  describe('Rating Distribution Display', () => {
    it('should display all 5 star rating bars', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByText('5 star')).toBeInTheDocument()
      expect(screen.getByText('4 star')).toBeInTheDocument()
      expect(screen.getByText('3 star')).toBeInTheDocument()
      expect(screen.getByText('2 star')).toBeInTheDocument()
      expect(screen.getByText('1 star')).toBeInTheDocument()
    })

    it('should display correct percentages for rating distribution', () => {
      renderWithProviders(<ProductView {...defaultProps} />)
      expect(screen.getByText('60%')).toBeInTheDocument() // 5 stars
      expect(screen.getByText('20%')).toBeInTheDocument() // 4 stars
      expect(screen.getByText('10%')).toBeInTheDocument() // 3 stars
      expect(screen.getByText('5%')).toBeInTheDocument() // 2 and 1 stars
    })
  })
})