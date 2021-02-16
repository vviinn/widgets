# vpr-slider



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type               | Default     |
| ---------------- | ------------------ | ----------- | ------------------ | ----------- |
| `imageRatio`     | `image-ratio`      |             | `number`           | `1.5`       |
| `imageWidth`     | `image-width`      |             | `number`           | `150`       |
| `mode`           | `mode`             |             | `"auto" \| "grid"` | `undefined` |
| `productsInGrid` | `products-in-grid` |             | `number`           | `4`         |


## Methods

### `loadProducts(products: Recommendation[]) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [image-search](../image-search)
 - [vi-vpr-view](../vpr-view)

### Depends on

- [vpr-result](vpr-result)

### Graph
```mermaid
graph TD;
  vpr-slider --> vpr-result
  image-search --> vpr-slider
  vi-vpr-view --> vpr-slider
  style vpr-slider fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
