<template>
  <!-- Display all items in the referenceSpec array in a single table -->
  <el-table :data="referenceSpec" style="width: 100%">
    <!-- Spec Start column -->

    <el-table-column label="구분">
      <template #default="{ row }">
        <el-select v-model="row.typ" placeholder="Select Type">
          <el-option label="IL" value="IL"></el-option>
          <el-option label="ATT" value="ATT"></el-option>
          <el-option label="ATT(상온)" value="ATT(상온)"></el-option>
          <el-option label="Output VSWR" value="Output VSWR"></el-option>
          <el-option label="Input VSWR" value="Input VSWR"></el-option>
        </el-select>
      </template>
    </el-table-column>

    <el-table-column label="Peek Type">
      <template #default="{ row }">
        <el-select v-model="row.peek_type" placeholder="Peek Type">
          <el-option label="MAX" value="max"></el-option>
          <el-option label="MIN" value="min"></el-option>
          <!-- <el-option label="ATT(상온)" value="ATT(상온)"></el-option>
          <el-option label="Output VSWR" value="Output VSWR"></el-option>
          <el-option label="Input VSWR" value="Input VSWR"></el-option> -->
        </el-select>
      </template>
    </el-table-column>

    <el-table-column prop="spec_start" label="Spec Start">
      <template #default="{ row }">
        <el-input v-model="row.spec_start" placeholder="Spec Start"></el-input>
      </template>
    </el-table-column>

    <!-- Spec Stop column -->
    <el-table-column prop="spec_stop" label="Spec Stop">
      <template #default="{ row }">
        <el-input v-model="row.spec_stop" placeholder="Spec Stop"></el-input>
      </template>
    </el-table-column>

    <!-- Marker Left column -->
    <el-table-column prop="marker_left" label="Marker Left">
      <template #default="{ row }">
        <el-input
          v-model="row.marker_left"
          placeholder="Marker Left"
        ></el-input>
      </template>
    </el-table-column>

    <!-- Marker Right column -->
    <el-table-column prop="marker_right" label="Marker Right">
      <template #default="{ row }">
        <el-input
          v-model="row.marker_right"
          placeholder="Marker Right"
        ></el-input>
      </template>
    </el-table-column>

    <!-- Spec IL column -->
    <el-table-column prop="spec_il" label="Spec ID">
      <template #default="{ row }">
        <el-input v-model="row.spec_il" placeholder="Spec ID"></el-input>
      </template>
    </el-table-column>

    <!-- Port column with inline "S" -->
    <el-table-column prop="output" label="Port" width="200">
      <template #default="{ row }">
        <span style="display: flex; align-items: center">
          S<el-input
            v-model="row.output"
            placeholder="0"
            style="width: 50px; margin-left: 4px"
          ></el-input>
          <el-input
            v-model="row.input"
            placeholder="0"
            style="width: 50px"
          ></el-input>
        </span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Spec } from "./testRfLimitInterface";

// Props for reference_spec array
const props = defineProps<{
  referenceSpec: Spec[];

}>();
</script>

<style scoped>
/* Add styles as necessary */
</style>
