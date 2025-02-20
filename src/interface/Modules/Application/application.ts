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
  purpose? : string
  isNa? : boolean
  isNf? : boolean  
}

export interface NaApplication {
  na? : string;
  deMethod? : string;
  loss? : boolean;
  measMthod? : string;
  sParaType? : string;
  note? : string;

}

export interface NfApplication {
  deMethod? : string;
  capture? : boolean;
  isRealMatching? : boolean;
  matchingInfo? : string;
  note? : string;
}
