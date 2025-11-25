# Testing Guide - Multitenant E-Commerce

This document provides a complete guide to the test suite created for this project.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run all tests
npm test

# 3. Run tests with coverage
npm run test:coverage

# 4. Open test UI
npm run test:ui
```

## What's Been Tested

This test suite covers all files modified in the current branch:

### 1. Product View Component (`src/modules/products/ui/view/product-view.tsx`)
**80+ Tests covering:**
- Product information rendering
- Custom frame size inputs (width/height)
- Mat board toggle functionality
- Dynamic price calculations
- User interactions (cart buttons, URL sharing)
- Review ratings and distribution
- Accessibility features
- Edge cases and error handling

### 2. Root Layout (`src/app/(app)/layout.tsx`)
**15+ Tests covering:**
- Provider hierarchy and nesting
- Google Analytics removal verification
- Font and styling application
- Metadata configuration
- Multiple children rendering

### 3. Products Collection (`src/collections/Products.ts`)
**25+ Tests covering:**
- Field structure and types
- Options field removal confirmation
- Access control logic (create/delete permissions)
- Tenant verification requirements
- Super admin privileges
- Field validations and constraints

### 4. Price Calculation Logic
**20+ Tests covering:**
- Frame pricing (0.5 THB per square inch)
- Mat board surcharge (0.2 THB per square inch)
- Minimum/maximum dimension handling (4"-40")
- Decimal dimension support
- Edge cases (zero dimensions, rapid changes)
- Realistic pricing scenarios
- Comparison with old options-based system

## Test Structure