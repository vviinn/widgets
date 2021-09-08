# Development
## Automatic interfaces generations

Before running or build project you should generate interfaces.
Use ```npm run build_interfaces``` to generate interface schema from Swagger docs. Docs url should be in .env file as value for OPENAPI_URL key.
Interfaces will be saved to /src/interfaces/generated.ts

## Building

To build the component for production, run:

```bash
npm run build
```

To run the unit tests for the components, run:

```bash
npm test
```
