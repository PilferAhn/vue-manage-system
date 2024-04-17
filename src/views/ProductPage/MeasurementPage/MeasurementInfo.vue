
<template>
  <el-tabs type="border-card" class="demo-tabs" v-model="activeTabName">
    <el-tab-pane name="detail">
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><Calendar /></el-icon>
          <span>의뢰서</span>
        </span>
      </template>
      <MeasurementDetail :uuid="uuid"></MeasurementDetail>
    </el-tab-pane>
    <el-tab-pane name="summary" label="Summary">
      <MeasurementSummary :uuid="uuid" :temperature="'85'"></MeasurementSummary>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { Calendar } from '@element-plus/icons-vue'
import { ref, watch } from 'vue';
import { useRoute } from "vue-router";
import MeasurementDetail from './MeasurementDetail.vue';
import MeasurementSummary from './MeasurementSummary.vue';

const route = useRoute();
const uuid = ref(route.params.uuid as string);

// 라우트 파라미터가 변경될 때 실행할 작업
watch(() => route.params.uuid, (newUuid) => {
  uuid.value = newUuid;
  // UUID가 변경되었으므로 새 데이터를 불러오는 함수를 호출합니다.
  // fetchData(newUuid).then((data) => {
  //   // 데이터를 처리하는 로직...
  // });
}, { immediate: true });
// 활성화된 탭의 name 값을 관리하는 ref
const activeTabName = ref('detail');

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
  