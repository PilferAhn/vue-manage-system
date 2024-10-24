import { watch, Ref } from "vue";
import { TestDataItem } from "./testRfLimitInterface";
import axios from "axios";

export const downloadFile = async (fileName: string) => {
  try {
    const response = await axios({
      url: `/rf-limit/download/${fileName}`, // The download URL provided by your FastAPI
      method: 'GET',
      responseType: 'blob', // Important to get the file as a Blob
    });

    // Create a link element, set the href to the blob, and click the link to trigger the download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Use the passed fileName for downloading
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error downloading the file", error);
  }
};

// Function to dynamically adjust the testData array based on count
export function useTestDataWatcher(
  testData: Ref<TestDataItem[]>,
  testDataCount: Ref<number>
) {
  watch(
    testDataCount,
    (newCount, oldCount) => {
      if (newCount > oldCount) {
        // Add new elements to testData array if count increases
        for (let i = 0; i < newCount - oldCount; i++) {
          testData.value.push({
            name: "",
            target_spec: [
              {
                spec_start: 0,
                spec_stop: 0,
                marker_left: 0,
                marker_right: 0,
                spec_il: 0,
                typ: "",
                peek_type: "false",
                line_color: "",
                output: 0,
                input: 0,
              },
            ],
            reference_spec: [
              {
                spec_start: 0,
                spec_stop: 0,
                marker_left: 0,
                marker_right: 0,
                spec_il: 0,
                typ: "",
                peek_type: "false",
                line_color: "",
                output: 0,
                input: 0,
              },
            ],
            spara: {
              dbm: [],
              file_path: "",
              freq: [],
              il_input: 0,
              il_output: 0,
              line_color: "",
              max_dbm_index: 0,
              max_dbm_val: 0,
              max_freq_val: 0,
              name: "",
              scattering_para: [],
            },
            jig: {
              dbm: [],
              file_path: "",
              freq: [],
              il_input: 0,
              il_output: 0,
              line_color: "",
              max_dbm_index: 0,
              max_dbm_val: 0,
              max_freq_val: 0,
              name: "",
              scattering_para: [],
            },
            solder: {
              dbm: [],
              file_path: "",
              freq: [],
              il_input: 0,
              il_output: 0,
              line_color: "",
              max_dbm_index: 0,
              max_dbm_val: 0,
              max_freq_val: 0,
              name: "",
              scattering_para: [],
            },
            is_max: false,
          });
        }
      } else if (newCount < oldCount) {
        // Remove elements from testData array if count decreases
        testData.value.splice(newCount);
      }
    },
    { immediate: true }
  );
}
