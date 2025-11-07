// Operation 인터페이스 정의
interface Operation {
  siteId: string;
  operationId: string;
  name: string;
}

export interface LotHistory {
 
    lotId           : string    
    historySeq?      : number
    
    siteId?          : string | null    
    operationId?     : string | null

    materialId?      : string | null
  
    deleteFlag?      : string | null

    creationDate? : string | null
    startDate? : string | null
    endDate?   : string | null

    operation?    : Operation | null
    }

// LotData 인터페이스 정의
export interface LotStatus {
  lotId: string;
  waferId? : string;
  historySeq: number;
  lotType: string;
  quantity: number;
  materialId: string;
  judgeFlag: string;
  lotStatus: string;
  txUserId: string;
  txUserName: string;
  txComment: string;
  cassetteId: string;
  deleteFlag: string;
  originalDate: string | null;
  creationDate: string;
  originalDueDate: string | null;
  scheduleDueDate: string | null;
  siteInDate: string | null;
  moveinDate: string | null;
  moveOutDate: string | null;
  startDate: string | null;
  operation: Operation;
  history: LotHistory[];
  prevHistory: LotHistory | null;
  firstHistory: LotHistory | null;
  secondProbeHistory: LotHistory | null;
  fabOutHistory: LotHistory | null;
  hanoiCsp: LotStatus | null;
  child: LotStatus | null;
}

export interface ActiveLot {
  lotId: string;
  appendDate: string; // ISO date string
  mesCreationDate: string; // ISO date string
  isActive: boolean;
}

export interface FabApplicationForm {
  modelName: string;
  requesterId: string;
  tegFinishedDate? : string | Date;
  measType? : string
  requester: string;
  designerId: string;
  designer: string;
  designerConfirm: boolean;
  weekNumber: number;
  group: string;
  process: string;
  priority: string;
  packageType: string;
  purpose: string;
  isAoi: boolean;
  idtThickness: number | null;
  destination: string;
  quantity: number;
  code: string;
  wantedFabStartDate: string; // ISO date string
  wantedFabFinishDate: string; // ISO date string
  waferCompany: string;
  waferAngle: string;
  waferThickness: string;
  waferType: string;
  machineName: string;
  hsWaferInfo: string;
  createdDate: string; // ISO date string
  packageName: string | null;
  moldingName: string | null;
  moldingCode: string | null;
  status: string;
  note: string;
  isActive: boolean;
  lotStatus? : LotStatus[] | null;
  lots: any[]; // Assuming lots is an array of unknown objects
  activeLots: ActiveLot[];
  result: any | null; // Assuming result can be of any type or null
}