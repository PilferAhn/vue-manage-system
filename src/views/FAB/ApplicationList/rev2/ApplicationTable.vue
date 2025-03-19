<script lang="ts">
export default {};
</script>
<template>
  <!-- Element Plus Table -->
  <div class="group-count">
    <div class="group-box">
      총 의뢰: {{ totalQuantity }} (DV2 : {{ groupDv2Count }})
    </div>
    <div v-for="(stats, group) in groupStats" :key="group" class="group-box">
      <span>{{ group }}: {{ stats.count }}</span>
    </div>
    <!-- <div class="group-box">DV2: {{ groupDv2Count }}</div> -->
  </div>

  <div class="table-wrapper">
    <el-table
      :data="processData"
      class="custom-table"
      style="min-width: 1000px"
      :border="true"
      height="640"
      :row-style="{ height: '30px' }"
      :lazy="true"
    >
      <el-table-column
        type="index"
        label="No"
        width="50"
        :align="'center'"
      ></el-table-column>

      <el-table-column label="FabCard 작성유무" width="80" :align="'center'">
        <el-tag type="danger">No</el-tag>
      </el-table-column>

      <el-table-column prop="group" label="Group" width="140" :align="'center'">
        <template #default="scope">
          {{ scope.row.designer.department }}
        </template>
      </el-table-column>
      <el-table-column
        prop="process"
        label="Process"
        width="75"
        :align="'center'"
      >
        <template #default="scope">
          <span class="uppercase">{{ scope.row.wafer.sawTypeId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        prop="priorityId"
        label="Priority"
        width="85"
        :align="'center'"
      >
        <template #default="scope">
          <el-select v-model="scope.row.priorityId">
            <el-option
              v-for="prioriyOption in priorityList"
              :key="prioriyOption.key"
              :value="prioriyOption.value"
              :label="prioriyOption.label"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        prop="priorityId"
        label="Priority"
        width="85"
        :align="'center'"
      />

      <el-table-column
        prop="packageId"
        label="Package"
        width="80"
        :align="'center'"
      />
      <el-table-column
        prop="productName"
        label="Model Name"
        width="140"
        :align="'center'"
      />
      <el-table-column prop="note" label="목적" width="300" :align="'center'" />
      <el-table-column prop="is_aoi" label="AOI" width="70" :align="'center'">
        <template #default="scope">
          <el-tag v-if="scope.row.isAoi" type="success">Yes</el-tag>
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="quantity"
        label="수량"
        width="60"
        :align="'center'"
      />

      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        prop="code"
        label="Code"
        width="80"
        :align="'center'"
      >
        <template #default="scope">
          <el-select v-model="scope.row.code">
            <el-option label="C" value="C"></el-option>
            <el-option label="H" value="H"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        prop="code"
        label="Code"
        width="80"
        :align="'center'"
      ></el-table-column>

      <!-- FAB Insert Date를 날짜 선택기로 수정 -->
      <el-table-column label="담당자" width="150" :align="'center'">
        <template #default="scope">
          {{ scope.row.designer.userName }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        width="160"
        :align="'center'"
        label="투입일"
      >
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.wantedFabStartDate"
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else label="투입일" width="110" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.wantedFabStartDate) }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        width="160"
        :align="'center'"
        label="완료일"
      >
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.wantedFabFinishDate"
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-else label="완료일" width="120" :align="'center'">
        <template #default="scope">
          <span
            :style="{ color: scope.row.checkFabOutDate() ? 'inherit' : 'red' }"
          >
            {{ formatDate(scope.row.wantedFabFinishDate) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="Fab Card 전달일" width="120" :align="'center'">
        <template #default="scope">
          <span>{{ scope.row.calFabCardConveyDate() }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="waferCompany"
        label="Wafer 제조사"
        width="70"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.wafer.waferCompany }}
        </template>
      </el-table-column>
      <el-table-column
        prop="waferAngle"
        label="Wafer Angle"
        width="70"
        :align="'center'"
      />
      <el-table-column
        prop="waferThickness"
        label="Wafer Thickness"
        width="90"
        :align="'center'"
      />
      <el-table-column
        prop="waferType"
        label="Wafer Type"
        width="80"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.wafer.sawTypeId }}
        </template>
      </el-table-column>
      <el-table-column
        prop="idtMachineName"
        label="Machine Name"
        width="80"
        :align="'center'"
      />
      <el-table-column
        prop="idtThickness"
        label="막두께"
        width="300"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.createWaferInfo() }}
        </template>
      </el-table-column>

      <!-- getUserId() -->
      <el-table-column
        v-if="['w2150108', 'admin'].includes(getUserId())"
        label="엔지니어 Call"
        :align="'center'"
      >
        <template #default="scope">
          <el-select v-model="scope.row.isNeedEngineerCall">
            <el-option
              v-for="option in createBooleanOptions()"
              :key="option.key"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-else label="엔지니어 Call" :align="'center'">
        <template #default="scope">
          <el-tag v-if="scope.row.isNeedEngineerCall == true" type="success"
            >Yes</el-tag
          >
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="MST" :align="'center'" prop="isMst">
        <template #default="scope">
          <el-tag v-if="scope.row.mstThickness !== null" type="success"
            >Yes</el-tag
          >
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Dual IDT" :align="'center'">
        <template #default="scope">
          <!-- {{ scope.row.idt2Id }} -->
          <el-tag v-if="scope.row.idt2Id !== null" type="success">Yes</el-tag>
          <el-tag v-else type="danger">No</el-tag>
        </template>
      </el-table-column>

      <!-- v-if="['w2150108', 'admin'].includes(getUserId())" -->
      <el-table-column
        
        width="160"
        :align="'center'"
        label="MASK 입고일 IDT"
      >
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.idtMaskArrivalDate"
              
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column v-else label="MASK 입고일 IDT" width="110" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.idtMaskArrivalDate) }}
        </template>
      </el-table-column> -->

      <!-- v-if="['w2150108', 'admin'].includes(getUserId())" -->
      <el-table-column
        
        width="160"
        :align="'center'"
        label="MASK 입고일 PST"
      >
        <template #default="scope">
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <el-date-picker
              v-model="scope.row.pstMaskArrivalDate"
            ></el-date-picker>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column v-else label="MASK 입고일 IDT" width="120" :align="'center'">
        <template #default="scope">
          <span
            :style="{ color: scope.row.checkFabOutDate() ? 'inherit' : 'red' }"
          >
            {{ formatDate(scope.row.pstMaskArrivalDate) }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column label="비고" prop="note" width="180" :align="'center'">
        <template #default="scope">
          {{ scope.row.createTrimmingInfo() }}
        </template>
      </el-table-column>
      <el-table-column
        label="HS W/F 조건"
        prop="hsWaferInfo"
        width="400"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row.createHsWaferCondition() }}
        </template>
      </el-table-column>

      <!--         v-if="
          getUserId() === 'admin' ||
          getRole() === 'group leader' ||
          getUserId() === 'w2150108'"
        " -->

      <el-table-column

        fixed="right"
        label="Action"
        width = "235"
        :align="'center'"
      >
        <template #default="scope">
          <!-- <el-button
            type="primary"
            size="small"
            @click="updateStatus(scope.row, 'confirm')"
          >
            확정
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleUpdate(scope.row)"
          >
            Update
          </el-button>
          <el-button
          v-if="
          getUserId() === 'admin' ||
          
          getUserId() === 'w2150108'"
            type="warning"
            size="small"
            @click="
              confirmAction(
                scope.row,
                props.weekNumber + 1,
                true,
                'updateWeekNumber'
              )
            "
            >Delay</el-button
          >
          <el-button
          v-if="
          getUserId() === 'admin' ||
          
          getUserId() === 'w2150108'"
            type="danger"
            size="small"
            @click="confirmAction(scope.row, 0, true, 'pending')"
          >
            Pending
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div class="buttun-section">
    <!-- <el-button type="primary">SAVE</el-button> -->
    <!-- <el-button type="success" @click="downloadExcel">To Excel</el-button>     -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted, reactive, watch } from "vue";
