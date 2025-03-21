import { reactive } from "vue";
import { FabRequest } from "../../interface/fab-application-rev2";
import { FabApplicationForm } from "../../views/FAB/Interface/mes-interface";

export function getAppByPackageType(apps: FabRequest[], packageType: string[], destination : string[]) {
    const temp = reactive<FabRequest[]>([]);
  
    apps.forEach((app) => {
      if (packageType.includes(app.packageId) && destination.includes(app.destinationId)) {
        temp.push(app);
      }
    });
  
    return temp;
  }