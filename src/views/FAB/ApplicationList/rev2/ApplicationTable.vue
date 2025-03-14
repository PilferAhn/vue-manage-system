<script lang="ts">
export default {};
</script>
<template>
  <!-- Element Plus Table -->
  <div class="group-count">
    <div v-for="(count, group) in groupCounts" :key="group" class="group-box">
      <span>{{ group }}: {{ count }}개</span>
    </div>
  </div>

  <div class="table-wrapper">
    <el-table
      :data="processData"
      class="custom-table"
      style="min-width: 1000px"
      :border="true"
      height="640"
      :row-style="{ height: '30px' }"
      :row-class-name="tableRowClassName"
      :lazy="true"
    >
      <!-- <el-table-column label="선택" :align="'center'" width="50">
          <template #default="scope">
            <el-checkbox
              :model-value="idList.includes(scope.row.id)"
              @change="handleCheckboxChange(scope.row.id, $event)"
            />
          </template>
        </el-table-column> -->

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
        prop="priorityId"
        label="Priority"
        width="70"
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
      <!-- <el-table-column
        prop="destinationId"
        label="목적지"
        width="80"
        :align="'center'"
      /> -->
      <el-table-column prop="code" label="Code" width="60" :align="'center'" />
      <!-- FAB Insert Date를 날짜 선택기로 수정 -->
      <el-table-column label="담당자" width="150" :align="'center'">
        <template #default="scope">
          {{ scope.row.designer.userName }}
        </template>
      </el-table-column>
      <el-table-column label="투입일" width="110" :align="'center'">
        <template #default="scope">
          <!-- <el-date-picker
            v-model="scope.row.wantedFabStartDate"
            type="date"
            placeholder="Select date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleDateChange(scope.row)"
            style="width: 120px; height: 30px"
          /> -->
          {{ formatDate(scope.row.wantedFabStartDate) }}
        </template>
      </el-table-column>
      <el-table-column label="완료일" width="120" :align="'center'">
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
      <el-table-column
        fixed="right"
        label="Action"
        min-width="200"
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
    <el-button type="success" @click="downloadExcel">To Excel</el-button>
    <!-- <el-button type=""></el-button>
      <el-button type="warning"></el-button> -->
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, onMounted, reactive } from "vue";
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
import { getUserId } from "../../../../utils/account-utils";
import { getApplicationListByDict } from "../../../../utils/Fab/fab-application-utils";
import type { FabRequestForm } from "../../../../interface/fab-application-rev2";
import { ElMessageBox, ElMessage } from "element-plus";

const props = defineProps<{
  processData: FabRequest[];
  weekNumber: number;
}>();
const applications = reactive<FabRequest[]>([]);

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

const idList = ref<number[]>([]);

const handleClick = () => {};

const handleCheckboxChange = (id: number, checked: boolean) => {
  if (checked) {
    if (!idList.value.includes(id)) {
      idList.value.push(id);
    }
  } else {
    idList.value = idList.value.filter((itemId) => itemId !== id);
  }
};

const downloadExcel = async () => {
  const form = new FormData();

  const sendingData = ref<Object[]>([]);

  props.processData.forEach((fab) => {
    sendingData.value.push(convertKeysToPEP8(fab));
  });
};

const tableRowClassName = ({ row }: { row: FabRequest }) => {
  if (row.status === "cancel") {
    return "danger-row";
  } else if (row.status === "delay") {
    return "warning-row";
  }
  return "";
};

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

    // if (getUserId() !== "admin") {
    //   para["observer_id"] = getUserId();
    // }

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
    // getApplicationList를 호출하고 결과를 기다림
    props.processData.length = 0;
    let para = {
      users: true,
      wafer: true,
      idt_type: true,
      hs_type: true,
      idt_layers: true,
      is_pending: false,
      week_numbers: props.weekNumber,
    };

    // if (getUserId() !== "admin") {
    //   para["observer_id"] = getUserId();
    // }

    const data: FabRequestForm[] = await getApplicationListByDict(para);

    // const transformedData = data.map((item: any) => new FabApplication(item));
    props.processData.push(
      ...data.map((item: FabRequestForm) => new FabRequest(item))
    );
  } catch (error) {
    console.error("Error fetching application list:", error);
  }
});

const groupCounts = computed(() => {
  return props.processData.reduce((acc, item) => {
    acc[item.group] = (acc[item.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
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
