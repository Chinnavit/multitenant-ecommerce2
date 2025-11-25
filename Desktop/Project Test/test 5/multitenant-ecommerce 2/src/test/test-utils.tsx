import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * Creates a QueryClient configured for tests.
 *
 * Configures queries to not retry on failure and to be immediately eligible for garbage collection.
 *
 * @returns A new `QueryClient` instance with `queries.retry` set to `false` and `queries.gcTime` set to `0`.
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
}

interface AllTheProvidersProps {
  children: React.ReactNode
}

/**
 * Wraps children with a QueryClientProvider backed by a fresh test QueryClient.
 *
 * The created QueryClient has query defaults suitable for tests (retry disabled, `gcTime` set to 0).
 *
 * @param children - Elements to render inside the provider
 * @returns The children wrapped in a QueryClientProvider using a test QueryClient
 */
export function AllTheProviders({ children }: AllTheProvidersProps) {
  const testQueryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  )
}

/**
 * Renders a React element within the test QueryClient provider.
 *
 * @param ui - The React element to render
 * @param options - Additional render options (the `wrapper` option is omitted)
 * @returns The render result returned by React Testing Library (`container`, query helpers, etc.)
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { renderWithProviders as render }