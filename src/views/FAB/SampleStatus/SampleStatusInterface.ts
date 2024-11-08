export interface FabData {
  idx: number;
  week: string;
  separation: string;
  fabGroup: string;
  band: string;
  productName: string;
  stepNumber: string;
  pl: string;
  spl: string;
  support: string | null;
  purpose: string;
  importance: string;
  fabIn: string;
  fabOut: string;
  material: string;
  maker: string;
  cut: string;
  thick: string;
  waferCount: string;
  runSheet: string | null;
  runSheetDown: string | null;
  readingInTurn: string | null;
  reticleReceivingDate: string | null;
  executeCheck: string;
  comment: string | null;
  note: string | null;
  hideCheck: string;
  developer: string | null;
  lotId: string;
  realFabIn: string | null;
  realFabOut: string | null;
  leadTime: string | null;
  completeCheck: string;
  goalRate: string | null;
  nowProcessPosition: string | null;
  stopTime: string | null;
  machineName: string | null;
  machineState: string | null;
  edc: string | null;
  processComment: string | null;
  processNote: string | null;
  processDoc: string | null;
  processDocDown: string | null;
  developerDoc: string | null;
  developerDocDown: string | null;
  subPlProductionCall: string | null;
  subPlDeveloperCheck: string;
  subPlLeadTime: string | null;
  endProductionCall: string | null;
  engEngCheck: string;
  engLeadTime: string | null;
  fabOutComplete: string;
  deleteFlag: string;
  resultRunSheet: string | null;
  informStatue: string;
  informStatueCheck: string;
  informStatueCheckTime: string | null;
  informCheckText: string | null;
  lastProcessEndTime: string | null;
  currentHoldingFlag: number;
  eqengHoldingTime: number;
  skillHoldingTime: number;
  manufacturerHoldingTime: number;
  hasLastProcess: number;
  currentSeq: number;
  leadTimeStartSeq: number;
  routerLastSeq: number;
  scheduleComment: string | null;
  splLeadTimeComment: string | null;
  schedulerRouterContent: string | null;
  etcHoldingTime: number;
  developerTime: number;
  waitTime: number;
  currentHistorySeq: number;
  fabCardId: number;
  fabCardCheck: boolean;

  assaySite? : string;
  mesFabIn? : string;
  feSite? : string;
  feStart? : string;
  feName? : string
  feOut? : string
  
  isAssay? : boolean
  assayIn? : string
  assayStart? : string
  assayName? : string

}



// Operation Interface
interface Operation {
  site_id: string;
  operation_id: string;
  name: string;
}

// Cassettes Member Interface
interface CassetteMember {
  lot_id: string;
  lot_type: string;
  material_id: string;
  tx_user_id: string;
  tx_user_name: string;
  tx_comment: string;
  cassette_id: string;
  original_date: string;
  creation_date: string;
  original_due_date: string;
  schedule_due_date: string;
  operation: Operation;
  history: any[]; // Define this type based on your actual data structure in history
}

// Main Data Interface
export interface MaterialData {
  material_id: string;
  site_id: string;
  name: string;
  category: string;
  package_type: string;
  process_type: string;
  band: string;
  creator_id: string;
  modifier_id: string | null;
  creation_date: string;
  modify_date: string | null;
  cassettes_member: CassetteMember[];
}


