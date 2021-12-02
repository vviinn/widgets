import { Event, Exception, StackFrame } from "@sentry/browser";

const getExeptionValues = (event: Event): Exception[] => event.exception.values;

const getExeptionStackFrames = (exeption: Exception): StackFrame[] =>
  exeption.stacktrace.frames;

const filterStackFrameByFilename =
  (query: string) =>
    (frame: StackFrame): boolean =>
      frame.filename.includes(query);

const isInternalStackFrame = filterStackFrameByFilename("vviinn");

export const filterInternalExeptions = (event: Event) => {
  const stackFrames = getExeptionValues(event)
    .map(getExeptionStackFrames)
    .flat();

  const isEventInternal = stackFrames.some(isInternalStackFrame);

  return isEventInternal ? event : null;
};
