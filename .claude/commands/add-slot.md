# Add Slot to Component

## Files to modify

1. `src/components/customized-slots.tsx` — slot names array, `isElementChildTag`, `getSlotNamesList`
2. Component's `.tsx` — call `slotChangeListener` in `componentWillLoad`
3. Parent widget's Storybook story — document child slots for Playground visibility

## Step-by-step

### 1. Add slot name to array in `customized-slots.tsx`

Find the appropriate array (or create one):

```typescript
// Existing arrays: vpsSlotNames, vprSlotNames, filtersSlotNames,
// suggestionsSlotNames, productCardSlotNames
const vpsSlotNames: string[] = [
  "vviinn-teaser-text",
  "vviinn-my-new-slot",  // ← add here
];
```

### 2. Include in `getSlotNamesList` if new array

```typescript
const getSlotNamesList = (renderType: RenderType) => {
  switch (renderType) {
    case "search": {
      return [...vpsSlotNames, ...myNewSlotNames];
    }
  }
};
```

### 3. Add component tag to `isElementChildTag` for nested propagation

```typescript
const isElementChildTag = [
  "VVIINN-PRODUCT-CARD",
  "VVIINN-MY-COMPONENT",  // ← uppercase tag name
].includes(elementTagName);
```

### 4. Register listener in component

```typescript
import { slotChangeListener } from "../customized-slots";

componentWillLoad() {
  slotChangeListener(this, this.el);
}
```

### 5. Document child slots in parent widget's Storybook story

### 6. Check public docs — see **Public Docs** in `CLAUDE.md`
