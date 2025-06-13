# Static Export Configuration 

This file contains instructions for configuring Next.js for static exports.

## Configuration Steps

1. Set `output: 'export'` in `next.config.mjs`
2. Set `unoptimized: true` for images
3. Mark dynamic routes with `export const dynamic = 'force-dynamic'`
4. Create fallback data for API routes
5. Add static authentication for client components

## Handling Auth in Static Exports

For static exports, we use mock authentication data that's only activated during static build:

```js
// In useAuth.ts
if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.buildId === 'static') {
  return createStaticAuthHook();
}
```

## API Routes in Static Export

API routes don't work in static exports, so we need to:

1. Detect static export phase: `if (process.env.NEXT_PHASE === 'phase-export')`
2. Return mock data that represents realistic responses
3. Move client-side data fetching into dedicated hooks

## Deployment

When deploying statically exported app:

1. Build with `npm run build`
2. The static site will be in `out` directory 
3. Serve using any static file server
