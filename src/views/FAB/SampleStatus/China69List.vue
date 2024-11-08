<template>
  <div>
    <!-- 데이터 테이블 -->

    <el-table :data="filteredFabData" style="width: 100%" height="800px">
      <!-- Model Name 열 -->
      <el-table-column type="index" label="#" width="50" :align="'left'" />
      <el-table-column
        prop="productName"
        label="Model Name"
        width="200"
        :align="'left'"
      ></el-table-column>

      <!-- PL 열 -->
      <el-table-column
        prop="pl"
        label="PL"
        width="150"
        :align="'left'"
      ></el-table-column>
      <!-- PL 열 -->
      <el-table-column
        label="여기부터 MES 연동"
        width="150"
        :align="'left'"
      ></el-table-column>
      <el-table-column label="FE FAB" width="100" :align="'center'">
        <!-- <el-table-column label="강백호 FAB IN" prop="fabIn" :align="'left'"></el-table-column> -->
        <el-table-column label="MES FAB IN" :align="'left'">
          <template #default="scope">
            {{ formatDate(scope.row.mesFabIn) }}
          </template>
        </el-table-column>
        <el-table-column label="현위치 (투입시간)" :align="'left'">
          <template #default="scope">
            <span v-if="scope.row.feName !== undefined">
              {{ scope.row.feName }} ({{ formatDateTime(scope.row.feStart) }})
            </span>
          </template>
        </el-table-column>
        <el-table-column label="출하(Assy)" :align="'left'">
          <template #default="scope">
            {{ formatDate(scope.row.feOut) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="whcCsp" label="Assay" width="150" :align="'left'">
        <el-table-column label="Assay In">
          <template #default="scope">
            {{ formatDate(scope.row.assayIn) }}
          </template>
        </el-table-column>
        <el-table-column label="공정명 (투입시간)">
          <template #default="scope">
            <span v-if="scope.row.assayName !== undefined">
              {{ scope.row.assayName }} (
              {{ formatDateTime(scope.row.assayStart) }} )
            </span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import type { FabData } from "./SampleStatusInterface";
import { getTodayAsString, getPrevious30DaysAsString } from "./SampleStatus";
import axios from "axios";
import { cn69ModelNames } from "./Cn69List";
import { getMaterialInfo } from "./China69List";
import type { MaterialInfo } from "./fe-meas-interface";
import { formatDate, formatDateTime } from "../Common/Application";

const fabData = ref<FabData[]>([]); // 전체 데이터를 저장
const filteredFabData = ref<FabData[]>([]); // 필터링된 데이터를 저장
const NonefilteredByDate = ref<FabData[]>([]); // 필터링된 데이터를 저장
const startDate = ref<Date | null>(null); // 시작 날짜
const endDate = ref<Date | null>(null); // 끝 날짜
const mesData = ref<MaterialInfo[]>([]);
const mesDict = ref<Record<string, MaterialInfo>>({}); // m
const isCN69Filter = ref(true); // CN69 필터 활성화 여부
const finalDateDate = getTodayAsString();
const startingDate = getPrevious30DaysAsString(finalDateDate);
const materialString = ref("");

// const tempFabData = ref<FabData>();
// tempFabData.value.productName = "DG35CA4-M"
// tempFabData.value.pl = "장훈"

const newFabData: FabData = {
  // 객체의 필요한 속성들 초기화
  productName: "DG35CA4-M",
  pl: "장훈",
  // FabData에 필요한 다른 속성들도 추가
};

const url =
  "/bfsm2/splPlanOfCommitment?hideCheck=false&searchStartTime=" +
  startingDate +
  "&searchEndTime=" +
  finalDateDate;

// 현재 날짜와 한 달 전 날짜를 설정하는 함수
const setInitialDates = () => {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  startDate.value = lastMonth;
  endDate.value = today;
};

const fetchFabData = async () => {
  try {
    const response = await axios.get<FabData[]>(url);
    fabData.value = response.data;
    filteredFabData.value = fabData.value; // 초기에는 모든 데이터를 표시
    filterFabData(); // 데이터를 가져온 후 필터링 한 번 실행
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// fabIn 날짜 기준으로 데이터를 필터링하고 정렬하는 함수
const filterFabData = async () => {
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value).getTime();
    const end = new Date(endDate.value).getTime();

    // 먼저 realFabIn이 null인 항목을 찾고 separation이 '연구소'가 아닌 항목을 필터링하여 idx로 내림차순 정렬
    const nullRealFabIn = fabData.value
      .filter((item) => item.realFabIn === null && item.separation !== "연구소")
      .sort((a, b) => b.idx - a.idx);

    // realFabIn이 null이 아닌 항목을 startDate와 endDate로 필터링 후 separation이 '연구소'가 아닌 항목을 idx로 내림차순 정렬
    const filteredByDate = fabData.value.filter(
      (item) =>
        item.realFabIn !== null &&
        new Date(item.realFabIn).getTime() >= start &&
        new Date(item.realFabIn).getTime() <= end &&
        item.separation !== "연구소"
    );

    // filteredByDate.forEach((item) => {
    //   const splitValue = item.productName.split("@")[0].toLowerCase();
    // });

    filteredFabData.value = filteredByDate.filter((item) =>
      cn69ModelNames.includes(item.productName.split("@")[0].toLowerCase())
    );

    NonefilteredByDate.value = nullRealFabIn.filter((item) =>
      cn69ModelNames.includes(item.productName.split("@")[0].toLowerCase())
    );

    filteredFabData.value = [
      ...NonefilteredByDate.value,
      ...filteredFabData.value,
    ].sort((a, b) => b.idx - a.idx);

    filteredFabData.value.push(newFabData);

    filteredFabData.value.filter((data, index) => {
      materialString.value += data.productName + ",";
    });

    mesData.value = await getMaterialInfo(materialString.value);

    if (mesData) {
      // mes 배열에서 materialName을 키로 하는 객체 생성
      mesDict.value = mesData.value.reduce((acc, obj) => {
        acc[obj.material_id] = obj;
        return acc;
      }, {} as Record<string, MaterialInfo>);
    }

    for (let i = 0; i < filteredFabData.value.length; i++) {
      const productName = filteredFabData.value[i].productName;

      if (mesDict.value[productName] !== undefined) {
        const tempDict = mesDict.value[productName];

        if (tempDict["cassettes_member"].length != 0) {
          filteredFabData.value[i].mesFabIn =
            tempDict["cassettes_member"][0]["creation_date"];
          filteredFabData.value[i].feName =
            tempDict["cassettes_member"][0]["operation"]["name"];
          filteredFabData.value[i].feSite =
            tempDict["cassettes_member"][0]["operation"]["site_id"];

          filteredFabData.value[i].feStart =
            tempDict["cassettes_member"][0]["creation_date"];

          if (tempDict["cassettes_member"][0]["hanoi_csp"] === null) {
          } else {
            console.log(tempDict["cassettes_member"][0]["hanoi_csp"]);
            filteredFabData.value[i].assayIn =
              tempDict["cassettes_member"][0]["hanoi_csp"]["creation_date"];
            filteredFabData.value[i].assayName =
              tempDict["cassettes_member"][0]["hanoi_csp"]["operation"]["name"];
            filteredFabData.value[i].assayStart =
              tempDict["cassettes_member"][0]["hanoi_csp"]["site_in_date"];
          }

          if (
            tempDict["cassettes_member"][0]["operation"]["name"] ===
            "Transit 공정"
          ) {
            filteredFabData.value[i].feOut =
              tempDict["cassettes_member"][0]["prev_history"]["end_date"];
          }

          //     filteredFabData.value[i].assayIn = "-";
          //     filteredFabData.value[i].assayName = "-";
          //   } else {
          //     tempDict["cassettes_member"][0];

          //     filteredFabData.value[i].assayIn =
          //       tempDict["cassettes_member"][0]["createion_date"][""];
          //     filteredFabData.value[i].assayName =
          //       tempDict["cassettes_member"][0]["hanoi_scp"]["operation"]["name"];
          //     filteredFabData.value[i].assayStart =
          //       tempDict["cassettes_member"][0]["hanoi_scp"]["movein_date"];
          //   }
        }
      } else {
        // console.log(productName); // mesDict에 없는 productName을 출력
      }
    }

    // 두 배열을 합쳐서 필터링된 데이터를 생성
  } else {
    // 날짜가 선택되지 않으면 separation이 '연구소'가 아닌 모든 데이터를 표시하고 정렬
    filteredFabData.value = fabData.value
      .filter((item) => item.separation !== "연구소")
      .sort((a, b) => b.idx - a.idx);
  }
};

// 컴포넌트가 마운트될 때 데이터 가져오기 및 날짜 설정
onMounted(() => {
  setInitialDates(); // 시작 날짜와 끝 날짜를 설정
  fetchFabData(); // 데이터를 가져온 후 필터링을 자동으로 실행
});

const today = new Date();
today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 초기화
</script>

<style></style>
