# Browser Test Widget

Dev server must be running (`npm start`). URL: `https://localhost:3333/`

## Shadow DOM access

Standard selectors don't work with Stencil Shadow DOM. Use `puppeteer_evaluate`:

```javascript
const component = document.querySelector("vviinn-shop-the-look");
component.shadowRoot.querySelector(".swiper-button-next").click();
```

## Workflow

1. `mcp__browser__puppeteer_navigate` → `https://localhost:3333/`
2. `mcp__browser__puppeteer_screenshot` — check visual state
3. `mcp__browser__puppeteer_evaluate` — interact with Shadow DOM elements
4. `mcp__browser-tools__getConsoleErrors` — check for errors
5. `mcp__browser-tools__getNetworkErrors` — check failed requests
