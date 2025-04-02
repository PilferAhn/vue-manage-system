<script lang="ts">
export default {};
</script>
<template>
  <div class="group-count-wrapper">
    <!-- 왼쪽: 기존 group 통계 -->
    <div class="group-count">
      <div class="group-box">
        <el-button class="btn-waiting-feedback" disabled
          >Fab Card 작성 2일전</el-button
        >
        <el-button class="btn-re-measure" disabled
          >Fab Card 작성 1일전</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted, reactive, watch } from "vue";
import { FabRequest } from "../../../../interface/fab-application-rev2";
import { getUserId } from "../../../../utils/account-utils";

const props = defineProps<{
  processData: FabRequest[];
  weekNumber: number;
}>();

const totalQuantity = computed(() => {
  return Object.values(groupStats.value).reduce(
    (sum, stats) => sum + stats.count,
    0
  );
});

const groupDv2Count = computed(() => {
  return props.processData.reduce((count, item) => {
    return count + (item.isDv2 ? 1 : 0);
  }, 0);
});

const groupStats = computed(() => {
  return props.processData.reduce((acc, item) => {
    const department = item.designer.department;

    // 부서별 데이터 초기화
    acc[department] = acc[department] || {
      count: 0,
      totalQuantity: 0,
      dv2Count: 0,
    };

    // 부서별 건수(count) 증가
    acc[department].count += 1;

    // 부서별 매수(quantity) 합산
    acc[department].totalQuantity += item.quantity || 0;

    return acc;
  }, {} as Record<string, { count: number; totalQuantity: number; dv2Count: number }>);
});

const priorityCounts = computed(() => {
  return props.processData.reduce<Record<string, number>>((acc, item) => {
    const priority = item.priorityId || "UNKNOWN";
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});
});

function getStatusClass(status: string) {
  switch (status) {
    case "in progress":
      return "btn-in-progress";
    case "finished":
      return "btn-finished";
    case "created":
      return "btn-waiting";
    case "waiting feedback":
      return "btn-waiting-feedback";
    case "remeasure_request":
      return "btn-re-measure";
    default:
      return "";
  }
}

// 셀에 적용할 클래스 반환
const cellClass = ({ row, rowIndex, column, columnIndex }) => {
  // 예: 짝수 행에만 스타일을 적용

  if (row.reelId !== undefined || row.jigSolderId !== undefined) {
    if ([0].includes(columnIndex)) {
      return "even-row";
    }
  }

  return "";
};
</script>

<style lang="scss" scoped>
.group-count-wrapper {
  display: flex;
  justify-content: space-between; /* 양쪽 정렬 */
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.group-count {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.group-box {
  background-color: #f0f9ff;
  border: 1px solid #dbeafe;
  padding: 5px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 12px;
  color: #1e40af;
}

.legend {
  display: flex;
  margin-left: auto; /* Pushes the legend to the right side */
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.legend-item span {
  margin-left: 5px;
  font-size: 14px;
}

/* Button styles based on status */
.btn-in-progress {
  background-color: #007bff; /* Bright blue */
  /* border-color: #007bff !important; */
  color: #fff !important;
}

.btn-finished {
  background-color: #28a745; /* Bright green */
  /* border-color: #28a745 !important; */
  color: #fff !important;
}

/* Waiting 버튼 스타일 */
.btn-waiting {
  background-color: #d3d3d3; /* 밝은 회색 */
  color: #555 !important; /* 중간 회색 텍스트 */
  border: 1px solid #c0c0c0; /* 연한 회색 테두리 */
}

.btn-waiting-feedback {
  background-color: #e68a13; /* 밝은 회색 */
  color: #ffffff !important; /* 중간 회색 텍스트 */
}

.btn-waiting-feedback {
  background-color: #e68a13; /* 밝은 회색 */
  color: #ffffff !important; /* 중간 회색 텍스트 */
}

.btn-re-measure {
  background-color: #f13c3c; /* 밝은 회색 */
  color: #ffffff !important; /* 중간 회색 텍스트 */
}
</style>
