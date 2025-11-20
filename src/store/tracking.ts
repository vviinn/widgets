// Simple tracking state module (not a Stencil Store - no reactivity needed)

let trackingEnabled = true;

export const isTrackingEnabled = () => trackingEnabled;

export const disableTracking = () => (trackingEnabled = false);

export const enableTracking = () => (trackingEnabled = true);
