'use strict';

const vprSlider_entry = require('./vpr-slider-1cee3e7c.js');
require('./index-e4714cef.js');

const workerName = 'products.worker';
const workerMsgId = 'stencil.products.worker';
const workerPath = /*@__PURE__*/(typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __dirname + '/products.worker-c3f8f567.js').href : new URL('products.worker-c3f8f567.js', document.currentScript && document.currentScript.src || document.baseURI).href);
const blob = new Blob(['importScripts("' + workerPath + '")'], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
const worker = /*@__PURE__*/vprSlider_entry.createWorker(url, workerName, workerMsgId);
URL.revokeObjectURL(url);

exports.worker = worker;
exports.workerMsgId = workerMsgId;
exports.workerName = workerName;
exports.workerPath = workerPath;
