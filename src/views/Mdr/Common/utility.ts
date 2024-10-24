import { MdrApplication } from "./Interface";

export function initializeMdrApplication(): MdrApplication {
  return {
    id: undefined,
    weekNumber: undefined,
    productName: undefined,
    category: undefined,
    packageType: undefined,
    waferType: undefined,
    band: undefined,
    size: undefined,
    moduleName: undefined,
    designer: undefined,
    designerId: undefined,
    group: undefined,
    psNumber: undefined,
    ganttPlanDate: undefined,
    executionDate: undefined,
    result: undefined,
    note: undefined,
    status : "created",
  };
}



