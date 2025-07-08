import { User } from "./user";

interface StockItemFirstMesMaterial{
  material_id : string;
  designer? :  User;
}

interface StockItemFromWhcspMes {
  materialId : string;
  firstMesMaterials : StockItemFirstMesMaterial[]
}

export interface StockInfo {
    id?: number;
    reelId?: string;    
    dateOfCreated?: string;
    location?: string;
    remainQuantity?: number;
    quantity?: number;
    assumedQuantity?: number;
    receiver? : string;
    operationType? : string;
    isFound? : boolean;
    // designer? : string
    // modelName?: string
    // materialId?: string;

    fromWhcspMes? : StockItemFromWhcspMes
  }
  