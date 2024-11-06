<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import type { FabData } from "./SampleStatusInterface";
import { getTodayAsString, getPrevious30DaysAsString } from "./SampleStatus";
import axios from "axios";
import type { ApplicationData, ApplicationDataResponse } from "./SampleStatusHanoiCspInterface";

// 데이터 상태 관리 변수
const applicationData = ref<ApplicationData[]>([]);

const finalDateDate = getTodayAsString();
const startingDate = getPrevious30DaysAsString(finalDateDate);


// "GetCSPSamplePlan?fromTime=2024-11-01&toTime=2024-12-05&_=173"
const url =
  "/OpeationMns/GetCSPSamplePlan?fromTime=" +
  startingDate +
  "&toTime=" +
  finalDateDate + "&_=173";

// 특정 URL로 GET 요청을 보내고 데이터를 가져오는 함수
async function fetchApplicationData() {
  try {
    const response = await axios.get<ApplicationDataResponse>(url);
    applicationData.value = response.data?.data || []; // 응답 데이터 할당, 없을 시 빈 배열로 초기화
  } catch (error) {
    console.error("Failed to fetch application data:", error);
  }
}




// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchApplicationData();
});

// // 현재 날짜와 한 달 전 날짜를 설정하는 함수
// const setInitialDates = () => {
//   const today = new Date();
//   const lastMonth = new Date();
//   lastMonth.setMonth(today.getMonth() - 1);

//   startDate.value = lastMonth;
//   endDate.value = today;
// };



</script>

<style>
.container {
  padding: 20px;
}
/* scoped 제거 후 전역 스타일로 지정 */

.el-table__row.important-row {
  background-color: rgb(0, 255, 0);
}

.el-table__row.warning-row {
  background-color: rgb(255, 165, 0);
}

.el-table__row.danger-row {
  background-color: rgb(250, 88, 88);
}
</style>
