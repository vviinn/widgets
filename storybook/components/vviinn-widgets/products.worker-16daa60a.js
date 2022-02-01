import { c as createWorker } from './vpr-slider-7f544733.js';
import './index-42e4cfd6.js';

const workerName = 'products.worker';
const workerMsgId = 'stencil.products.worker';
const workerPath = /*@__PURE__*/new URL('products.worker-ae9180fc.js', import.meta.url).href;
const blob = new Blob(['importScripts("' + workerPath + '")'], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
const worker = /*@__PURE__*/createWorker(url, workerName, workerMsgId);
URL.revokeObjectURL(url);

export { worker, workerMsgId, workerName, workerPath };
