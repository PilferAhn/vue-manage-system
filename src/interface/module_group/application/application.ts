import { User } from "../../user";
import type { UploadFile } from "element-plus";

export interface ModuleFiles {
  //공통
  
  //NA 파일
  stateFileList: UploadFile[];
  naRffeFileList: UploadFile[];
  naConfigFileList: UploadFile[];
  xmlFileList: UploadFile[];
  naReferenceFileList: UploadFile[];
  naSpecialFileList: UploadFile[];
  //NF 파일
  nfRffeFileList: UploadFile[];
  nfConfigFileList: UploadFile[];
  nfReferenceFileList: UploadFile[];
  nfSpecialFileList: UploadFile[];


  evbAssembleFileList: UploadFile[];
  matchingFileList: UploadFile[];
  s2pFileList: UploadFile[];

  // configFileList: UploadFile[];
  // rffeFileList: UploadFile[];
  // referenceFileList: UploadFile[];
  // offsetFileList: UploadFile[];
}

export interface ModuleMeasurementApp {
  id?: number;
  requester?: string;
  requesterId?: string;
  designer?: string;
  productName?: string;
  quantity?: string;
  purpose?: string;
  quantityDetail?: string;
  assemblyOrder?: string;
  smtHistory?: string;
  deliveryPerson?: string;
  deliveryMethod?: string;
  mold?: string;
  tcfTemperature?: string;
  // measurementManager?: string;
  // completionDueDate?: string;
  // finishedDate?: string;
  dateOfDeliveryDate?: string;
  dateOfExpectedFinished?: string;
  naApp?: NaApplication;
  nfApp?: NfApplication;
  dateOfCreated?: string;
  
  applicationStatus?: string;
  isNa?: boolean;
  isNf?: boolean;
  evbAssembleManual?: ApplicationFile[];
  xmlFile?: ApplicationFile[];
  user?: User;
}

// 파일을 표현하는 인터페이스
export interface ApplicationFile {
  uId: string;
  name: string;
  ext: string;
}

export interface NaApplication {
  id?: number;
  na?: string;
  deMethod?: string;
  portExtensionLoss?: boolean;
  measMethod?: string;
  sParaType?: string;
  note?: string;
  measurementManager?: string;
  completionDueDate?: string;
  finishedDate?: string;
  stateFile?: ApplicationFile[];
  naRffeFile?: ApplicationFile[];
  naConfigFile?: ApplicationFile[];
  s2pFile?: ApplicationFile[];
  naReferenceFile?: ApplicationFile[];
  naSpecialFile?: ApplicationFile[];
}

export interface NfApplication {
  id?: number;
  deMethod?: string;
  capture?: boolean;
  nfParameterMdf: string;
  isRealMatching?: boolean;
  measurementManager?: string;
  completionDueDate?: string;
  finishedDate?: string;
  nfRffeFile?: ApplicationFile[];
  nfConfigFile?: ApplicationFile[];
  matchingFile?: ApplicationFile[];
  note?: string;
  nfReferenceFile?: ApplicationFile[];
  nfSpecialFile?: ApplicationFile[];
  // offsetFile?: ApplicationFile[];
}
