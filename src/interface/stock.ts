export type StockItemType = 'reel' | 'sample';
import { User } from "./user";

interface StockItemLotFirstMesMaterial{
  materialId : string;
  designer? :  User;
  sourceId? : string;
  isEditable?: boolean;
}

export interface StockItemLot {
  lotId: string;
  materialId: string;  
  firstMesMaterials: StockItemLotFirstMesMaterial[];
  sourceId: string;
  isEditable?: boolean
}

export interface StockItemLabel {
  label : string;
  lotId? : string;
  lot?: StockItemLot
}

export interface StockItem {
    id?: number;
    label: string;    
    dateOfCreated?: string;
    location: string;
    remainQuantity?: number;
    quantity?: number;
    assumedQuantity?: number;
    receiver: string;
    operationType : StockItemType;
    // designer? : string
    // modelName?: string
    // materialId?: string;

    stockItemLabel? : StockItemLabel
  }
  