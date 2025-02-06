<template>
    <el-row :gutter="20" class="demo-form-inline">
      <el-col :span="12">
        <el-form-item label="개발자">
          <el-autocomplete
            v-model="localDesigner"
            placeholder="개발자를 입력하세요"
            :fetch-suggestions="
              (queryString, cb) => querySearch(queryString, cb, 'designer')
            "
            @select="(item) => handleSelect(item, 'designer')"
            value-key="label"
            class="wide-select"
          ></el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="의뢰자">
          <el-autocomplete
            v-model="localRequester"
            placeholder="의뢰자 입력"
            :fetch-suggestions="
              (queryString, cb) => querySearch(queryString, cb, 'designer')
            "
            @select="(item) => handleSelect(item, 'designer')"
            value-key="label"
            class="wide-select"
          ></el-autocomplete>
        </el-form-item>
      </el-col>
    </el-row>
  </template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useUserOptions } from "./utility";
import { watch } from "fs";
const { userOptions } = useUserOptions();
const props = defineProps<{
  designer: string;
  designerId: string;
  requester: string;
  requesterId: string;
}>();

const localDesigner = ref(props.designer);
const localDesignerId = ref(props.designerId);
const localRequester = ref(props.requester);
const localRequesterId = ref(props.requesterId);

const emit = defineEmits<{
  (e: "update:designer", value: string): void;
  (e: "update:designerId", value: string): void;
  (e: "update:requester", value: string): void;
  (e: "update:requesterId", value: string): void;
}>();

// watch(
//   () => localDesigner.value,
//   (newVal, oldVal) => {

//   }
// );

// 사용자의 입력을 기준으로 필터링된 결과를 반환하는 공통 함수
const querySearch = (
  queryString: string,
  cb: (suggestions: { value: string; label: string; key: string }[]) => void,
  fieldType: string // 'designer' 또는 'requester'로 구분
) => {
  const results = userOptions.value.filter((user) =>
    user.label.toLowerCase().includes(queryString.toLowerCase())
  );
  cb(results);
};

// 개발자와 의뢰자 선택 시 처리하는 공통 함수
const handleSelect = (
  item: { value: string; label: string },
  fieldType: string
) => {
  const selectedUser = userOptions.value.find(
    (user) => user.label === item.label
  );
  if (selectedUser) {
    if (fieldType === "designer") {
      emit("update:designerId", selectedUser.value); // 개발자 ID 업데이트
      emit("update:designer", item.label)
      //   emit("update:designer", item.label); // 개발자 ID 업데이트
    } else if (fieldType === "requester") {
      emit("update:requester", selectedUser.value); // 개발자 ID 업데이트
      emit("update:requesterId", selectedUser.value); // 개발자 ID 업데이트
      //   emit("update:requesterId", item.label); // 개발자 ID 업데이트
    }
  }
};


</script>

<style scoped>
.demo-form-inline {
  width: 100%;
}

.wide-select {
  width: 100%;
}
</style>

<script lang="ts">
export default {};
</script>
