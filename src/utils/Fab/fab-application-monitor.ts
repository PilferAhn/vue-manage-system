import { reactive } from "vue";
import { FabRequest } from "../../interface/fab-application-rev2";
import { FabApplicationForm } from "../../views/FAB/Interface/mes-interface";
import { FabMonitorRow } from "../../interface/fab-application-rev2";

export function getAppByPackageType(apps: FabRequest[], packageType: string[], destination : string[]) {
    const temp = reactive<FabRequest[]>([]);
  
    apps.forEach((app) => {
      if (packageType.includes(app.packageId) && destination.includes(app.destinationId)) {
        temp.push(app);
      }
    });
  
    return temp;
  }

export function getAppByPackageTypeForProgressMonitoring(apps: FabMonitorRow[], packageType: string[], destination : string[]): FabMonitorRow[] {
    const temp = reactive<FabMonitorRow[]>([]);
  
     return (apps ?? []).filter(
      (app) =>
        packageType.includes(app.packageId) &&
        destination.includes(app.destinationId)
  );
}