import type { User } from "./user";

export interface Bump {
  size : string,
  quantity : number
}

export interface Epoxy {
  modelName : string,
  size : number,
  purpose : string,
  code : string
}

export interface Bom {
  finishedProductSize? : string,
  size? : number,
  package? : string,    
  partNumber? : string,
  shQuantity? : number,
  company? : string,
  price? : string,
  epoxy? : Epoxy,
  bump? : Bump
  className? : string
}

export interface Photo {
  photoProcesses? : PhotoProcess[]
}

export interface PhotoProcess{
  processName : string
  machineName? : string
  reticleName? : string
  isMutable? : boolean
}
 
export interface FabRequestForm {
  photo? : Photo;
  productName?: string;
  requesterId?: string;
  designerId?: string;
  designerConfirm?: boolean;
  weekNumber?: number;
  isAoi?: boolean;
  isDvr?: boolean;
  quantity?: number;
  waferType?: string;
  wantedFabStartDate?: string;
  wantedFabFinishDate?: string;
  purpose?: string;
  destinationId?: string;
  packageId?: string;
  priorityId?: string;
  group?: string;
  bandGroupId? : string;
  band? : string;
  status?: string;
  createdDate?: string;
  trimming?: string;
  hsWaferInfo?: string;
  isNeedSio2Seed? : boolean
  isActive?: boolean;
  filterType? : string;
  note?: string;
  idtMachineId? : string
  waferId?: number;
  waferAngle?: number;
  waferThickness?: number;
  hsTrimingTarget? : number | null;
  freqRange? : string;
  idtId?: number;
  hsId? : number;
  pstId?: number;
  tcId?: number;
  seedId?: number;
  code? : string;
  idtMachineName? : string
  idtProcess? : string;
  passivationId? : number
  bom? : Bom
  wafer? : FabWafer;
  isAllowBridge? : boolean;
  is_idt_xoi? : boolean;
  is_need_extra_shot? : boolean;
  is_tone_inverted? : boolean;
  chip? : {
    hori : number
    verti : number
  };
  chipX? : number
  chipY? : number

  shotX? : number
  shotY? : number
  shot? : {
    hori : number
    verti : number
  };

  requester?: User;
  designer?: User;
  idtProcessId?: string;
  // wafer?: FabWafer[];
  idtType?: IdtType;
  depositionCondi?: string;
  seedLayers? : Layer[]
  passivationLayers? : Layer[]
  idtLayers?: Layer[];
  pstLayers?: Layer[];
  tcLayers?: Layer[];
  hsType? : HsType;
  passivationType? : passivationType[];
}

export interface band {
  bandCombinationId : string;
  label : string;
  bandGroupId : string;
  fabCardName : string;  
}

export interface passivationType {
  passivationId : number;
  name : string;
  layers? : Layer[];  
}

export interface seedType {
  seedId : number;
  name : string;
  layers? : Layer[];
}

export interface SawType {
  sawTypeId?: string;
  isAllowBridge? : boolean;
  wafers?: FabWafer[];
  pstTypes?: PstType[];
  tcTypes?: TcType[];
  idtTypes?: IdtType[];
  seedTypes? : seedType[]
  passivationTypes? : passivationType[]
}

export interface HsType {
  hsId?: number;
  name?: string;
  siliconRotation?: string;
  layers?: Layer[];
  peAngle? : number
}

export interface PstType {
  pstId?: number;
  sawTypeId?: string;
  name?: string;
  layers?: PstLayer[];
  description? : string;
}

export interface PstLayer {
  pstId?: number;
  idx?: number;
  material: string;
}

export interface TcType {
  tcId?: number;
  name?: string;
  layers?: PstLayer[];
}


export interface idtProcess {
  idtProcessId?: string;
}

export interface IdtType {
  idtId?: number;
  name?: string;
  idtProcesses?: idtProcess[];
  
  sawTypeId?: string;
  layers?: Layer[];
  idtMachines?: IdtMachine[];
}

export interface IdtMachine {
  machineName?: string;
}

export interface FabWafer {
  waferId?: number;
  sawTypeId?: string;
  waferType?: string;
  waferCompany?: string;
  size?: number;
  recommendedThicknesses?: FabRecommendationWaferThickness[];
  recommendedAngles? : FabRecommendationWaferAngle[];
  hsTypes? : HsType[]
}

export interface FabRecommendationWaferThickness {
  waferThickness: number;
}

export interface FabRecommendationWaferAngle {
  waferAngle: number;
}

export interface FabWaferRecommendation {
  waferId?: number;
  waferThickness: number;
  waferAngle: number;
}

export interface Layer {
  idx?: number;
  thickness?: number;
  material?: string;  
}
