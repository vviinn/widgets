# Add Prop to Component

## Files to modify

1. Component's `.tsx` — add `@Prop()` with type and JSDoc comment
2. Storybook story (`storybook/stories/*component-name*.stories.tsx`) — add to Template markup and `initArgs`

## Step-by-step

### 1. Add `@Prop()` to component

```typescript
/** Short description of the prop */
@Prop() myProp?: string;
```

- Type explicitly, avoid `any`
- Add JSDoc comment above — required if used in Storybook Playground or behavior is non-obvious
- Use `?` for optional props, set defaults where appropriate

### 2. Update Storybook story (MANDATORY)

Find the story: glob for `storybook/stories/*component-name*.stories.tsx`

If a Playground exists (Template + initArgs):

**a)** Add attribute to Template markup:

```typescript
const Template = (args) => `
  <my-component
    existing-prop="${args.existingProp}"
    my-prop="${args.myProp}"        <!-- add here -->
  ></my-component>
`;
```

**b)** Add default value to `initArgs`:

```typescript
const initArgs = {
  existingProp: "value",
  myProp: "",          // ← add here with sensible default
};
```

### 3. If prop is forwarded to a child component

Make sure the prop is also passed in the render method where the child is rendered.

### 4. Check public docs — see **Public Docs** in `CLAUDE.md`
