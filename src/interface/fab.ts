export interface FabExcel {
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
  fabLotStatusExcel? : FabLotStatusExcel[]
}

export interface FabLotStatusExcel {
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
  filpBondingOperation?: string;
  filpBondingTime?: string;
  packageOperation?: string;
  packageTime?: string;
  assyOperation?: string;
  assyTime?: string;  
  finalShipmentOperation?: string;
  finalShipmentTime?: string;
  assyIn? : string;
}
