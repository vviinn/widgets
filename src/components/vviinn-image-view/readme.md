# vviinn-image-view



<!-- Auto Generated Below -->


## Dependencies

### Used by

 - [vviinn-vps-widget](../vviinn-vps-widget)

### Depends on

- [vviinn-detected-object](vviinn-detected-object)
- [image-cropper](../image-search/image-view/image-cropper)
- [highlight-box](../image-search/image-view/highlight-box)

### Graph
```mermaid
graph TD;
  vviinn-image-view --> vviinn-detected-object
  vviinn-image-view --> image-cropper
  vviinn-image-view --> highlight-box
  image-cropper --> cropper-handler
  vviinn-vps-widget --> vviinn-image-view
  style vviinn-image-view fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
