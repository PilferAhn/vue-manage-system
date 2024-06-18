import { TegApplication as oldTegApplication } from "./../../../utils/tegTypes"
import axios from "axios";

export const getTegApplicationByUserName = async (
    name: string
  ): Promise<oldTegApplication[]> => {
    try {
      const url = "teg_application/get-teg-applications-by-name";
      const response = await axios.get(url + "/" + name);
      let wafers = [];
  
      const applications: oldTegApplication[] = response.data.map((app: any) => ({
        applicationID: app.uuid,
        productName: app.model_name,
        lotId: app.lot_id,
        // waferId: app.wafer_id,
        // isTcf: app.is_tcf,
        // temperatures: app.temperatures,
        measType: "Testing",
        status: app.status,
        priority: app.priority,
        designer: app.designer + " / " + app.requester,
        progress: "0 / 0",
        dateOfCreated: app.date_of_created,
        applicationType: app.application_type,
      }));
  
      return applications;
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      throw error;
    }
  };