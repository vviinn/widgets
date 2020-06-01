import { p as patchBrowser, b as bootstrapLazy } from './index-ba09a897.js';
import { g as globalScripts } from './app-globals-0f993ce5.js';

patchBrowser().then(options => {
  globalScripts();
  return bootstrapLazy([["vpr-result",[[1,"vpr-result",{"item":[8]}]]],["mopt-vpr",[[1,"mopt-vpr",{"token":[1],"productId":[1,"product-id"],"blockTitle":[1,"block-title"],"recommendations":[32]}]]]], options);
});
