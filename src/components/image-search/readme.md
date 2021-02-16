# image-search



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description             | Type     | Default     |
| -------- | --------- | ----------------------- | -------- | ----------- |
| `token`  | `token`   | Mediaopt customer token | `string` | `undefined` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"grid"` |             |


## Dependencies

### Depends on

- [image-selector](../image-selector)
- [image-view](image-view)
- [vpr-slider](../vpr-slider)

### Graph
```mermaid
graph TD;
  image-search --> image-selector
  image-search --> image-view
  image-search --> vpr-slider
  vpr-slider --> vpr-result
  style image-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
