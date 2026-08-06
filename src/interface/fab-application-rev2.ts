import { ca } from "element-plus/es/locale";
import type { User } from "./user";
import {
  adjustDate,
  calculateWorkday,
  formatDate,
  formatDateTime,
  holidaysList,
} from "../utils/date-utils";
import {
  addWorkdays,
  calFabOutLeadTime,
} from "../utils/Fab/fab-application-utils";
import { off } from "process";
import { ActiveLot, LotStatus } from "./mes-interface";
import { extend } from "highcharts";

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
  matnr?: string;
  maktx?: string;
  meins?: string;
  umren?: string;
  dispo?: string;
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

export interface FabprobeInformation{
  chipCard?: string;
  stockDate?: string;
  stockYn?: string;
  firstchipMeas?: string;
  sinMeas?: string;
  secondchipMeas?: string;
  }


export interface FabRequestForm extends FabprobeInformation {
  photo?: Photo;
  waferCode?: string;
  customerId?: string;
  productName?: string;
  currentProductName?: string;
  bomMainCode?: string;
  isNewBom?: boolean;
  assyChipQuantity?: number;
  isNewBom2?: boolean;
  requesterId?: string;
  designerId?: string;
  designerConfirm?: boolean;
  weekNumber?: number;
  isAoi?: boolean;
  isNeedEngineerCall?: boolean;
  isDv2?: boolean;
  isSbm?: boolean;
  isSwlp?: boolean;
  isGfl?: boolean;
  isCap?: boolean;
  isPadDl?: boolean;
  isMoreEnergy?: boolean;
  isRrPs2?: boolean;
  isMst?: boolean;
  isPending?: boolean;
  isFabCardCreated?: boolean;
  dateOfFabCardCreated?: string;
  maskTurn?: string;
  maskCd?: string | number;
  aspectRatio?: string | number;
  isAlPad?: boolean;
  gflThickness?: string | number;
  mstThickness?: string | number;
  quantity?: number;
  waferType?: string;
  wantedFabStartDate?: string;
  wantedFabFinishDate?: string;
  idtMaskArrivalDate?: string;
  pstMaskArrivalDate?: string;
  purpose?: string;
  destinationId?: string;
  packageId?: string;
  packageSubTypeId?: string;
  priorityId?: string;
  group?: string;
  bandGroupId?: string;
  isFreeWafer?: boolean;
  isNeededLtEtching?: boolean;
  band?: string;
  status?: string;
  createdDate?: string;
  dateOfFabCardConvey?: string;
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
  idtProcessMachineName?: string;
  idtProcessRecipie?: string;
  waferId?: number;
  waferAngle?: number;
  waferThickness?: number;
  waferQty1?: number;
  isMixedWafer?: boolean;
  waferAngle2?: number;
  waferThickness2?: number;
  waferQty2?: number;
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
  lotStatus?: LotStatus[] | null;
  lots?: any[];
  activeLots?: ActiveLot[];
  fabPackageEvidence?: FabPackageEvidence | null;
}

export interface FabPackageEvidence {
  productName: string;
  path: string;
  createdTime: string; // 또는 Date
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
  idtProcessMachines?: IdtProcessMachine[];
}

export interface IdtMachine {
  machineName?: string;
}

