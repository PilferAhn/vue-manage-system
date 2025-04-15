<script lang="ts">
export default {};
</script>
<template>
  <div class="container">
    <SearchBar @search="handleSearch" />
    <AdminTable :userList="filteredList" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { FabRequestCreateSchedule } from "../../../interface/fab-request-create-schedule";
import { sendPostRequest } from "../../../utils/httpProtocol";
import { getFabRequestCreateScheduleList } from "../../../utils/Fab/fab-request-create-schedule";
import AdminTable from "./AdminTable.vue";
import SearchBar from "./SearchBar.vue";

const handleSearch = (type: "userId" | "userName", keyword: string) => {
  if (!keyword) {
    filteredList.value = userList.value;
    return;
  }

  filteredList.value = userList.value.filter((item) => {

    let target = ""
    if(type === "userId"){
        target = item[type]?.toString().toLowerCase();
    }
    else{
        target = item.user.userName?.toString().toLowerCase();
    }    
    return target?.includes(keyword.toLowerCase());
  });
};

const userList = ref<FabRequestCreateSchedule[]>([]);
const filteredList = ref<FabRequestCreateSchedule[]>([]);

onMounted(async () => {
  userList.value = await getFabRequestCreateScheduleList();
  filteredList.value = userList.value;  
});
</script>

<style></style>
