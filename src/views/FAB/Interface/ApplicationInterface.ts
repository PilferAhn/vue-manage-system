import type {LotData} from "./mes-interface"

export interface ProcessData {
  uuid?: string;
  id? : string;
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
  idtThickness? : string;
  packageName? : string;
  moldingName? : string;
  moldingCode? : string
  designerConfirm?: string;
  weekNumber? : number;
  createdData? : string;
  expectStartDate?: string;
  expectFinishDate?: string;
  hsWaferInfo? : string;
  wantedFabStartDate?: string;
  wantedFabFinishDate?: string;

  realStartDate?: string;
  realFinishDate?: string;

  designer? : string;
  designerId? : string;

  requester? : string;
  requesterId? : string;
  lotStatus ? : LotData[];
  maxHistorySeq? : number
  hanoiIndex? : number
  hanoiOperation? : string;
  hanoiOperationStart? : string;
  hanoiSiteIn? : string;

  feIndex? :number
  feOperation? : string;
  feOperationStart? : string;
  feSiteIn? : string;

  status? : string;
  note? : string;
  result? : string;


}
