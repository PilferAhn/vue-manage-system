export interface MdrApplication {
    id?: number;
    weekNumber?: number;
    productName?: string;
    category?: string;
    packageType?: string;
    waferType?: string;
    band?: string;
    size?: string;
    moduleName?: string;
    designer?: string;
    designerId?: string;
    requester? : string;
    requesterId? : string;
    group?: string;
    status? : string
    psNumber?: string;
    ganttPlanDate?: string;
    executionDate?: string;
    dateOfCreated? : string;
    result?: string;
    note?: string;
}