import { FabRequest } from "../../../../interface/fab-application-rev2";
import {
  handleDateChange as externalHandleDateChange,
  updatePendingStatus,
  updateStatus,
  updateWeekNumber,
} from "../ApplicationsByWeek";
import InputText from "../../Common/InputText.vue";
import { formatDate } from "../../Common/Application";
import { convertKeysToPEP8 } from "../../../../utils/key-converter";
import { getRole, getUserId } from "../../../../utils/account-utils";
import {
  getApplicationListByDict,
  sendingForm,
} from "../../../../utils/Fab/fab-application-utils";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import { ElMessageBox, ElMessage } from "element-plus";
import { receivePriorityList } from "../../../../utils/Fab/fab-application-utils";
import { OptionInterface } from "../../../../interface/option";
import { createBooleanOptions } from "../../../../utils/utility";

const props = defineProps<{
  processData: FabRequest[];
  weekNumber: number;
}>();
const applications = reactive<FabRequest[]>([]);
const priorityList = ref<OptionInterface[]>([]);
// emit 정의
const emit = defineEmits<{
  (e: "update:processData", updatedData: FabRequest[]): void;
}>();

// 날짜 변경 처리 함수
const handleDateChange = (processData: FabRequest) => {
  // 외부 파일에 있는 handleDateChange 함수를 호출하고, 데이터를 업데이트한 후 emit으로 전달
  // externalHandleDateChange(processData);
  // emit을 통해 부모 컴포넌트로 업데이트된 processData를 전달
  emit("update:processData", [...props.processData]);
};

