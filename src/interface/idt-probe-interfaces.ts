// import { FabRequestForm } from './fab-application-rev2';
import { User } from "./user";

export type IdtProbeStatus = 'received' | 'completed';

export interface IdtProbeType {
    probeType: string;
    description?: string;
}

export interface IdtProbeItem {
    lotId: string;
    probeType?: string;
    iteration?: number;
    productName?: string;
    status?: IdtProbeStatus;    
    receivedDate?: string;
    completedDate?: string;
    note?: string;
    priority?: string;
    designer?: User;
    // fabRequestForm?: FabRequestForm;
}
