import {
  WidgetEventType,
  RESULT_LOAD_EVENT_TYPE,
  RESULT_VIEW_EVENT_TYPE,
} from "./models";

const vprResultLoad: WidgetEventType = {
  widget: "VPR",
  typ: RESULT_LOAD_EVENT_TYPE,
};

const vprResultView: WidgetEventType = {
  widget: "VPR",
  typ: RESULT_VIEW_EVENT_TYPE,
};

const vpcResultLoad: WidgetEventType = {
  widget: "VPC",
  typ: RESULT_LOAD_EVENT_TYPE,
};

const vpcResultView: WidgetEventType = {
  widget: "VPC",
  typ: RESULT_VIEW_EVENT_TYPE,
};

const vpsResultLoad: WidgetEventType = {
  widget: "VPS",
  typ: RESULT_LOAD_EVENT_TYPE,
};

const vpsResultView: WidgetEventType = {
  widget: "VPS",
  typ: RESULT_VIEW_EVENT_TYPE,
};

export {
  vprResultLoad,
  vprResultView,
  vpcResultLoad,
  vpcResultView,
  vpsResultLoad,
  vpsResultView,
};
