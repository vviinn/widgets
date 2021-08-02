# vviinn-overlayed-modal



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type      | Default |
| -------- | --------- | ----------- | --------- | ------- |
| `active` | `active`  |             | `boolean` | `false` |


## Events

| Event                    | Description | Type                |
| ------------------------ | ----------- | ------------------- |
| `modalClosed`            |             | `CustomEvent<void>` |
| `secondaryActionClicked` |             | `CustomEvent<void>` |


## Dependencies

### Used by

 - [vviinn-vps-widget](../vviinn-vps-widget)

### Depends on

- [vviinn-overlay](../vviinn-overlay)
- [vviinn-modal](../vviinn-modal)

### Graph
```mermaid
graph TD;
  vviinn-overlayed-modal --> vviinn-overlay
  vviinn-overlayed-modal --> vviinn-modal
  vviinn-vps-widget --> vviinn-overlayed-modal
  style vviinn-overlayed-modal fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
