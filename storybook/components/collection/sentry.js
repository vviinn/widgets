const getExeptionValues = (event) => { var _a, _b; return (_b = (_a = event === null || event === void 0 ? void 0 : event.exception) === null || _a === void 0 ? void 0 : _a.values) !== null && _b !== void 0 ? _b : []; };
const getExeptionStackFrames = (exeption) => { var _a, _b; return (_b = (_a = exeption === null || exeption === void 0 ? void 0 : exeption.stacktrace) === null || _a === void 0 ? void 0 : _a.frames) !== null && _b !== void 0 ? _b : []; };
const filterStackFrameByFilename = (query) => (frame) => {
  const filename = frame === null || frame === void 0 ? void 0 : frame.filename;
  return filename ? filename.includes(query) : false;
};
const isInternalStackFrame = filterStackFrameByFilename("vviinn");
export const filterInternalExeptions = (event) => {
  const stackFrames = getExeptionValues(event)
    .map(getExeptionStackFrames)
    .flat();
  const isEventInternal = stackFrames.some(isInternalStackFrame);
  return isEventInternal ? event : null;
};
