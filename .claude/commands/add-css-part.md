# Add CSS Part to Component

## Files to modify

1. `/src/cssParts/` — add or update parts list
2. `/src/cssParts/index.ts` — re-export if new file created
3. Component's `.tsx` — add `exportparts` to Host, `part` attributes to elements
4. Parent widget's `.tsx` — include child parts in parent's `exportparts` if nested

## Step-by-step

### 1. Define parts list in `/src/cssParts/`

Follow existing pattern (e.g. `/src/cssParts/product.ts`):

```typescript
export const myComponentPartsList = [
  "my-specific-part-name",
  "my-other-part-name",
];
```

Use specific, non-generic names. Combine with `makeExportPartsString`:

```typescript
export const myComponentParts = makeExportPartsString(
  myComponentPartsList,
  childPartsList, // if component nests other parted components
);
```

### 2. Add to component Host

```typescript
import { myComponentParts } from "../../cssParts";

// In render():
<Host exportparts={myComponentParts}>
```

### 3. Add `part` attribute to target elements

```html
<button part="close-button" class="close">...</button>
```

### 4. If nested in parent widget

Import child parts in parent's cssParts config and include in parent's `makeExportPartsString`.

### 5. Document with JSDoc `@part` annotations on component class
