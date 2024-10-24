export interface Measurement {
  number? : string;
  measurementType: string; // 측정 종류
  isMeasured: boolean; // 측정 여부 (true/false)
  quantity: number; // 수량 (e.g., '20EA')
  detail : string;
  status : string;
  placeHolder? : string;
}

export interface Segment {
    number : string
    start : string
    stop : string
    points : string
    ifbw : string
}


export interface MatchingComponent {
  series? : string
  shunt? : string
}

export interface Matching {

  number : string
  port : string
  ind : MatchingComponent
  cap : MatchingComponent
}

// solder application entity
export interface ApplicationData {
  uuid?: string; // Unique identifier for the application
  measurer?: string; // 측정인 (name of the person who measured)
  measurerId?: string;
  completionDate?: string; // 측정 완료일 (date)
  modelName?: string; // 기종명 (model name)
  lotId?: string; // Lot ID
  band?: string;
  designer?: string;
  files? : [];
  designerId?: string;
  requester?: string; // 의뢰인 (requester)
  requesterId?: string;
  filterType?: string;
  deembedMode? : string;
  matchingComponentType? : string;
  evbType?: string; // EVB Type  
  shipmentInfo?: string; // 출하정보 (shipment details)
  evbInfo?: string; // EVB 정보 (additional EVB info)
  fileName?: string; // 파일명 (file name for reference)
  pattern?: string; // 측정 CHIP 패턴 (chip pattern for measurement)
  pkgType?: string; // 측정 PKG (package type)
  detail?: string;
  measurementQuantity?: number;
  measurements?: Measurement[]; // 측정 (array of Measurement interfaces)
  status?: string;
  segmentQuantity?: number;
  segments?: Segment[];
  matchingQuantity? : number ;
  matching? : Matching[];
}
