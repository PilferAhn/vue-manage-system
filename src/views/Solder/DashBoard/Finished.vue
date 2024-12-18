<template>
  <div>
    <div class="section-header">
      <h3 class="section-title">12월 완료 항목</h3>
      <p class="section-description">12월에 완료된 항목을 집계합니다.</p>
    </div>
    <el-table :data="measurementTypes" border :table-layout="'auto'">
      <el-table-column
        label="Meas Type"
        prop="measurementType"
        :align="'center'"
      ></el-table-column>
      <el-table-column label="Measurer" :align="'center'">
        <template #default="scope">
          <span v-for="(person, index) in scope.row.persons" :key="index">
            {{ person.name }} <br />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Quantity" :align="'center'">
        <template #default="scope">
          <span v-for="(person, index) in scope.row.persons" :key="index">
            {{ person.quantity }} <br />
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import type {
  Measurement,
  ApplicationData,
} from "../../../interface/solderAppInterface";
import { getEarliestTimeOfCurrentMonth } from "../../../utils/date-utils";

interface Person {
  name: string;
  quantity: number;
}

interface MeasurementType {
  measurementType: string;
  persons: Person[];
}

// props로 ApplicationData 배열 받음
const props = defineProps<{
  applications: ApplicationData[];
}>();

const measurementTypes = ref<MeasurementType[]>([]);
const measurements = ref<Measurement[]>([]);

watch(
  () => props.applications,
  (newVal) => {
    measurementTypes.value.length = 0;
    measurements.value.length = 0;
    newVal.forEach((app) => {
      app.measurements.forEach((meas) => {
        if (meas.finishedDate) {
          const finishedDate = new Date(meas.finishedDate);
          if (finishedDate >= getEarliestTimeOfCurrentMonth()) {
            meas.measurer = app.measurer;
            measurements.value.push(meas);
          }
        }
      });
    });

    for (let x = 0; x < measurements.value.length; x++) {
      if (measurements.value[x].measurer === "") {
        continue;
      }
      const targetMeas = measurementTypes.value.find(
        (m) => m.measurementType === measurements.value[x].measurementType
      );
      if (!targetMeas) {
        measurementTypes.value.push({
          measurementType: measurements.value[x].measurementType,
          persons: [
            {
              name: measurements.value[x].measurer.toUpperCase(),
              quantity: measurements.value[x].quantity,
            },
          ],
        });
      } else {
        const targetPerson = targetMeas.persons.find(
          (p) => p.name === measurements.value[x].measurer.toUpperCase()
        );

        if (!targetPerson) {
          targetMeas.persons.push({
            name: measurements.value[x].measurer.toUpperCase(),
            quantity: measurements.value[x].quantity,
          });
        } else {
          targetPerson.quantity += measurements.value[x].quantity;
        }
      }
    }
  },
  { immediate: true, deep: true }
);
</script>
<script lang="ts">
export default {};
</script>
<style scope>
.section-header {
  margin-bottom: 12px; /* 제목과 테이블 사이 여백 */
  text-align: left;
}

.section-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.section-description {
  font-size: 0.9em;
  color: #666;
  margin: 4px 0 0;
}
</style>
