import type { TegApplication, TegApplicationFile } from "../../views/TegPage/Common/ApplicationTypes";
import { downloadFileFromServerByObject, sendPostRequest } from "../httpProtocol";

// composables/useFileActions.ts
export const TegApplicationFileAction = (
    action: "download" | "delete",
    row: TegApplicationFile,
    applicationFiles: TegApplicationFile[],
    emit: (event: "update:files", value: TegApplicationFile[]) => void

  ) => {
    //     emit: (event: "update:files", value: File[]) => void
    const url = "/teg_application/handle_application_file"
    const params = {
        "file_uuid" : row.uuid,
        "action" : action
    }
    
    const form = new FormData()

    Object.entries(params).forEach(([key, value]) => {
      form.append(key, String(value))
    })

    if (action === "download") {
        downloadFileFromServerByObject(url , form)
    } else if (action === "delete") {

        sendPostRequest(url , form)
        const updatedFiles = applicationFiles.filter((f) => f.uuid !== row.uuid);
        emit("update:files", updatedFiles);
        
    }
};
  