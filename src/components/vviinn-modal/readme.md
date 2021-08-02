# vviinn-modal



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type      | Default |
| -------- | --------- | ----------- | --------- | ------- |
| `active` | `active`  |             | `boolean` | `false` |


## Events

| Event                    | Description | Type                          |
| ------------------------ | ----------- | ----------------------------- |
| `modalClosed`            |             | `CustomEvent<AnimationEvent>` |
| `secondaryActionClicked` |             | `CustomEvent<void>`           |


## Shadow Parts

| Part                 | Description |
| -------------------- | ----------- |
| `"secondary-action"` |             |
| `"title"`            |             |


## Dependencies

### Used by

 - [vviinn-overlayed-modal](../vviinn-overlayed-modal)

### Graph
```mermaid
graph TD;
  vviinn-overlayed-modal --> vviinn-modal
  style vviinn-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
