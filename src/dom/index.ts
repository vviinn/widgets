export const findTarget = (ev: any) => ev?.explicitOriginalTarget ?? ev.path[0];
