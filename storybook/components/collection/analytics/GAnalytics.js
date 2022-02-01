export class GAnalytics {
  constructor() {
    ga('require', 'ec');
  }
  convertProduct(product) {
    var _a, _b, _c;
    return {
      id: product.productId,
      name: product.title,
      brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
      category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
      list: 'VI VPR View',
      price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
    };
  }
  sendImpression(product) {
    ga('ec:addImpression', this.convertProduct(product));
    return undefined;
  }
  sendClick(product) {
    var _a, _b, _c;
    ga('ec:addProduct', {
      id: product.productId,
      name: product.title,
      brand: (_a = product.brand) !== null && _a !== void 0 ? _a : '',
      category: (_b = product.productType) !== null && _b !== void 0 ? _b : '',
      price: Math.min(...[product.price.actual, (_c = product.price.sale) !== null && _c !== void 0 ? _c : Infinity])
    });
    ga('ec:setAction', 'click', { list: 'VI VPR View' });
    return undefined;
  }
}
