# Browser Test Widget

Dev server must be running (`npm start`). URL: `https://localhost:3333/`

Tools come from the Playwright plugin (`mcp__plugin_playwright_playwright__*`).

## Shadow DOM access

Playwright locators pierce open shadow roots, so elements from `browser_snapshot` can be clicked by ref. For state the snapshot doesn't show, use `browser_evaluate`:

```javascript
() => {
  const component = document.querySelector("vviinn-shop-the-look");
  component.shadowRoot.querySelector(".swiper-button-next").click();
}
```

## Workflow

1. `browser_navigate` → `https://localhost:3333/`
2. `browser_take_screenshot` — check visual state
3. `browser_snapshot` + `browser_click` / `browser_evaluate` — interact with Shadow DOM elements
4. `browser_console_messages` — check for errors
5. `browser_network_requests` — check failed requests
