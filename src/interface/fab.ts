import type {LotStatus} from "./mes-interface"

export interface ModifiedFabDataInterface {
  no?: string;
  weekNumber?: number;
  modelName?: string;
  designer?: string;
  requester?: string;
  lotQuantity?: number;
  wantedFabStartDate?: string;
  wantedFabFinishDate?: string;
  fabOutDate?: string;
  whcDevelopmentTeamReceiving?: string;
  fabLotStatusExcel? : ModifiedFabLotDataInterface[]
  isAlarm? : boolean | false
  
}

export interface ModifiedFabLotDataInterface {
  lotId?: string;
  fabInsertDate?: string
  fabOutPlannedDate?: string;
  currentOperationTime?: string;
  currentOperationName? : string
  whcExpectedShipmentDate?: string;
  whcShipmentDate?: string;
  whcArrivalDate?: string;
  assyInPlannedDate?: string;
  assyInDate?: string;
  flipBondingOperation?: string;
  flipBondingTime?: string;
  packageOperation?: string;
  packageTime?: string;
  assyOperation?: string;
  assyTime?: string;  
  finalShipmentOperation?: string;
  finalShipmentTime?: string;
  assyIn? : string;
}



export interface FabApplicationInterface {
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
  lotStatus ? : LotStatus[];
  maxHistorySeq? : number
  hanoiIndex? : number
  hanoiOperation? : string;
  hanoiOperationStart? : string;
  hanoiSiteIn? : string;
  hanoiStep? : string;
  hanoiTransite? : boolean

  feIndex? :number
  feOperation? : string;
  feOperationStart? : string;
  feSiteIn? : string;
  estToHanoi? : string

  status? : string;
  note? : string;
  result? : string;

  step1Operation? : string;
  step1OperationStart? : string;
  step1SiteIn? : string;
  step1LotId? : string;

  step2Operation? : string;
  step2OperationStart? : string;
  step2SiteIn? : string;
  step2LotId? : string;

  step3Operation? : string;
  step3OperationStart? : string;
  step3SiteIn? : string;
  step3LotId? : string;

  step4Operation? : string;
  step4OperationStart? : string;
  step4SiteIn? : string;
  step4LotId? : string;

  step5Operation? : string;
  step5OperationStart? : string;
  step5SiteIn? : string;
  step5LotId? : string;

}
