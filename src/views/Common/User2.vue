<template>
    <el-row :gutter="20" class="demo-form-inline">
      <el-col :span="6">
        <el-form-item label="Designer">
          <template #label>
            Designer
            <el-checkbox v-model="showAllDesigners" size="small" class="all-designers">전체</el-checkbox>
          </template>
          <el-autocomplete
            v-model="props.fabApplication.designer.userName"
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
      <el-col :span="6">
        <el-form-item label="Desinger ID" :prop="props.designerProp">
          <el-input
            v-model="props.fabApplication.designer.id"
            disabled
            style="width: 220px"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Requester">
          <el-autocomplete
            v-model="props.fabApplication.requester.userName"
            placeholder="의뢰자를 입력하세요"
            :fetch-suggestions="
              (queryString, cb) => querySearch(queryString, cb, 'requester')
            "
            @select="(item) => handleSelect(item, 'requester')"
            value-key="label"
            class="wide-select"
          ></el-autocomplete>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="Requester ID" :prop="'requesterId'">
          <el-input
            v-model="props.fabApplication.requester.id"
            disabled
            style="width: 220px"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </template>
  
  <script lang="ts" setup>
  import { reactive, ref, watch } from "vue";
  import { useUserOptions } from "./utility";
  import { getUserId } from "../../utils/account-utils";
  import type { FabRequestForm } from "../../interface/fab-application-rev2";
  import type { User } from "../../interface/user";
  
  const { userOptions } = useUserOptions();

  // Designer 는 기본적으로 설계 그룹 인원 + role 이 designer 인 인원만 표시 ('전체' 체크 시 전 인원)
  const DESIGNER_DEPARTMENTS = new Set([
    "SAW개발그룹(A)",
    "SAW개발그룹(B)",
    "SAW개발그룹(C)",
    "WHC/R&D Team",
    "WHC/CSP",
    "WJC/R&D Team",
  ]);
  const showAllDesigners = ref(false);
  const props = defineProps<{
    fabApplication: FabRequestForm;
    designerProp: string;
    requesterProp: string;
  }>();
  
  watch(
    () => props.fabApplication.designer.id,
    (newVal, oldVal) => {
      props.fabApplication.designerId = newVal;
    }
  );
  
  watch(
    () => props.fabApplication.requester.id,
    (newVal, oldVal) => {
      props.fabApplication.requesterId = newVal;
    }
  );
  
  // 사용자의 입력을 기준으로 필터링된 결과를 반환하는 공통 함수
  const querySearch = (
    queryString: string,
    cb: (suggestions: { value: string; label: string; key: string }[]) => void,
    fieldType: string // 'designer' 또는 'requester'로 구분
  ) => {
    const query = (queryString ?? "").toLowerCase();
    const results = userOptions.value.filter(
      (user) =>
        user.label.toLowerCase().includes(query) &&
        (fieldType !== "designer" ||
          showAllDesigners.value ||
          user.role === "designer" ||
          DESIGNER_DEPARTMENTS.has(user.department ?? ""))
    );
    // 로그인한 본인을 맨 위로
    const myId = getUserId();
    results.sort((a, b) => Number(b.value === myId) - Number(a.value === myId));
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
        // emit("update:designerId", selectedUser.value); // 개발자 ID 업데이트
        props.fabApplication.designer.id = selectedUser.value;
        // emit("update:designer", item.label)
        //   emit("update:designer", item.label); // 개발자 ID 업데이트
      } else if (fieldType === "requester") {
        props.fabApplication.requester.id = selectedUser.value;
        // emit("update:requester", selectedUser.value); // 개발자 ID 업데이트
        // emit("update:requesterId", selectedUser.value); // 개발자 ID 업데이트
        //   emit("update:requesterId", item.label); // 개발자 ID 업데이트
      }
    }
  };
  </script>
  
  <style scoped>
  .all-designers {
    margin-left: 8px;
    height: auto;
  }
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