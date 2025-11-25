# Test Suite Documentation

This document describes the comprehensive test suite added to the multitenant-ecommerce project.

## Overview

The test suite uses:
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Extended matchers

## Installation

Install the required test dependencies:

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Or with bun:

```bash
bun add -d vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for a specific file
npm test -- product-view.test.tsx
```

## Test Files

### 1. `src/modules/products/ui/view/product-view.test.tsx`
Comprehensive tests for the ProductView component covering:
- **Initial Rendering** - Verifies all UI elements render correctly
- **Price Calculation** - Tests base price and surcharge calculations
- **Custom Size Input** - Width and height validation (4-40 inches)
- **Mat Board Selection** - Toggle functionality and price impact
- **Combined Calculations** - Complex scenarios with size + mat
- **Copy URL Functionality** - Clipboard and toast notifications
- **Edge Cases** - Zero dimensions, decimals, rapid changes
- **Accessibility** - ARIA labels and roles
- **Rating Display** - Star ratings and distribution

Total: 50+ test cases

### 2. `src/lib/utils.test.ts`
Tests for utility functions:
- **formatCurrency** - Thai Baht formatting, decimals, edge cases
- **generateTenantURL** - Development vs production routing
- **cn** - Class name merging and Tailwind integration

Total: 20+ test cases

### 3. `src/app/(app)/layout.test.tsx`
Tests for the root layout component:
- Component structure and nesting
- Font application
- Provider wrapping (TRPC, NuqsAdapter)
- Google Analytics removal verification
- Metadata validation

Total: 10+ test cases

### 4. `src/collections/Products.test.ts`
Tests for Payload CMS collection configuration:
- **Collection Metadata** - Slug, title, description
- **Access Control** - Create/delete permissions
- **Field Configurations** - All field types and validations
- **Backwards Compatibility** - Options field removal
- **Validation Logic** - Required fields and defaults

Total: 30+ test cases

## Test Coverage

The test suite achieves comprehensive coverage of:
- React components with complex state management
- Pure utility functions
- Configuration objects
- Access control logic
- Price calculation algorithms
- User interactions and event handling
- Edge cases and error conditions

## Key Testing Patterns

### 1. Price Calculation Tests
```typescript
it('should calculate price correctly with custom size and mat', async () => {
  // Area: 12*16=192
  // Frame: 192*0.5=96
  // Mat: 192*0.2=38.4
  // Total: 100+96+38.4=234.4
  expect(screen.getByText(/฿234/)).toBeInTheDocument()
})
```

### 2. User Interaction Tests
```typescript
it('should update price when dimensions change', async () => {
  const user = userEvent.setup()
  const widthInput = screen.getByLabelText(/Width/i)
  await user.clear(widthInput)
  await user.type(widthInput, '16')
  
  await waitFor(() => {
    expect(screen.getByText(/฿180/)).toBeInTheDocument()
  })
})
```

### 3. Boundary Testing
```typescript
it('should enforce maximum width of 40 inches', async () => {
  const user = userEvent.setup()
  const widthInput = screen.getByLabelText(/Width/i)
  await user.type(widthInput, '50')
  
  expect(widthInput).toHaveValue(40)
})
```

## Mocking Strategy

### TRPC Client
```typescript
vi.mock('@/trpc/client', () => ({
  useTRPC: () => ({ /* mock implementation */ })
}))
```

### Next.js Components
```typescript
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}))
```

### External Dependencies
```typescript
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() }
}))
```

## Continuous Integration

Add to your CI pipeline:

```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test
  
- name: Generate coverage
  run: npm run test:coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Best Practices Followed

1. **Descriptive Test Names** - Clear intent and expected behavior
2. **Arrange-Act-Assert** - Structured test organization
3. **Isolation** - Each test is independent
4. **Comprehensive Coverage** - Happy paths, edge cases, errors
5. **Realistic Scenarios** - Tests mirror actual user behavior
6. **Accessibility Testing** - Verify ARIA labels and roles
7. **Performance** - Fast execution with proper cleanup

## Maintenance

- Update tests when modifying components
- Add tests for new features before implementation (TDD)
- Maintain >80% code coverage
- Review test failures promptly
- Keep mocks synchronized with actual implementations

## Troubleshooting

### Common Issues

**Tests timing out:**
```typescript
// Increase timeout for slow operations
it('slow test', { timeout: 10000 }, async () => { /* ... */ })
```

**Mock not working:**
```typescript
// Ensure mocks are defined before imports
vi.mock('./module')
import { Component } from './module'
```

**State not updating:**
```typescript
// Use waitFor for async state updates
await waitFor(() => {
  expect(element).toHaveTextContent('updated')
})
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)