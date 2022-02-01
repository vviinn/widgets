export class GtagAnalytics {
  sendImpression(product) {
    var _a, _b, _c;
    gtag('event', 'view_item_list', {
      items: [
        {
          id: product.productId,
          name: product.title,
          brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
          category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
          list_name: 'VI VPR View',
          price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
        }
      ]
    });
    return undefined;
  }
  sendClick(product) {
    var _a, _b, _c;
    gtag('event', 'select_content', {
      content_type: 'product',
      items: [
        {
          id: product.productId,
          name: product.title,
          brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
          category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
          list_name: 'VI VPR View',
          price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
        }
      ]
    });
    return undefined;
  }
}
