import { c as createWorker } from './vpr-slider-85482b30.js';
import './index-d92b0799.js';

const workerName = 'products.worker';
const workerMsgId = 'stencil.products.worker';
const workerPath = /*@__PURE__*/new URL('products.worker-c3f8f567.js', import.meta.url).href;
const blob = new Blob(['importScripts("' + workerPath + '")'], { type: 'text/javascript' });
const url = URL.createObjectURL(blob);
const worker = /*@__PURE__*/createWorker(url, workerName, workerMsgId);
URL.revokeObjectURL(url);

export { worker, workerMsgId, workerName, workerPath };
