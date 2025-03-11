import type { User } from "./user";

export interface Bump {
  size: string;
  quantity: number;
}

export interface Epoxy {
  modelName: string;
  size: number;
  purpose: string;
  code: string;
}

export interface BomCode {
  MATNR?: string;
  MAKTX?: string;
  MEINS?: string;
  UMREN?: string;
  DISPO?: string;
}

export interface Bom {
  className?: string;
  finishedProductSize?: string;
  package?: string;
  partNumber?: string;
  shQuantity?: number;
  company?: string;
  price?: string;
  epoxy?: Epoxy;
  bump?: Bump;
  assyName?: string;
  pkgTopAuThickness?: string;
  pkgSize?: string;
  pkgCompany?: string;
  usdAverage?: string;
  krwAverage?: string;
}

export interface Photo {
  photoProcesses?: PhotoProcess[];
}

export interface PhotoProcess {
  processName: string;
  machineName?: string;
  reticleName?: string;
  isMutable?: boolean;
  order?: number;
}

export interface FabRequestForm {
  photo?: Photo;
  waferCode?: string;
  customerId?: string;
  productName?: string;
  bomMainCode?: string;
  isNewBom?: boolean;
  assyChipQuantity?: number;
  isNewBom2?: boolean;
  requesterId?: string;
  designerId?: string;
  designerConfirm?: boolean;
  weekNumber?: number;
  isAoi?: boolean;
  isDv2?: boolean;
  isGfl?: boolean;
  isCap?: boolean;
  isPadDl?: boolean;
  isMoreEnergy?: boolean;
  isRrPs2?: boolean;
  isMst?: boolean;
  isPending?: boolean;
  isFabCardCreated?: boolean;
  dateOfFabCardCreated?: string;
  maskTurn?: string | number;
  maskCd?: string | number;
  aspectRatio?: string | number;
  isAlPad?: boolean;
  gflThickness?: string | number;
  mstThickness? : string | number;
  quantity?: number;
  waferType?: string;
  wantedFabStartDate?: string;
  wantedFabFinishDate?: string;
  purpose?: string;
  destinationId?: string;
  packageId?: string;
  priorityId?: string;
  group?: string;
  bandGroupId?: string;
  isFreeWafer?: boolean;
  isNeededLtEtching?: boolean;
  band?: string;
  status?: string;
  createdDate?: string;
  trimming?: string;
  hsWaferInfo?: string;
  isNeedSio2Seed?: boolean;
  hasBridge?: boolean;
  isActive?: boolean;
  filterType?: string;
  tcMachineName?: string;
  note?: string;
  idtMachineId?: string;
  idt2MachineId?: string;
  waferId?: number;
  waferAngle?: number;
  waferThickness?: number;
  hsTrimingTarget?: number | null;
  freqRange?: string;
  idtId?: number;
  idt2Id?: number;
  hsId?: number;
  pstId?: number;
  tcId?: number;
  seedId?: number;
  code?: string;
  idtMachineName?: string;
  idt2MachineName?: string;
  idtProcess?: string;
  passivationId?: number;
  bom?: Bom;
  bom2?: Bom;
  samplePurpose?: string;
  samplePurposeDetail?: string;
  wafer?: FabWafer;
  isAllowBridge?: boolean;
  isIdtOxi?: boolean;
  isNeedExtraShot?: boolean;
  isSeedSio2?: boolean;
  isToneInverted?: boolean;
  isDualIdt?: boolean;
  photoNote?: string;
  metalNote?: string;
  dielectricLayerNote?: string;
  bpThicknessNote?: string;
  bpProbeNote?: string;
  paNote?: string;
  etchingNote?: string;
  chip?: {
    hori: number;
    verti: number;
  };
  chipX?: number;
  chipY?: number;

  shotX?: number;
  shotY?: number;
  shot?: {
    hori: number;
    verti: number;
  };

  requester?: User;
  designer?: User;
  idtProcessId?: string;
  // wafer?: FabWafer[];
  idtType?: IdtType;
  idt2Type?: IdtType;
  depositionCondi?: string;
  seedLayers?: Layer[];
  passivationLayers?: Layer[];
  idtLayers?: Layer[];
  idt2Layers?: Layer[];
  pstLayers?: Layer[];
  tcLayers?: Layer[];
  hsType?: HsType;
  passivationType?: passivationType[];
}

export interface band {
  bandCombinationId: string;
  label: string;
  bandGroupId: string;
  fabCardName: string;
}

export interface passivationType {
  passivationId: number;
  name: string;
  layers?: Layer[];
}

export interface seedType {
  seedId: number;
  name: string;
  layers?: Layer[];
}

export interface SawType {
  sawTypeId?: string;
  isAllowBridge?: boolean;
  wafers?: FabWafer[];
  pstTypes?: PstType[];
  tcTypes?: TcType[];
  idtTypes?: IdtType[];
  seedTypes?: seedType[];
  passivationTypes?: passivationType[];
}

export interface HsType {
  hsId?: number;
  name?: string;
  siliconRotation?: string;
  layers?: Layer[];
  peAngle?: number;
}

