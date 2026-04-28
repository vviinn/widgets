# Add TypeScript Interface Type

## Files to modify

One of the domain files in `/src/interfaces/`:
- `product.ts` — Product items, recommendations, energy efficiency, pricing, streams
- `search.ts` — Visual/text search, product listing, auto-suggest
- `discovery.ts` — Similar products, cross-selling, VPR
- `interactions.ts` — Filters, dynamic filter values, intervals, redirects

**Never import directly from `generated.ts`** — always create domain aliases.

## Pattern

All domain files follow the same pattern (from `product.ts`):

```typescript
type s = import("./generated").components["schemas"];

export type Recommendation = s["response-product-item"];
export type EntityType = Recommendation["entityType"];
export type ProductImage = s["image"];
```

## Steps

1. Find the schema name in `/src/interfaces/generated.ts`
2. Add alias to the appropriate domain file using `s["schema-name"]` syntax
3. Export with a semantic name
4. Update existing code to use the new alias instead of direct schema imports
