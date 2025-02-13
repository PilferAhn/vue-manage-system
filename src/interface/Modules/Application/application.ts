export interface Application {
  productName?: string;
  quantity?: string;
  requester?: string;
  requesterId?: string;
  smtHistory?: string;
  mold?: string;
  wantedFinishedDate?: string;
  needGoldenSampleMeasure?: boolean;
  referenceChar?: string;
  needTcf?: boolean;
  tcf?: string;
  naApp?: NaApplication;
  nfApp?: NfApplication;
  measurer?: string;
  estFinishedDate?: string;
}

export interface NaApplication {}

export interface NfApplication {}
