import type { StockInfo } from "../Common/ApplicationInterface";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { ElMessageBox } from "element-plus";
import { convertToPep8 } from "../../../../utils/Common";
import axios from "axios";
import { useRouter } from "vue-router"; // Import useRouter to handle redirects

// Function to initialize a StockInfo object with default values
export function initializeStockInfo(): StockInfo {
  return {
    reelId: "", // Default to an empty string
    // dateOfCreated: undefined,   // Default to undefined
    location: "", // Default to an empty string
    remainQuantity: 0, // Default to 0
    quantity: 0, // Default to 0
    assumedQuantity: 0, // Default to 0
    receiver: "",
    operationType : "reel"
  };
}

// Function to initialize a StockInfo object with default values
export function initializeSampleInfo(): StockInfo {
  return {
    reelId: "", // Default to an empty string
    // dateOfCreated: undefined,   // Default to undefined
    location: "", // Default to an empty string
    remainQuantity: 0, // Default to 0
    quantity: 0, // Default to 0
    assumedQuantity: 0, // Default to 0
    receiver: "",
    operationType : "sample"
  };
}

// Application.ts
// Define submitForm that validates the form
export const submitForm = async (
  request_form: StockInfo,
  formRef: FormInstance | undefined,
  formType: string,
  router: ReturnType<typeof useRouter>
) => {
  if (!formRef) return;
  let url = "";
  if (formType === "create") {
    url = "/reel/create_reel_request";
  } else if (formType === "update") {
    url = "/reel/update_reel_request";
  } else if (formType === "delete") {
    url = "/reel/delete_reel_request";
  }
  try {
    await formRef.validate();
    const operationType = request_form.operationType
    // Display a different confirmation message for delete requests
    const confirmation = await ElMessageBox.confirm(
      formType === "delete"
        ? "Are you sure you want to delete this item? Deleted data cannot be restored."
        : "Are you sure you want to complete the submission?",
      "Confirmation",
      {
        confirmButtonText: formType === "delete" ? "Delete" : "Yes",
        cancelButtonText: "No",
        type: formType === "delete" ? "error" : "warning",
      }
    );

    const pep8Style = convertToPep8(request_form);

    if (confirmation === "confirm") {
      // Send HTTP request after confirmation
      console.log(url)
      await axios.post(url, pep8Style);
      ElMessage.success("process completed");
    }
    if (formType === "delete" || formType === "create") {
      let routerName = ""
      if(operationType === "reel"){
        routerName = "Stock List"
      }
      else{
        routerName = "Solder Stock List"
      }

      router.push({ name: routerName });
      // router.push("whc/stock-management/stock-list");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.log(error);
      ElMessage.error("Please correct the errors in the form.");
    }
    // Additional error handling can go here if needed
  }
};
