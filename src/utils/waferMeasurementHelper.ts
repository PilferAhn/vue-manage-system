import axios from "axios";
import dayjs from "dayjs";
import { TegApplicationForm, TegFormRuleInterface } from "../../../utils/waferApplicationHelper";

// Define an interface for the Application object
export interface TegApplication {
  applicationID: string;
  productName: string;
  lotId: string;
  waferId: string;
  isTcf: boolean;
  temperatures: string;
  status: string;
  priority: string;
  measType: string;
  designer: string | null;
  dateOfCreated: string | Date;
  dateOfReserve: string | Date;
  dateOfFinish: string | Date;
  dateOfMeasStart: string | Date | null;
  isMeasStart: boolean;
  start?: string;
  stop?: string;
  points?: string;
  progress?: string;
  // wafers: any[]; // Specify more detailed type if possible
  waferInfo: waferInfo[]; // Specify more detailed type if possible
  application_type? : number
}

export interface TegRunningMeas {
  productName: string;
  shot: string;
  shots: string;
  waferID: string;
  measType: string;
}

// Types for the return object of the function
export interface waferQueOverview {
  modelName: string;
  lotID: string;
  measType: string;
  developer: string;
  requester: string;
  dateOfReserved: string;
  expectedMeasFinish: string;
}

export interface waferInfo {
  uuid? : string
  waferName: string;
  status: string;
}


// export const getTegApplication = async (
//   category: string
// ): Promise<TegApplication[]> => {
//   try {
//     const url = "application/get_application_by_category";
//     const response = await axios.post(url, { category: category });
//     console.log("Raw data from server:", response.data); // Add this line
//     const applications = response.data.map(convertToApplication);
//     return applications;
//   } catch (error) {
//     console.error("Failed to fetch applications:", error);
//     throw error;
//   }
// };

// Your existing setup code
export const formatTime = (isoDate) => {
  return dayjs(isoDate).format("YYYY-MM-DD"); // Formats as hours:minutes:seconds
};


export const getTegApplicationDetail = async (
  applicationId: string
): Promise<TegApplication> => {
  try {
    const url = "application/get-application-detail-by-application-id/" + applicationId;
    const response = await axios.get(url);
    
    const application: TegApplication = {
      applicationID: response.data.application_id,
      productName: response.data.product_name,
      lotId: response.data.lot_id,
      waferId: response.data.wafer_id,
      isTcf: response.data.is_tcf,
      temperatures: response.data.temperatures,
      status: response.data.status,
      priority: response.data.priority,
      measType: response.data.meas_type,
      designer: response.data.designer,
      dateOfCreated: response.data.date_of_created,
      dateOfReserve: response.data.date_of_reserve,
      dateOfFinish: response.data.date_of_finish,
      dateOfMeasStart: response.data.date_of_meas_start,
      isMeasStart: response.data.is_meas_start,
      start: response.data.start,
      stop: response.data.stop,
      points: response.data.points,
      progress: response.data.progress,
      waferInfo: response.data.wafer_info.map((loc: any) => ({
        uuid : loc.wafer_id,
        waferName: loc.wafer_name,
        status: loc.status,
      })),
    };

    return application;
  } catch {}
};

export const getTegApplication = async (
  category: string
): Promise<TegApplication[]> => {
  try {
    const url = "application/get_application_by_category";
    const response = await axios.post(url, { category: category });
    let wafers = [];

    const applications: TegApplication[] = response.data.map((app: any) => ({
      applicationID: app.application_id,
      productName: app.product_name,
      lotId: app.lot_id,
      waferId: app.wafer_id,
      isTcf: app.is_tcf,
      temperatures: app.temperatures,
      status: app.status,
      priority: app.priority,
      measType: app.meas_type,
      designer: app.designer,
      dateOfCreated: app.date_of_created,
      dateOfReserve: app.date_of_reserve,
      dateOfFinish: app.date_of_finish,
      dateOfMeasStart: app.date_of_meas_start,
      isMeasStart: app.is_meas_start,
      start: app.start,
      stop: app.stop,
      points: app.points,
      progress: app.progress,
      waferInfo: app.wafer_info.map((loc: any) => ({
        uuid : loc.wafer_id,
        waferName: loc.wafer_name,
        status: loc.status,
      })),
      applicationType : app.application_type
    }));

    return applications;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    throw error;
  }
};

export const getRunningMeasurement = async (): Promise<TegRunningMeas[]> => {
  try {
    const url = "measurement/get_running_meas";
    const response = await axios.get(url);

    const runningMeasurements: TegRunningMeas[] = response.data.map(
      (app: any) => ({
        productName: app.product_name,
        shot: app.shot,
        shots: app.shots,
        waferID: app.wafer_id,
        measType: app.meas_type,
      })
    );

    return runningMeasurements;
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    throw error;
  }
};


export async function loadApplicationDetails(applicationId: string, form: TegFormRuleInterface, waferInformation : waferInfo[]): Promise<void> {
  try {
    const applicationDetails = await getTegApplicationDetail(applicationId);
    mapApplicationDetailsToForm(applicationDetails, form);
    
  } catch (error) {
    ElMessage.error('Failed to load application details');
    console.error(error);
  }
}

function mapApplicationDetailsToForm(details: any, form: TegFormRuleInterface): void {
  form.designer = details.designer || "";
  form.requester = ""; // Add logic to derive requester if applicable
  form.purpose = details.detail || "";
  form.lotID = details.lotId || "";

  form.shotSize = ""; // Map appropriately if different key in details
  form.chipSize = ""; // Same as above
  form.chipQuantity = ""; // Same as above
  form.maskName = ""; // Same as above
  form.isMaskChange = ""; // Same as above
  form.port = ""; // Same as above

  // Continue mapping all other fields...
  form.waferQuantity = details.waferInfo.length;
  form.waferIDList = details.waferInfo.map(wafer => wafer.uuid);  
  form.measInfo = [];
  form.temperatures = details.temperatures || [];
  form.note = ""; // Add logic to derive note if applicable

  form.modelName = details.productName || "";
  form.priority = details.priority;
  form.applicationType = ""; // Determine how to derive this from details
  
}