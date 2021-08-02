# image-search



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                          | Type     | Default     |
| -------------- | --------------- | ------------------------------------ | -------- | ----------- |
| `apiPath`      | `api-path`      |                                      | `string` | `undefined` |
| `currencySign` | `currency-sign` | Currency sign will shown after price | `string` | `undefined` |
| `token`        | `token`         | Mediaopt customer token              | `string` | `undefined` |


## Events

| Event             | Description | Type                                         |
| ----------------- | ----------- | -------------------------------------------- |
| `filtersCleared`  |             | `CustomEvent<void>`                          |
| `objectsDetected` |             | `CustomEvent<ValueObject<DetectedObject>[]>` |
| `resetSearchArea` |             | `CustomEvent<void>`                          |


## Shadow Parts

| Part               | Description |
| ------------------ | ----------- |
| `"button"`         |             |
| `"controls"`       |             |
| `"filters"`        |             |
| `"image-selector"` |             |
| `"results"`        |             |


## Dependencies

### Depends on

- [image-view](image-view)
- [search-filters](search-filters)
- [vpr-slider](../vpr-slider)

### Graph
```mermaid
graph TD;
  image-search --> image-view
  image-search --> search-filters
  image-search --> vpr-slider
  image-view --> detected-object-view
  image-view --> highlight-box
  image-view --> image-cropper
  image-cropper --> cropper-handler
  vpr-slider --> vpr-result
  style image-search fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
