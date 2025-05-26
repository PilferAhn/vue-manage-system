import { User } from "../../user";
import type { UploadFile } from "element-plus";

export interface ModuleFiles {
  referenceFileList: UploadFile[];
  evbAssembleFileList: UploadFile[];
  stateFileList: UploadFile[];
  matchingFileList: UploadFile[];
  configFileList: UploadFile[];
  rffeFileList: UploadFile[];
  xmlFileList: UploadFile[];  
  s2pFileList: UploadFile[];
  naSpecialFileList: UploadFile[];
  nfSpecialFileList: UploadFile[];
  offsetFileList: UploadFile[];
}

export interface ModuleMeasurementApp {
  id?: number;
  productName?: string;
  quantity?: number;
  requester?: string;
  requesterId?: string;
  smtHistory?: string;
  mold?: string;
  wantedFinishedDate?: string;
  lotId?: string;
  dateOfDeliveryDate?: string;
  dateOfExpectedFinished?: string;
  referenceChar?: string;
  needTcf?: boolean;
  tcfTemperature?: string;
  naApp?: NaApplication;
  nfApp?: NfApplication;
  measurer?: string;
  measurerId?: string;
  estFinishedDate?: string;
  dateOfCreated?: string;
  purpose?: string;
  applicationStatus?: string;
  isNa?: boolean;
  isNf?: boolean;
  referenceFile?: ApplicationFile[];
  evbAssembleManual?: ApplicationFile[];
  configFile?: ApplicationFile[];
  xmlFile?: ApplicationFile[];
  rffeFile? : ApplicationFile[];
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
  stateFile?: ApplicationFile[];
  s2pFile?: ApplicationFile[];
  naSpecialFile?: ApplicationFile[];
}

export interface NfApplication {
  id?: number;
  deMethod?: string;
  capture?: boolean;
  isRealMatching?: boolean;
  matchingFile?: ApplicationFile[];
  note?: string;
  nfSpecialFile?: ApplicationFile[];
  offsetFile?: ApplicationFile[];
}
