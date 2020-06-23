![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)
# Mediaopt Visual Product Recommendations component

## Using this component

- Put a script tag similar to this `<script src='https://unpkg.com/mediaopt-vpr@latest/dist/medaopt-vpr/medaopt-vpr.js'></script>` in the head of your index.html
- Then you can use the element anywhere in your template with `<mopt-vpr></mopt-vpr>` tag
- Use attributes for provide credentials or customize component view

### Component's properties

| Property     | Attribute     | Description                                | Type     | Default                  |
| ------------ | ------------- | ------------------------------------------ | -------- | ------------------------ |
| `blockTitle` | `block-title` | Title for recommendations widget           | `string` | `'Recommended products'` |
| `columns`    | `columns`     | Number of columns for recommendations      | `number` | `4`                      |
| `imageRatio` | `image-ratio` | Ratio of each recommended product image    | `number` | `1.5`                    |
| `imageWidth` | `image-width` | Width of each recommended product image    | `number` | `150`                    |
| `productId`  | `product-id`  | Id of product you need recommendations for | `string` | `undefined`              |
| `token`      | `token`       | Mediaopt customer token                    | `string` | `undefined`              |

## Development
### Automatic interfaces generations

Before running or build project you should generate interfaces.
Use ```npm run build_interfaces``` to generate interface schema from Swagger docs. Docs url should be in .env file as value for OPENAPI_URL key.
Interfaces will be saved to /src/interfaces/generated.ts

### Building

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```
