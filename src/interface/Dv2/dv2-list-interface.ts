import type { User } from "../user";

export interface Dv2 {
  uuid?: string;
  salesTerritory?: string;
  main?: string;
  sub?: string;
  client?: string[];
  category?: string;
  band?: string;
  partName?: string;
  fabPartNumber? : string;
  chip?: string;
  pkg?: string;
  group?: string;
  pl?: User;
  operator?: User;
  status?: string;
  currentStage? : string;
  turn?: string;
  isEditable? : boolean
  dateOfMdr?: string;
  dateOfEstimatedFabIn?: string;
  dateOfEstimatedFabOut?: string;
  dateOfEstimatedHqOut?: string;
  dateOfEstimatedWhcIn?: string;
  dateOfEstimatedAssyIn?: string;
  dateOfEstimatedDCOut?: string;
  dateOfEstimatedMeasIn?: string;
  dateOfEstimatedCer?: string

  dateOfEstimatedMdr?: string;
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
  dvrPriority?: string;
  dateOfCreated?: string;
  dateOfFinished?: string;

  userOfDesigner?: string;
  userOfSupporter?: string;

  userOfDesignerID?: string;
  userOfSupporterID?: string;
}
