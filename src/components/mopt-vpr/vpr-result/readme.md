# vpr-result



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description | Type                                                                                                                                                                                                  | Default     |
| ------------ | ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `imageRatio` | `image-ratio` |             | `number`                                                                                                                                                                                              | `1.5`       |
| `imageWidth` | `image-width` |             | `number`                                                                                                                                                                                              | `100`       |
| `item`       | --            |             | `{ productId?: string; title?: string; brand?: string; productType?: string; deeplink?: string; image?: { original?: string; thumbnail?: string; }; price?: { actual?: number; retail?: number; }; }` | `undefined` |


## Events

| Event                 | Description                                                  | Type                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `recommendationClick` | Event fires ones when user click on deeplink                 | `CustomEvent<{ productId?: string; title?: string; brand?: string; productType?: string; deeplink?: string; image?: { original?: string; thumbnail?: string; }; price?: { actual?: number; retail?: number; }; }>` |
| `recommendationLoad`  | Event fires ones when recommendation rendered on page        | `CustomEvent<{ productId?: string; title?: string; brand?: string; productType?: string; deeplink?: string; image?: { original?: string; thumbnail?: string; }; price?: { actual?: number; retail?: number; }; }>` |
| `recommendationView`  | Event fires ones when recommendation appears on the viewport | `CustomEvent<{ productId?: string; title?: string; brand?: string; productType?: string; deeplink?: string; image?: { original?: string; thumbnail?: string; }; price?: { actual?: number; retail?: number; }; }>` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"product"` |             |


## Dependencies

### Used by

 - [mopt-vpr](..)

### Graph
```mermaid
graph TD;
  mopt-vpr --> vpr-result
  style vpr-result fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
