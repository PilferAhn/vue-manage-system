export interface Measurement {
    measurementType: string;  // 측정 종류
    isMeasured: boolean;      // 측정 여부 (true/false)
    quantity: number;         // 수량 (e.g., '20EA')
  }
  
  export interface ApplicationData {
    applicationUuid: string;       // Unique identifier for the application
    measurerName: string;              // 측정인 (name of the person who measured)
    measurerId : string;
    measurementCompletionDate: string;  // 측정 완료일 (date)
    modelName: string;          // 기종명 (model name)
    lotId: string;                 // Lot ID
    designer : string,
    designerId : string
    requester: string;             // 의뢰인 (requester)
    requesterId : string
    evbType: string;               // EVB Type
    shipmentInfo: string;          // 출하정보 (shipment details)
    evbInfo: string;               // EVB 정보 (additional EVB info)
    fileName: string;              // 파일명 (file name for reference)
    chipPattern: string;           // 측정 CHIP 패턴 (chip pattern for measurement)
    pkgType: string;               // 측정 PKG (package type)
    
    measurementQuantity : number
    measurements: Measurement[];   // 측정 (array of Measurement interfaces)
  }
  