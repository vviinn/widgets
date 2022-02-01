var ObjectMemberName;
(function (ObjectMemberName) {
  ObjectMemberName["eform"] = "eform";
  ObjectMemberName["etype"] = "etype";
  ObjectMemberName["form"] = "form";
  ObjectMemberName["href"] = "href";
  ObjectMemberName["method"] = "method";
  ObjectMemberName["accepts"] = "accepts";
  ObjectMemberName["produces"] = "produces";
  ObjectMemberName["rel"] = "rel";
  ObjectMemberName["type"] = "type";
  ObjectMemberName["value"] = "value";
})(ObjectMemberName || (ObjectMemberName = {}));
export const foldValueObject = (i) => {
  switch (i.type) {
    case "array": {
      return i.value.map(foldValueObject);
    }
    default: {
      return i.value;
    }
  }
};
