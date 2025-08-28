type s = import("./generated").components["schemas"];

// Product Items
export type Recommendation = s["response-product-item"];

// Energy Efficiency
export type EnergyEfficiencyClass = s["energy-efficiency-class"];
export type EnergyCertification = s["energy-certification"];
export type EnergyClassIconDirection =
  keyof s["energy-certification"]["classIconUrls"];

// Pricing
export type BasePrice = s["basePrice"];

// Stream
export type ContextAnnotation = s["context-annotation"];
export type ContextAnnotationDataProducts = s["context-annotation-data-products"];
export type Interactions = s["interactions"];
export type StreamItem = s["stream-item"];
