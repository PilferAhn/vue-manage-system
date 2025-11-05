// import { FabRequestForm } from './fab-application-rev2';
import { LotStatus } from './mes-interface';
import { User } from "./user";

export type IdtProbeStatus = 'received' | 'completed';

export interface IdtProbeType {
    probeType: string;
    description?: string;
}

export interface IdtProbeWafer {
    lotId: string;
    productName?: string;
    probeType?: string;
    status?: IdtProbeStatus;    
    receivedDate?: string;
    completedDate?: string;
    designer?: User;
    // fabRequestForm?: FabRequestForm;
}

export interface MesLotStatus extends LotStatus {
    idtProbeWafer?: IdtProbeWafer;
}