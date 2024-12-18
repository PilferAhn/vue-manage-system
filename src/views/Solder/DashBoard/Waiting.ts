import { unique } from "element-plus/es/utils";
import type { ApplicationData } from "../../../interface/solderAppInterface";

export interface MeasurementStatus {
  status: string;
  cnt: number;
}

export interface Measurement {
  type: string;
  cnt: number;
  measurements: MeasurementStatus[];
}

export function getSumByMeasStatus(measurement: Measurement[], status: string) {
  let cnt = 0;
  measurement.forEach((meas) => {
    meas.measurements.forEach((measStatus) => {
      if (measStatus.status === status) {
        cnt += measStatus.cnt;
      }
    });
  });
  return cnt;
}

export function analizeData(
  applications: ApplicationData[],
  measurements: Measurement[]
) {
  for (let x = 0; x < applications.length; x++) {
    for (let y = 0; y < applications[x].measurements.length; y++) {
      if (!applications[x].measurements[y].isMeasured) {
        continue;
      }

      if (applications[x].measurements[y].status === "finished") {
        continue;
      }

      const tempMeas = measurements.find(
        (m) => m.type === applications[x].measurements[y].measurementType
      );

      if (!tempMeas) {
        if (
          applications[x].reelId === undefined &&
          applications[x].jigSolderId === undefined
        ) {
          measurements.push({
            type: applications[x].measurements[y].measurementType,
            cnt: 1,
            measurements: [
              {
                status: "Waiting Sample",
                cnt: 1,
              },
            ],
          });
        } else {
          measurements.push({
            type: applications[x].measurements[y].measurementType,
            cnt: 1,
            measurements: [
              {
                status: "In Progress",
                cnt: 1,
              },
            ],
          });
        }
      } else {
        let st = "";

        if (
          applications[x].reelId === undefined &&
          applications[x].jigSolderId === undefined
        ) {
          st = "Waiting Sample";
        } else {
          st = "In Progress";
        }

        const tempStatus = tempMeas.measurements.find((s) => s.status === st);

        if (tempStatus) {
          tempStatus.cnt += 1;
        } else {
          tempMeas.measurements.push({
            status: st,
            cnt: 1,
          });
        }
        tempMeas.cnt += 1;
      }
    }
  }
}
