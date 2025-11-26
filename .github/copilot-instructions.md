# Copilot Instructions for Ruralize Shop

## Project Overview

**Ruralize Shop** is a Next.js 16 marketplace for rural products. It's a server-side rendered e-commerce platform with dynamic product pages, a shopping cart system, and seller integration via `empresaId` routing.

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + PostCSS, shadcn/ui components (Radix UI)
- **Image Hosting**: Cloudinary (remote images configured in `next.config.ts`)
- **Package Manager**: npm
- **UI Components**: Embla Carousel, Lucide React icons

## Architecture & Data Flow

### Core Structure
```
app/
  ├── layout.tsx          # Root layout with CartProvider
  ├── page.tsx            # Homepage - fetches all products
  ├── components/         # Reusable UI components ("use client" marked)
  ├── context/            # CartContext for global cart state
  ├── types/              # TypeScript types (Product, ProductOption)
  ├── produto/[empresaId]/[id]/  # Dynamic product detail pages
  ├── carrinho/           # Shopping cart page
  └── produtos/           # Products listing page
components/ui/           # Shadcn UI primitives (avatar, badge, button, card, carousel, etc.)
```

### Data Flow Pattern
1. **Server-side Fetching**: Home page and product detail pages use server components with `fetch()` and ISR (`revalidate: 5`)
2. **Client-side Cart State**: CartContext (React Context) manages cart globally in client components
3. **Multi-seller Support**: Products linked by `empresaId` (seller ID) + product `id` via URL params

### API Integration
- **Base URL**: `process.env.NEXT_PUBLIC_API_URL`
- **Endpoints**: 
  - `GET /products` - all products (homepage)
  - `GET /products/{empresaId}/{id}` - single product details
- Products are fetched with 5-second ISR revalidation

### Cart System
- **Type**: `CartItem` includes `id`, `name`, `price`, `image`, `quantity`, `sellerId`
- **Operations**: add, remove, update quantity, clear
- **Product Mapping**: UI uses `product.titulo` (title), `product.preco` (price), `product.foto` (main image)
- **Persistence**: Currently in-memory (no localStorage implemented yet)

## Critical Developer Workflows

### Development
```bash
npm run dev    # Start dev server at http://localhost:3000
npm run build  # Next.js production build
npm start      # Run production server
npm run lint   # Run ESLint (Next.js defaults + TypeScript)
```

### Common Tasks
- **Modify Layout**: Edit `app/layout.tsx` (affects all pages)
- **Add New Page**: Create file in `app/` (e.g., `app/about/page.tsx`)
- **Add Dynamic Route**: Follow pattern in `app/produto/[empresaId]/[id]/page.tsx`
- **Add UI Component**: Use shadcn pattern in `components/ui/` (Radix UI + Tailwind)
- **Update Cart Logic**: Modify `app/context/cartContext.tsx` and `app/components/addToCart.tsx`

## Key Patterns & Conventions

### Server vs Client Components
- **Server Components** (default): Use for data fetching, page layouts
  - Example: `app/page.tsx`, `app/produto/[empresaId]/[id]/page.tsx`
- **Client Components** (marked `"use client"`): For interactivity, context providers
  - Example: `app/context/cartContext.tsx`, `app/components/addToCart.tsx`, `app/components/navbar.tsx`

### Routing Conventions
- **Dynamic segments**: `[param]` in folder names → available in `params` prop
- **Multi-segment routes**: Nested folders create nested routes (e.g., `produto/[empresaId]/[id]/page.tsx`)
- **URL structure**: `/produto/{empresaId}/{id}` - seller ID comes first, then product ID

### Styling
- **Utility-first**: Tailwind classes directly in JSX
- **Color scheme**: Green primary (`bg-green-600`, `text-green-700`), grays for secondary
- **Responsive**: `hidden md:flex` for mobile-first, Tailwind breakpoints (`sm`, `md`, `lg`)
- **Component variants**: shadcn components use CVA (class-variance-authority) for variants

### Image Handling
- Use Next.js `Image` component with `fill` + `object-cover` for product images
- Remote images only from Cloudinary (pre-configured in `next.config.ts`)
- Fallback: `/placeholder.png` when image unavailable
- Product objects may have `fotos` (array) or `foto` (single) - handle both

### Type Definitions
```typescript
// Key types in app/types/product.ts
Product: { id, titulo, foto, descricao, preco, categoria, estoque, options?, empresaId? }
CartItem: { id, name, price, image, quantity, sellerId }
ProductOption: { id, name, suboptions[] }
```
- **Portuguese naming**: API uses Portuguese field names (`titulo`, `preco`, `descricao`, `estoque`)
- Always handle optional fields (e.g., `descricao?`, `options?`)

### Navigation & Linking
- Use Next.js `Link` component for internal routes
- Mobile menu uses Radix `Sheet` component for responsive drawer
- Cart link: `/carrinho`, Categories: `/categorias`, Login: `/login`

## Integration Points & Dependencies

### External Dependencies
- **Cloudinary**: Image CDN (configured hostname only)
- **Radix UI**: Unstyled accessible components (Button, Card, Badge, Sheet, Dropdown, etc.)
- **Embla Carousel**: For potential product image galleries (installed but may not be used yet)
- **Lucide React**: Icon library (currently using `Menu` icon in navbar)

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API base URL (required for data fetching)

### Styling Integrations
- **Tailwind 4** with new `@tailwindcss/postcss` (not legacy)
- **PostCSS**: Autoprefixer + Tailwind configured
- **tw-animate-css**: Animation utilities available

## Common Gotchas & Best Practices

1. **Dynamic Params in Server Components**: Use `await params` before destructuring (Next.js 16 pattern)
2. **Error Handling**: Product detail page has null check with fallback UI
3. **Stock Display**: Both estoque (inventory) and availability checks are critical for UX
4. **Image Arrays**: Handle both single `foto` and multiple `fotos` - use optional chaining
5. **Context Usage**: `useCart()` hook must be inside `CartProvider` (error thrown if not)
6. **Next.js Config**: Cloudinary remote pattern is required for image optimization
7. **Price Formatting**: Use `.toFixed(2)` for Brazilian Real (R$) display
8. **Responsive Design**: Always test mobile (menu collapses on sm breakpoint)

## Files to Reference When Modifying

- **Cart State**: `app/context/cartContext.tsx`, `app/components/addToCart.tsx`
- **Product Display**: `app/components/productCard.tsx`, `app/page.tsx`
- **Dynamic Routes**: `app/produto/[empresaId]/[id]/page.tsx` (template for multi-param routes)
- **UI Styling**: `app/globals.css` (Tailwind imports), `components/ui/` (component patterns)
- **Layout**: `app/layout.tsx` (CartProvider wrapper, navbar/footer)
- **Navigation**: `app/components/navbar.tsx` (responsive menu, links structure)

