# image-cropper



<!-- Auto Generated Below -->


## Events

| Event          | Description | Type                |
| -------------- | ----------- | ------------------- |
| `mouseRelease` |             | `CustomEvent<void>` |


## Methods

### `getSelection() => Promise<Rectangle>`



#### Returns

Type: `Promise<Rectangle>`




## Dependencies

### Used by

 - [image-search](..)

### Depends on

- [cropper-handler](cropper-handler)

### Graph
```mermaid
graph TD;
  image-cropper --> cropper-handler
  image-search --> image-cropper
  style image-cropper fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
