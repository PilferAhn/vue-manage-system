<template>
  <div>
  <!-- 목록으로 돌아가기: 들어온 목록(측정 완료 / 측정 대기·진행)으로. 보던 탭·페이지는 목록 쪽에서 기억함 -->
  <div class="info-toolbar">
    <el-button :icon="ArrowLeft" @click="goBackToList">{{ backLabel }}</el-button>
  </div>
  <el-tabs type="border-card" class="demo-tabs" v-model="activeTabName">
    <el-tab-pane name="detail">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><Calendar /></el-icon>
          <span>의뢰서</span>
        </span>
      </template>
      <MeasurementDetail
        :uuid="uuid"
        :application="applicationForm"
      ></MeasurementDetail>
    </el-tab-pane>
    <el-tab-pane name="summary" label="Summary">
      <MeasurementSummary
        v-if="applicationForm.temperature"
        :key="uuid + '-' + applicationForm.temperature" 
        :uuid="uuid"
        :systemBandInfo="systemBandInfo"
        :targetPosition = "applicationForm.targetPosition"
        :temperature="applicationForm.temperature"
      ></MeasurementSummary>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { Calendar, ArrowLeft } from "@element-plus/icons-vue";
import { ref, watch, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ApplicationForm } from "../../../utils/types";
import { createApplicationForm } from "../../../utils/form";
import {
  requestApplicationDetailbyUUID,
  getSystemBand,
} from "../../../utils/applicationUtility";
import MeasurementDetail from "./MeasurementDetail.vue";
import MeasurementSummary from "./MeasurementSummary.vue";
import { useTagsStore } from "../../../store/tags";

const tags = useTagsStore();



const route = useRoute();
const router = useRouter();
const uuid = ref(route.params.uuid as string);
const applicationForm = reactive<ApplicationForm>(createApplicationForm());
const systemBandInfo = ref<string[]>([]);

// 탭 상태를 URL 쿼리에서 가져오기
const activeTabName = ref(route.query.tab as string || "detail");



// 라우트 파라미터가 변경될 때 실행할 작업
watch(
  () => route.params.uuid,
  (newUuid) => {
    uuid.value = newUuid;
    const loadingUuid = newUuid as string;
    requestApplicationDetailbyUUID(uuid.value, applicationForm).then(() => {
      // 상단 탭 제목을 "의뢰서 26-2302 D7H0" 처럼 (불러오는 사이 다른 화면으로 갔어도 이 의뢰서 탭에만 적용)
      const tagItem = tags.list.find(
        (i) => i.name === "MeasurementInfo" && i.path.split("?")[0] === `/product/meas-info/${loadingUuid}`
      );
      if (tagItem) {
        const title = ["의뢰서", applicationForm.requestNumber, applicationForm.modelName]
          .filter(Boolean)
          .join(" ");
        tags.setTitleByPath(tagItem.path, title);
      }
      if (applicationForm.signalType && applicationForm.band) {
        systemBandInfo.value = getSystemBand(
          applicationForm.signalType,
          applicationForm.band
        );
      } else {
        systemBandInfo.value = []; // 기본값 설정
      }
    });
  },
  { immediate: true }
);

// 어느 목록에서 들어왔는지 (자세히 버튼이 ?from=finished|reserved 를 붙여 줌). 없으면 측정 완료 항목으로
const fromList = computed(() => (route.query.from === "reserved" ? "reserved" : "finished"));
const backLabel = computed(() =>
  fromList.value === "reserved" ? "측정 진행/대기 항목으로 돌아가기" : "측정 완료 항목으로 돌아가기"
);
const goBackToList = () => {
  router.push({
    name: fromList.value === "reserved" ? "ReservedMeasurement" : "CompletedMeasurementList",
  });
};

// 탭 상태 변경 시 URL 쿼리도 업데이트
watch(activeTabName, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

// onMounted(() => {
//   requestApplicationDetailbyUUID(uuid.value, applicationForm).then(() => {
//     if (applicationForm.signalType && applicationForm.band) {
//       systemBandInfo.value = getSystemBand(
//         applicationForm.signalType,
//         applicationForm.band
//       );
//     } else {
//       systemBandInfo.value = []; // 기본값 설정
//     }
//   });
// });
</script>


<style>
.info-toolbar {
  margin-bottom: 10px;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label .el-icon {
  vertical-align: middle;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