export interface IdtProcessMachine
{
  idtProcessMachineName?: string;
  idtProcessId?: string;
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

export interface MesStatus {
  fabInsertPlanDate?: string;
  fabInsertDate?: string[];
  fabOutDate?: string[];
  FabLoc?: string[];
  FabTime?: string[];
  hqOutPlan?: string[];
  hqOut?: string[];
  whcArrived?: string[];
  AssyIn?: string[];
  flipBonding?: string[];
  package?: string[];
  assy?: string[];
  finalOut?: string[];
}

export type MesProgressRow = {
  materialId: string;
  creationDttm?: string | null;
  lotNum?: number | null;
  operationName?: string | null;
  currentSeqNo?: number | null;
  returnSeqNo?: number | null;
  lastSeqNoCurrentRt?: number | null;
  lastSeqNoReturnRt?: number | null;
  progress?: number | null;
  isRework?: number | null;
  routeName?: string | null;
  routeGroup1?: string | null;
};


export type FabMonitorRow =  {
  productName: string;           
  packageId: "CSP" | "WLP" | "BDMP" | "ETC";
  destinationId: "WHC" | "개발전달" | string;  
  priorityId?: string | null;
  designer?: string | null;
  designerId?: string | null;
  wantedFabStartDate?: string | null;
  wantedFabEndDate?: string | null;
  // 진행률 (MES)
  mes: MesProgressRow | null;
};

export class FabRequest implements FabRequestForm {
  photo?: Photo;
  waferCode?: string;
  customerId?: string;
  productName?: string;
  currentProductName?: string;
  bomMainCode?: string;
  isNewBom?: boolean;
  assyChipQuantity?: number;
  isNewBom2?: boolean;
  requesterId?: string;
  designerId?: string;
  designerConfirm?: boolean;
  weekNumber?: number;
  isAoi?: boolean;
  isNeedEngineerCall?: boolean;
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
  maskTurn?: string;
  maskCd?: string | number;
  aspectRatio?: string | number;
  isAlPad?: boolean;
  gflThickness?: string | number;
  mstThickness?: string | number;
  quantity?: number;
  waferType?: string;
  wantedFabStartDate?: string;
  wantedFabFinishDate?: string;
  idtMaskArrivalDate?: string;
  pstMaskArrivalDate?: string;
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
  dateOfFabCardConvey?: string;
  lotStatus?: LotStatus[] | null;
  lots: any[];
  activeLots: ActiveLot[];
  result: any | null;
  measStatus?: MesStatus;
  tegFinishedDate? : string;
  measType?: string;
  
  constructor(data: FabRequestForm) {
    Object.assign(this, data);
    this.isGfl = this.gflThickness !== null;
  }

