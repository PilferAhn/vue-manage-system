<template>
  <div class="container">
    <el-form
      :model="localStockInfo"
      :rules="rules"
      label-width="120px"
      ref="formRef"
    >
      <el-form-item prop="reelId" label="Reel ID">
        <el-input v-model="localStockInfo.reelId" placeholder="Scan Reel ID" />
      </el-form-item>

      <el-form-item prop="location" label="Location">
        <el-input
          v-model="localStockInfo.location"
          placeholder="The Place where LOT will store"
        />
      </el-form-item>

      <el-form-item label="Total Quantity">
        <el-input
          v-model="localStockInfo.quantity"
          :min="0"
          placeholder="Entire Chip Quantity"
        />
      </el-form-item>

      <div v-if="props.formType === 'load'">
        <el-form-item prop="assumedQuantity" label="Usage Quantity">
          <el-input
            v-model="localStockInfo.assumedQuantity"
            placeholder="Enter the how many sample do you used?"
          />
        </el-form-item>

        <el-form-item label="Remain">          
          {{ localStockInfo.quantity - localStockInfo.assumedQuantity }}
        </el-form-item>
      </div>

      <el-form-item prop="receiver" label="Receiver">
        <el-input
          v-model="localStockInfo.receiver"
          placeholder="Enter the Receiver Name"
        />
      </el-form-item>

      <!-- <el-form-item prop="modelName" label="PN_FAB">
        <el-input
          v-model="localStockInfo.modelName"
          placeholder="Enter the Model Name"
        />
      </el-form-item> -->

      <!-- <el-form-item prop="designer" label="Designer">
        <el-autocomplete
          v-model="localStockInfo.designer"
          :fetch-suggestions="querySearch"
          placeholder="Enter or select a designer"
          @select="handleSelect"
          clearable
          filterable
        ></el-autocomplete>
      </el-form-item> -->

      <div v-if="props.formType === 'create'">
        <el-button type="primary" @click="handleSubmit('create')"
          >Submit</el-button
        >
      </div>
      <div v-if="props.formType === 'load'">
        <el-button type="primary" @click="handleSubmit('update')"
          >Update</el-button
        >
        <el-button type="danger" @click="handleSubmit('delete')"
          >Remove</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, watch, ref, onMounted } from "vue";
import type { StockInfo } from "../../../../interface/stock";
import { rules } from "../Common/ApplicationRules";
import { submitForm } from "./Application";
import type { FormInstance } from "element-plus";
import { useRouter } from "vue-router";
// import { getUserList } from "../../../../utils/user-utils";
import { User } from "../../../../interface/user";
import { useUserOptions } from "../../../Common/utility";

const {userOptions}  = useUserOptions();
console.log(userOptions)
// console.log(userOptions)
// console.log(getUserList())
const userList = ref<User[]>([]);
const props = defineProps<{ stockInfo: StockInfo; formType: string }>();
const formRef = ref<FormInstance>();
const localStockInfo = ref({ ...props.stockInfo });

const router = useRouter(); // Make sure this is within setup
const handleSubmit = async (action_type: string) => {
  submitForm(localStockInfo.value, formRef.value, action_type, router);
};

// Watch for changes in props to keep localStockInfo in sync

// onMounted(async()=>{
//   userList.value = await getUserList()  
// })

watch(
  () => props.stockInfo,
  (newVal) => {
    localStockInfo.value = { ...newVal };
  },
  { deep: true, immediate: true }
);

// 검색어에 따라 필터링된 사용자 목록 반환
// const querySearch = (queryString: string, cb: (results: { value: string }[]) => void) => {
//   const results = userOptions.value
//     .filter((user) => user.label.toLowerCase().includes(queryString.toLowerCase()))
//     .map((user) => ({ value: user.label }));

//   cb(results);
// };

// 선택한 사용자 반영
// const handleSelect = (item: { value: string }) => {
//   localStockInfo.value.designer = item.value;
// }; 
</script>
