# mopt-vpr



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                | Type      | Default                  |
| -------------- | --------------- | ------------------------------------------ | --------- | ------------------------ |
| `blockTitle`   | `block-title`   | Title for recommendations widget           | `string`  | `'Recommended products'` |
| `columns`      | `columns`       | Number of columns for recommendations      | `number`  | `4`                      |
| `currencySign` | `currency-sign` | Currency sign will shown after price       | `string`  | `undefined`              |
| `imageRatio`   | `image-ratio`   | Ratio of each recommended product image    | `number`  | `1.5`                    |
| `imageWidth`   | `image-width`   | Width of each recommended product image    | `number`  | `150`                    |
| `pricePrefix`  | `price-prefix`  | prefix will shown before price             | `string`  | `undefined`              |
| `productId`    | `product-id`    | Id of product you need recommendations for | `string`  | `undefined`              |
| `sliderMode`   | `slider-mode`   | Use slider or grid view                    | `boolean` | `false`                  |
| `token`        | `token`         | Mediaopt customer token                    | `string`  | `undefined`              |


## Dependencies

### Depends on

- [vpr-slidable](../vpr-slidable)
- [vpr-result](vpr-result)

### Graph
```mermaid
graph TD;
  mopt-vpr --> vpr-slidable
  mopt-vpr --> vpr-result
  vpr-slidable --> slider-mouse
  style mopt-vpr fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