async function handleUpdate(row: FabRequest) {
  console.log(row)
  await sendingForm(row, "partial update");
}

async function confirmAction(
  row: FabRequest,
  weekNumber: number,
  isPending: boolean,
  type: string
) {
  const actionText =
    type === "updateWeekNumber" ? "다음 주로 연기" : "보류 처리";

  try {
    await ElMessageBox.confirm(
      `해당 항목을 "${actionText}" 하시겠습니까?`,
      "확인",
      {
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        type: "warning",
      }
    );

    // 사용자가 확인을 누르면 실행
    await handleStatus(row, weekNumber, isPending, type);

    ElMessage({
      type: "success",
      message: `"${actionText}" 처리되었습니다.`,
    });
  } catch (error) {
    // 사용자가 취소를 누르면 아무 작업도 하지 않음
    ElMessage({
      type: "info",
      message: `"${actionText}" 작업이 취소되었습니다.`,
    });
  }
}

async function handleStatus(
  row: FabRequest,
  weekNumber: number,
  isPending: boolean,
  type: string
) {
  if (type === "updateWeekNumber") {
    updateWeekNumber(row, weekNumber);
  } else {
    updatePendingStatus(row, isPending);
  }

  props.processData.length = 0;

  try {
    // getApplicationList를 호출하고 결과를 기다림

    let para = {
      users: true,
      wafer: true,
      idt_type: true,
      hs_type: true,
      idt_layers: true,
      is_pending: false,
      week_numbers: props.weekNumber,
    };

    if (!["2150108", "admin"].includes(getUserId())) {
      para["observer_id"] = getUserId();
    }

    const data: FabRequestForm[] = await getApplicationListByDict(para);

    // const transformedData = data.map((item: any) => new FabApplication(item));
    props.processData.push(
      ...data.map((item: FabRequestForm) => new FabRequest(item))
    );
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
}

onMounted(async () => {
  try {
    priorityList.value = await receivePriorityList();

    // getApplicationList를 호출하고 결과를 기다림
    props.processData.length = 0;
    let para = {
      users: true, // content Loader option
      wafer: true, // content Loader option
      idt_type: true, // content Loader option
      hs_type: true, // content Loader option
      idt_layers: true, // content Loader option
      is_pending: false, // Row filter
      week_numbers: props.weekNumber, // Row filter
    };

    if (!["2150108", "admin"].includes(getUserId())) {
      para["observer_id"] = getUserId();
    }

    const data: FabRequestForm[] = await getApplicationListByDict(para);

    // const transformedData = data.map((item: any) => new FabApplication(item));
    props.processData.push(
      ...data.map((item: FabRequestForm) => new FabRequest(item))
    );
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
});

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
</script>

<style scope>
.table-wrapper {
  max-width: 100%;
  /* overflow-x: auto; */
}

.custom-table {
  font-size: 12px;
  padding-right: 10px;
  margin-right: 10px;
}

.group-count {
  display: flex;
  gap: 10px;
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

.buttun-section {
  margin-top: 15px;
}

.el-table__row.important-row {
  background-color: rgb(0, 255, 0);
}

.el-table__row.warning-row {
  background-color: rgb(233, 215, 181);
}

.el-table__row.danger-row {
  background-color: rgb(250, 214, 214);
}
</style>
