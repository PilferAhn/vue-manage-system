interface shotInformation {
    shots: string[];
    disableShots: string[];
    size: number;
    status: string[];
  }
  
  export interface waferInformation {
    waferName: string;
    waferStatus: string;
    dateOfStart: Date | null;
    dateOfEnd: Date | null;
  }
  
  export interface w {
    waferInfoList: waferInformation[];
  }
  
  export interface FreqSectionInfo {
    start: string;
    stop: string;
    point: string;
    ifwb: string;
  }
  
  export interface MeasInfo {
    measType: string;
    freqSectionInfo: FreqSectionInfo[];
  }
  
  export interface TegApplication {
    uuid: string;
    status: string;
  
    designer: string;
    requester: string;
    designerId?: string;
    requesterId?: string;
    purpose: string;
    lotID: string;
  
    shotSize: string;
    chipSize: string;
    chipQuantity: string;
    maskName: string;
    isMaskChange: string;
    isAoi: string;
    isDvr: string;
    port: string;
  
    detail: string;
  
    shortPatternNo: string;
    thruPatternNo: string;
    openPatternNo: string;
    rawPatternNo: string;
    preTegPatternMeasShot: string;
  
    waferQuantity: number;
    waferIDList: string[];
    waferSize: string;
    activeShots: string[];
  
    measInfo: MeasInfo[];
  
    dateOfCreated: string | Date;
    dateOfReserve: string | Date;
    dateOfFinish: string | Date;
    dateOfMeasStart: string | Date | null;
  
    temperatures: string[];
  
    note: string;
  
    modelName: string;
    // measType: string[];
  
    shotInformation: shotInformation;
    waferInformation: waferInformation[];
  
    priority: string;
    applicationType: string;
  }