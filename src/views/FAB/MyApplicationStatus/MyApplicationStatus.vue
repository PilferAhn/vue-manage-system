<template>
  <div class="container">
    <!-- Element Plus Table -->
    <el-table :data="processData" class="custom-table" style="width: 100%">
      <el-table-column
        prop="group"
        label="Group"
        width="100"
        :align="'center'"
      />
      <!-- Process column where the text will be transformed to uppercase -->
      <el-table-column
        prop="process"
        label="Process"
        width="100"
        :align="'center'"
      >
        <template #default="scope">
          <span class="uppercase">{{ scope.row.process }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="priority"
        label="Priority"
        width="80"
        :align="'center'"
      />
      <el-table-column
        prop="packageType"
        label="Package Type"
        width="150"
        :align="'center'"
      />
      <el-table-column
        prop="modelName"
        label="Model Name"
        width="150"
        :align="'center'"
      />
      <el-table-column
        prop="purpose"
        label="목적"
        width="350"
        :align="'center'"
      />

      <el-table-column
        prop="quantity"
        label="수량"
        width="100"
        :align="'center'"
      />
      <el-table-column
        prop="destination"
        label="출하"
        width="150"
        :align="'center'"
      />
      <!-- New Column for Status Buttons -->
      <el-table-column label="Status" width="100" :align="'center'">
        <template #default="scope">
          <el-button
            :type="scope.row.status === 'confirmed' ? 'primary' : ''"
            :plain="scope.row.status === 'created'"
            :style="{ color: scope.row.status === 'created' ? '#808080' : '' }"
            size="small"
          >
            {{ scope.row.status === "confirmed" ? "confirmed" : "created" }}
          </el-button>
        </template>
      </el-table-column>
      <!-- New Column for Confirm/Delete Buttons -->
      <el-table-column label="Action" width="300" :align="'center'">
        <template #default="scope">
          <el-button
            type="info"
            size="small"
            @click="handleRowClick(scope.row.uuid)"
            >자세히</el-button
          >
          <!-- Confirm Button -->
          <el-button
            type="primary"
            size="small"
            @click="confirmAction(scope.row.id)"
            >확정</el-button
          >
          <!-- Delete Button -->
          <el-button
            type="danger"
            size="small"
            @click="deleteAction(scope.row.uuid)"
            disabled
            >삭제</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import {
  convertToCamelCase,
  confirmApplication,
  deleteApplication,
} from "../Common/Application"; // Assuming the utility is stored here
import type { ProcessData } from "../Interface/ApplicationInterface";

// Reactive array to hold processData
const processData = ref<ProcessData[]>([]);

// Fetch data when the component is mounted
const fetchProcessData = async () => {
  try {
    
    const formData = new FormData();
    formData.append("name", "admin");
    
    const response =await axios.post(
        "/fab_monitoring/get_fab_request_list_person", formData);

    // processData.value = convertToCamelCase(response.data["data"]); // Convert fetched data to camelCase
    // console.log(processData.value);
    processData.value = convertToCamelCase(response.data); // Convert fetched data to camelCase
    
  } catch (error) {
    console.error("Failed to fetch process data:", error);
  }
};

// Use the imported functions for Confirm/Delete Actions
const confirmAction = (id: string) => {
  confirmApplication(id);
};

const deleteAction = (id: string) => {
  deleteApplication(id);
};

// Function to handle row clicks and navigate to a new page
const handleRowClick = (id: string) => {
  // For example, navigate to a detailed page with the row's UUID
  router.push({ name: "LoadApplication", params: { uuid: id } });
};

// Call fetchProcessData when the component is mounted
onMounted(() => {
  fetchProcessData();
});

const router = useRouter(); // Access the Vue Router

</script>

<style scoped>
/* Add margin or padding to give extra space for the scrollbar */
.container {
  padding-right: 30px; /* Increases space between the scroll bar and the table */
}

.custom-table {
  box-sizing: border-box;
  padding-right: 20px; /* Adds padding inside the table for extra space */
  margin-right: 10px; /* Adds a margin outside the table */
}

.uppercase {
  text-transform: uppercase;
}
</style>
