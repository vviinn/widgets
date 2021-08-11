# image-view



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description | Type      | Default |
| --------- | --------- | ----------- | --------- | ------- |
| `loading` | `loading` |             | `boolean` | `false` |


## Events

| Event                    | Description | Type                         |
| ------------------------ | ----------- | ---------------------------- |
| `cropAreaChanged`        |             | `CustomEvent<Point & Sized>` |
| `detectedObjectSelected` |             | `CustomEvent<Point & Sized>` |
| `imageContainerResized`  |             | `CustomEvent<void>`          |


## Dependencies

### Depends on

- [detected-object-view](detected-object)
- [highlight-box](highlight-box)
- [image-cropper](image-cropper)

### Graph
```mermaid
graph TD;
  image-view --> detected-object-view
  image-view --> highlight-box
  image-view --> image-cropper
  image-cropper --> cropper-handler
  style image-view fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
