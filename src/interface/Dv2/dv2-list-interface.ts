import type { User } from "../user";

export interface Dv2 {
  uuid?: string;
  salesTerritory?: string;
  main?: string;
  sub?: string;
  client?: string;
  category?: string;
  band?: string;
  productName? : string
  fabPartNumber? : string;
  chip?: string;
  package?: string;
  group?: string;
  pl?: User;
  operator?: User;
  status?: string;
  currentStage? : string;
  location? : string;
  locationTime? : string
  turn?: string;
  isEditable? : boolean
  dateOfMdr?: string;
  dateOfEstimatedMdr?: string;
  dateOfEstimatedFabIn?: string;
  dateOfEstimatedFabOut?: string;
  dateOfEstimatedHqOut?: string;
  dateOfEstimatedWhcIn?: string;
  dateOfEstimatedAssyIn?: string;
  dateOfEstimatedDCOut?: string;
  dateOfEstimatedMeasIn?: string;
  dateOfEstimatedCer?: string  
  isFirstRow? : boolean;  
  dateOfFabIn?: string;
  dateOfFabOut?: string;
  dateOfHqOut?: string;
  dateOfWhcIn?: string;
  dateOfAssyIn?: string;
  dateOfDCOut?: string;
  dateOfMeasIn?: string;
  dateOfCer?: string;

  dateOfScheduleConfirm?: string;
  dateOfDvrRequest?: string;
  priority?: string;
  dateOfCreated?: string;
  dateOfFinished?: string;

  designer?: string;
  supporter?: string;

  designerId?: string;
  supporterId?: string;
  backgroundColor? : string
}