  createMesInfo = () => {
    if (this.lotStatus.length != 0) {
      this.measStatus = {
        fabInsertDate: [],
        fabOutDate: [],
        FabLoc: [],
        FabTime: [],
        hqOutPlan: [],
        hqOut: [],
        whcArrived: [],
        AssyIn: [],
        flipBonding: [],
        package: [],
        assy: [],
        finalOut: [],
      };

      for (let i = 0; i < this.lotStatus.length; i++) {
        try {
          const lot = this.lotStatus[i];

          // HQ 출하 예정
          if (lot.operation === undefined) {
            this.measStatus.hqOutPlan.push("--");
          } else if (lot.operation.operationId === "OP0E002040") {
            const t = formatDate(adjustDate(lot.moveinDate, 3));
            this.measStatus.hqOutPlan.push(t);
          } else if (
            lot.secondProbeHistory !== null &&
            lot.secondProbeHistory?.startDate !== null
          ) {
            this.measStatus.hqOutPlan.push(
              formatDate(adjustDate(lot.secondProbeHistory.startDate, 3))
            );
          } else if (
            lot.secondProbeHistory !== null &&
            lot.secondProbeHistory?.endDate !== null
          ) {
            this.measStatus.hqOutPlan.push(
              formatDate(adjustDate(lot.secondProbeHistory.endDate, 3))
            );
          } else if (
            lot.secondProbeHistory !== null &&
            lot.secondProbeHistory?.startDate === null
          ) {
            this.measStatus.hqOutPlan.push("SKIP");
          } else {
            this.measStatus.hqOutPlan.push("--");
          }

          // HQ 출하
          if (lot.operation?.name === "Transit 공정") {
            this.measStatus.hqOut.push(formatDate(lot.moveinDate));
          } else {
            this.measStatus.hqOut.push("--");
          }

          // WHC Arrival
          if (lot.hanoiCsp !== null) {
            this.measStatus.whcArrived.push(lot.hanoiCsp.moveinDate);
          } else {
            this.measStatus.whcArrived.push("--");
          }

          // flip bonding
          if (lot.hanoiCsp !== null) {
            const t =
              lot.hanoiCsp.operation.name +
              " " +
              formatDateTime(lot.hanoiCsp.moveinDate) +
              " " +
              lot.hanoiCsp.lotId;
            this.measStatus.flipBonding.push(t);
          } else {
            this.measStatus.flipBonding.push("--");
          }

          // Package
          if (lot.hanoiCsp && lot.child) {
            this.measStatus.package.push(
              lot.hanoiCsp.child.operation.name +
                " " +
                formatDateTime(lot.hanoiCsp.child.moveinDate) +
                " " +
                lot.hanoiCsp.child.lotId
            );
          } else {
            this.measStatus.package.push("--");
          }

          // Assy
          if (lot.hanoiCsp && lot.child?.child) {
            this.measStatus.package.push(
              lot.hanoiCsp.child.child.operation.name +
                " " +
                formatDateTime(lot.hanoiCsp.child.child.moveinDate) +
                " " +
                lot.hanoiCsp.child.child.lotId
            );
          } else {
            this.measStatus.package.push("--");
          }

          // Final Out
          if (lot.hanoiCsp && lot.child?.child?.child?.child?.child) {
            this.measStatus.package.push(
              lot.hanoiCsp.child.child.child.child.child.operation.name +
                " " +
                formatDateTime(
                  lot.hanoiCsp.child.child.child.child.child.moveinDate
                ) +
                " " +
                lot.hanoiCsp.child.child.child.child.child.lotId
            );
          } else {
            this.measStatus.package.push("--");
          }
        } catch (err) {
          console.error(
            "createMesInfo() error at lotStatus[",
            i,
            "]",
            this,
            err
          );

          // 모든 measStatus 배열에 '--'를 추가해 일관성 유지
          this.measStatus.hqOutPlan.push("--");
          this.measStatus.hqOut.push("--");
          this.measStatus.whcArrived.push("--");
          this.measStatus.flipBonding.push("--");
          this.measStatus.package.push("--");
          this.measStatus.package.push("--"); // Assy
          this.measStatus.package.push("--"); // Final Out
        }
      }
    }
  };

  calFabCardConveyDate = () => {
    return calculateWorkday(this.wantedFabStartDate, holidaysList);
  };

  createHsWaferCondition = () => {
    let hsWaferCondition = "";
    try {
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
    } catch (error) {
      return ""; // 🚀 오류 발생 시 빈 문자열 반환
    }

    return hsWaferCondition;
  };

  createWaferInfo = () => {
    let waferInfoStr = "";

    try {
      // "Special" 타입일 경우
      if (this.idtType.name === "Special") {
        waferInfoStr = this.metalNote.split("\n")[0];        
      } else {
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
      }
    } catch (err) {
      console.error("createWaferInfo() error:", err);
      waferInfoStr = "";
    }

    return waferInfoStr;
  };

  createTrimmingInfo = () => {
    let ltTrrimmingVal = "";

    try {
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
    } catch (error) {
      return ""; // 🚀 오류 발생 시 빈 문자열 반환
    }

    return ltTrrimmingVal;
  };

  checkFabOutDate = () => {
    const offset = calFabOutLeadTime(this, this.wafer.sawTypeId);
    // 입력된 날짜를 Date 객체로 변환 (ISO 8601 형식 지원)
    const start = new Date(this.wantedFabStartDate);

    // 입력된 숫자(오프셋)를 추가
    const expectedEnd = addWorkdays(start, offset);
    // expectedEnd.setDate(addWorkdays(this.wantedFabStartDate, offset));

    // 비교할 날짜(Date 객체)로 변환
    const targetEnd = new Date(this.wantedFabFinishDate);

    // 두 날짜를 비교하여 결과 반환 (연, 월, 일까지만 비교)
    return (
      expectedEnd.getFullYear() === targetEnd.getFullYear() &&
      expectedEnd.getMonth() === targetEnd.getMonth() &&
      expectedEnd.getDate() === targetEnd.getDate()
    );
  };
}
