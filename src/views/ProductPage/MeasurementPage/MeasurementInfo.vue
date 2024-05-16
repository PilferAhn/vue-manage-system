<template>
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
        :uuid="uuid"
        :systemBandInfo="systemBandInfo"
        :temperature="'85'"
      ></MeasurementSummary>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { Calendar } from "@element-plus/icons-vue";
import { ref, watch, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ApplicationForm } from "../../../utils/types";
import { createApplicationForm } from "../../../utils/form";
import {
  requestApplicationDetailbyUUID,
  getSystemBand,
} from "../../../utils/applicationUtility";
import MeasurementDetail from "./MeasurementDetail.vue";
import MeasurementSummary from "./MeasurementSummary.vue";

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
    requestApplicationDetailbyUUID(uuid.value, applicationForm).then(() => {
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

// 탭 상태 변경 시 URL 쿼리도 업데이트
watch(activeTabName, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

onMounted(() => {
  requestApplicationDetailbyUUID(uuid.value, applicationForm).then(() => {
    if (applicationForm.signalType && applicationForm.band) {
      systemBandInfo.value = getSystemBand(
        applicationForm.signalType,
        applicationForm.band
      );
    } else {
      systemBandInfo.value = []; // 기본값 설정
    }
  });
});
</script>


<style>
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
