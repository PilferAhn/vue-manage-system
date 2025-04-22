import type { User } from "./user";

export interface FabRequestCreateSchedule {
    userId : string
    startDate : string
    endDate : string
    user : User
}