export interface PstType {
  pstId?: number;
  sawTypeId?: string;
  name?: string;
  layers?: PstLayer[];
  description?: string;
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
  tcMachines?: IdtMachine[];
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
  waferCode?: string;
  waferCompany?: string;
  size?: number;
  recommendedThicknesses?: FabRecommendationWaferThickness[];
  recommendedAngles?: FabRecommendationWaferAngle[];
  hsTypes?: HsType[];
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

export class FabRequest implements FabRequestForm {
  photo?: Photo;
  waferCode?: string;
  customerId?: string;
  productName?: string;
  bomMainCode?: string;
  isNewBom?: boolean;
  assyChipQuantity?: number;
  isNewBom2?: boolean;
  requesterId?: string;
  designerId?: string;
  designerConfirm?: boolean;
  weekNumber?: number;
  isAoi?: boolean;
  isDv2?: boolean;
  isGfl?: boolean;
  isCap?: boolean;
  isPadDl?: boolean;
  isMoreEnergy?: boolean;
  isRrPs2?: boolean;
  isMst?: boolean;
  isPending?: boolean;
  isFabCardCreated?: boolean;
  dateOfFabCardCreated?: string;
  maskTurn?: string | number;
  maskCd?: string | number;
  aspectRatio?: string | number;
  isAlPad?: boolean;
  gflThickness?: string | number;
  mstThickness? : string | number;
  quantity?: number;
  waferType?: string;
  wantedFabStartDate?: string;
  wantedFabFinishDate?: string;
  purpose?: string;
  destinationId?: string;
  packageId?: string;
  priorityId?: string;
  group?: string;
  bandGroupId?: string;
  isFreeWafer?: boolean;
  isNeededLtEtching?: boolean;
  band?: string;
  status?: string;
  createdDate?: string;
  trimming?: string;
  hsWaferInfo?: string;
  isNeedSio2Seed?: boolean;
  hasBridge?: boolean;
  isActive?: boolean;
  filterType?: string;
  tcMachineName?: string;
  note?: string;
  idtMachineId?: string;
  idt2MachineId?: string;
  waferId?: number;
  waferAngle?: number;
  waferThickness?: number;
  hsTrimingTarget?: number | null;
  freqRange?: string;
  idtId?: number;
  idt2Id?: number;
  hsId?: number;
  pstId?: number;
  tcId?: number;
  seedId?: number;
  code?: string;
  idtMachineName?: string;
  idt2MachineName?: string;
  idtProcess?: string;
  passivationId?: number;
  bom?: Bom;
  bom2?: Bom;
  samplePurpose?: string;
  samplePurposeDetail?: string;
  wafer?: FabWafer;
  isAllowBridge?: boolean;
  isIdtOxi?: boolean;
  isNeedExtraShot?: boolean;
  isSeedSio2?: boolean;
  isToneInverted?: boolean;
  isDualIdt?: boolean;
  photoNote?: string;
  metalNote?: string;
  dielectricLayerNote?: string;
  bpThicknessNote?: string;
  bpProbeNote?: string;
  paNote?: string;
  etchingNote?: string;
  chip?: {
    hori: number;
    verti: number;
  };
  chipX?: number;
  chipY?: number;

  shotX?: number;
  shotY?: number;
  shot?: {
    hori: number;
    verti: number;
  };

  requester?: User;
  designer?: User;
  idtProcessId?: string;
  // wafer?: FabWafer[];
  idtType?: IdtType;
  idt2Type?: IdtType;
  depositionCondi?: string;
  seedLayers?: Layer[];
  passivationLayers?: Layer[];
  idtLayers?: Layer[];
  idt2Layers?: Layer[];
  pstLayers?: Layer[];
  tcLayers?: Layer[];
  hsType?: HsType;
  passivationType?: passivationType[];

  constructor(data: FabRequestForm) {
    Object.assign(this, data);
    this.isGfl = this.gflThickness !== null
  }

  createHsWaferCondition = () => {
    let hsWaferCondition = "";

    if (this.wafer.sawTypeId === "HS") {
      hsWaferCondition =
        this.wafer.waferCompany +
        " " +
        this.wafer.size.toString() +
        '" ' +
        this.hsType.peAngle.toString() +
        this.hsType.name +
        this.hsType.siliconRotation +
        "   " +
        this.quantity.toString() +
        "ea";
    }

    return hsWaferCondition;
  };

  createWaferInfo = () => {
    let waferInfoStr = "";

    if (this.idtLayers !== null && this.idtType !== null) {
      waferInfoStr +=
        this.idtType.name +
        "=" +
        this.idtLayers.map((layer) => String(layer.thickness)).join("/");
    }

    if (this.idt2Layers !== null && this.idt2Type !== null) {
      waferInfoStr +=
        "," +
        this.idt2Type.name +
        "=" +
        this.idt2Layers.map((layer) => String(layer.thickness)).join("/");
    }

    return waferInfoStr;
  };

  createTrimmingInfo = () => {
    let ltTrrimmingVal = "";
    if (this.wafer.sawTypeId === "HS") {
      let waferInfo = this.hsType.name.split("/");
      if (waferInfo.length >= 1 && this.hsTrimingTarget !== null) {
        let temp = waferInfo[0];
        let isStart = false;
        let oriThickness = "";
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] === "(") {
            isStart = true;
            continue;
          } else if (temp[i] === ")") {
            break;
          }
          if (isStart) {
            oriThickness += temp[i];
          }
        }

        ltTrrimmingVal =
          "LT Trimming " +
          oriThickness +
          " -> " +
          this.hsTrimingTarget.toString();
      }
    }
    return ltTrrimmingVal;
  };
}
