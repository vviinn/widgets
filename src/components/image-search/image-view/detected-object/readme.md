# detected-object-view



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute | Description | Type                                                                  | Default     |
| ---------------- | --------- | ----------- | --------------------------------------------------------------------- | ----------- |
| `detectedObject` | --        |             | `Valueable<DetectedObject> & Partial<MemberObject> & Partial<Linked>` | `undefined` |
| `referenceImage` | --        |             | `HTMLImageElement`                                                    | `undefined` |


## Events

| Event                    | Description | Type               |
| ------------------------ | ----------- | ------------------ |
| `detectedObjectSelected` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [image-view](..)

### Graph
```mermaid
graph TD;
  image-view --> detected-object-view
  style detected-object-view fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
