# mopt-vpr



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                | Type     | Default                  |
| -------------- | --------------- | ------------------------------------------ | -------- | ------------------------ |
| `blockTitle`   | `block-title`   | Title for recommendations widget           | `string` | `'Recommended products'` |
| `columns`      | `columns`       | Number of columns for recommendations      | `number` | `4`                      |
| `currencySign` | `currency-sign` | Currency sign will shown after price       | `string` | `undefined`              |
| `imageRatio`   | `image-ratio`   | Ratio of each recommended product image    | `number` | `1.5`                    |
| `imageWidth`   | `image-width`   | Width of each recommended product image    | `number` | `150`                    |
| `pricePrefix`  | `price-prefix`  | prefix will shown before price             | `string` | `undefined`              |
| `productId`    | `product-id`    | Id of product you need recommendations for | `string` | `undefined`              |
| `token`        | `token`         | Mediaopt customer token                    | `string` | `undefined`              |


## Dependencies

### Depends on

- [vpr-result](vpr-result)

### Graph
```mermaid
graph TD;
  mopt-vpr --> vpr-result
  style mopt-vpr fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
