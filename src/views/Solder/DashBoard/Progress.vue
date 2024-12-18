<template>
  <div v-if="isLoad">
    <div class="section-header">
      <h3 class="section-title">작업 진행 중 항목</h3>
      <p class="section-description">
        이 테이블은 작업 목록을 나타냅니다
        <el-switch
          v-model="viewByDate"
          active-text="날짜별"
          inactive-text="전체보기"
          class="switch-right"
        ></el-switch>
      </p>
    </div>
    <div v-if="viewByDate">
      <ProgressByDate
        :meas-types="expandedApplications"
        :measurers="measurers"
      ></ProgressByDate>
    </div>
    <div v-else>
      <ProgressByDefault
        :meas-types="expandedApplications"
        :measurers="measurers"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type {
  Measurement,
  ApplicationData,
} from "../../../interface/solderAppInterface";
import type { ProgressMeasType } from "./Progress";
import ProgressByDate from "./ProgressByDate.vue";
import ProgressByDefault from "./ProgressByDefault.vue";
import { formatDate } from "../../../utils/date-utils";
// props로 ApplicationData 배열 받음
const props = defineProps<{
  applications: ApplicationData[];
}>();

const viewByDate = ref(true);
const measurers = ref<string[]>([]); // measurer 값을 저장할 배열
const isLoad = ref(false);
// 테이블에 사용될 확장된 데이터
const expandedApplications = ref<ProgressMeasType[]>([]);
watch(
  () => props.applications,
  (newApplications) => {
    expandedApplications.value = [];
    newApplications.forEach((app) => {
      const measuredItems = app.measurements?.filter((m) => m.isMeasured) || [];
      measuredItems.forEach((meas) => {

        let isSample = true
        if(app.jigSolderId === undefined && app.reelId === undefined){
          isSample = false
        }

        expandedApplications.value.push({
          modelName: app.modelName,
          measurementType: meas.measurementType,
          quantity: meas.quantity,
          measurer: app.measurer.toUpperCase(),
          rowspan: measuredItems.length,
          wantedFinishedDate: formatDate(meas.wantedFinishedDate),
          isSample : isSample
        });
        // 중복되지 않는 measurer만 추가
      });
      if (
        app.measurer &&
        !measurers.value.includes(app.measurer.toUpperCase())
      ) {
        measurers.value.push(app.measurer.toUpperCase());
      }
    });
    isLoad.value = true;
  },
  { immediate: true, deep: true }
);
</script>
<script lang="ts">
export default {};
</script>
<style scoped>
.el-table {
  width: 100%;
}

.section-header {
  margin-bottom: 12px;
}

.section-description {
  display: flex; /* Flexbox 적용 */
  align-items: center; /* 세로 정렬 */
}

.section-description p {
  margin: 0; /* p 태그의 기본 여백 제거 */
}

.switch-right {
  margin-left: auto; /* Flexbox로 오른쪽 끝으로 이동 */
}
</style>
