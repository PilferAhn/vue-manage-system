export interface ProcessData {
  uuid?: string;
  group?: string; // GROUP
  process?: string; // 공정
  priority?: string; // Priority
  packageType?: string; // Package Type
  modelName?: string; // Model name
  purpose?: string; // Purpose
  isAoi?: boolean; // is AOI(BOOL)
  destination?: string; // Destination
  quantity?: number; // Quantity
  code?: string; // code?
  fabInsertDate?: string; // FAB Insert date
  fabFinishDate?: string; // FAB finish date
  waferCompany?: string; // Wafer company
  waferAngle?: string; // Wafer angle
  waferThickness?: string; // Wafer think
  waferType?: string; // Wafer type
  machineName?: string; // machine name
  condition?: string;

  designer_confirm?: string;

  expect_start_date?: string;
  expect_finish_date?: string;

  wanted_start_date?: string;
  wanted_finish_date?: string;

  real_start_date?: string;
  real_finish_date?: string;

  designer? : string;
  designerId? : string;

  requester? : string;
  requesterId? : string;

}
