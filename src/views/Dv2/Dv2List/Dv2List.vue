<template>
  <div>
    <Dv2ListTable :dv2TableData="dv2TableData"></Dv2ListTable>
    <Dv2Actions :dv2TableData="dv2TableData" :oldDvList="dv2Data"></Dv2Actions>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";
import {
  fetchProcessData,
  getFabRequestFormByModelNames,
} from "../../FAB/ApplicationList/ApplicationList";
import type { FabApplicationForm } from "../../FAB/Interface/mes-interface";
// import { dv2Data } from "../../../utils/Dv2/demo-data";
import { formatDate, formatDateTime } from "../../../utils/date-utils";
import Dv2Actions from "./Dv2Actions.vue";
import Dv2ListTable from "./Dv2ListTable.vue";
import {
  sendDv2,
  updateDv2TableData,
  getModelNameList,
} from "../../../utils/Dv2/dv2-list-utils";
import { Dv2 } from "../../../interface/Dv2/dv2-list-interface";
import { sendGetRequest, sendPostRequest } from "../../../utils/httpProtocol";
import { RefSymbol } from "@vue/reactivity";
import { convertPep8ToCamelCase2 } from "../../../utils/key-converter";

// 📌 기존 데이터 저장 (ref 사용)
const fabApp = ref<FabApplicationForm[]>([]);
const dv2TableData = ref<Dv2[]>([]); // 원본 데이터를 저장할 ref
const dv2Data = ref<Dv2[]>([]);
// 📌 onMounted에서 데이터 로드 및 업데이트
onMounted(async () => {
  const formData = new FormData();
  formData.append("order_by", "date_of_estimated_cer");
  formData.append("order_dir", "asc");
  const data = await sendPostRequest("/dv2/get_dv2_list", formData);
  dv2Data.value = convertPep8ToCamelCase2(data);

  // for(let i = 0 ; i < dv2Data.length; i++){

  //   await sendDv2(dv2Data[i], "create")

  // }

  nextTick(async () => {
    dv2TableData.value = dv2Data.value.flatMap((row) => [
      // dv2TableData.value = dv2Data.flatMap((row) => [
      {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: true,
        dateOfFabIn: row.dateOfEstimatedFabIn, // 두 번째 줄: 예상 FAB IN 값
        dateOfFabOut: row.dateOfEstimatedFabOut, // 두 번째 줄: 예상 FAB OUT 값
        dateOfMdr: row.dateOfEstimatedMdr,
        isEditable: true,
        dateOfHqOut: row.dateOfEstimatedHqOut,
        dateOfWhcIn: row.dateOfEstimatedWhcIn,
        dateOfAssyIn: row.dateOfEstimatedAssyIn,
        dateOfDCOut: row.dateOfEstimatedDCOut,
        dateOfMeasIn: row.dateOfEstimatedMeasIn,
        dateOfCer: row.dateOfEstimatedCer,
        supporter: row.supporter,
      },
      {
        ...row,
        client: row.client, // 배열을 문자열로 변환
        isFirstRow: false,
        // dateOfFabIn: formatDate(row.dateOfFabIn), // 첫 번째 줄: 실제 FAB IN 값
        // dateOfFabOut: formatDate(row.dateOfFabOut), // 첫 번째 줄: 실제 FAB OUT 값
        // dateOfMdr: row.dateOfMdr,
        // isEditable: false,
        // dateOfHqOut: formatDate(row.dateOfHqOut),
        // dateOfWhcIn: formatDate(row.dateOfWhcIn),
        // dateOfAssyIn: formatDate(row.dateOfAssyIn),
        // dateOfDCOut: formatDate(row.dateOfDCOut),
        // dateOfMeasIn: formatDate(row.dateOfMeasIn),
        dateOfFabIn: null,
        dateOfFabOut: null,
        dateOfMdr: row.dateOfMdr,
        isEditable: false,
        dateOfHqOut: null,
        dateOfWhcIn: null,
        dateOfAssyIn: null,
        dateOfDCOut: null,
        dateOfMeasIn: null,
        dateOfCer: row.dateOfCer,
        supporter: row.designer,
      },
    ]);

    // fabApp.value = await fetchProcessData(fabApp.value);
    fabApp.value = await getFabRequestFormByModelNames(
      getModelNameList(dv2TableData.value),
      fabApp.value
    );
    updateDv2TableData(dv2TableData.value, fabApp.value);
  });
});
</script>
