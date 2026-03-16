// app.js

import { obtenerProductos } from "./feature/cart/implementation.js";
import { handleTheme } from "./feature/theme/index.js";

export function init() {
  obtenerProductos();
  handleTheme();
  window.addEventListener('hashchange', (e) => {
    const { oldURL, newURL } = e;
    const { hash } = new URL(newURL)
    const _HASH = hash.split('#')[1] || '/'
    console.log({e, hash, _HASH})
  })
}
