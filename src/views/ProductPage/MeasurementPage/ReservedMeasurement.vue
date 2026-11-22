<!-- 
    - 측정이 진행되거나 
    - 측정이 대기중인 의뢰에 대해서
    - 측정을 구분지어서 List Up 해주는 페이지.

        1) Max Fuse
        2) Life
        3) Aging
        4) AMR
        5) STEP
        6) Drop
        7) Self Heating

-->

<template>
  <el-tabs type="border-card" class="demo-tabs" v-model="activeTabName">
    <el-tab-pane label="MAX FUSE" name="maxFuse">
      <!-- MAX FUSE 탭 내용 -->
      <template v-if="activeTabName === 'maxFuse'">
        <measurement-tab
          :testType="'Max Fuse'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab> </template
      >
    </el-tab-pane>
    <el-tab-pane label="Life Time" name="life">
      <!-- Life Time 탭 내용 -->
      <template v-if="activeTabName === 'life'">
        <measurement-tab
          :testType="'Life'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>
    <el-tab-pane label="AMR" name="AMR">
      <!-- Life Time 탭 내용 -->
      <template v-if="activeTabName === 'AMR'">
        <measurement-tab
          :testType="'AMR'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>
    <el-tab-pane label="Aging" name="Aging">
      <!-- Life Time 탭 내용 -->
      <template v-if="activeTabName === 'Aging'">
        <measurement-tab
          :testType="'Aging'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>
    <el-tab-pane label="Self Heating" name="Self Heating">
      <!-- Life Time 탭 내용 -->
      <template v-if="activeTabName === 'Self Heating'">
        <measurement-tab
          :testType="'Self Heating'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>
    <el-tab-pane label="Drop" name="Drop">
      <!-- Life Time 탭 내용 -->
      <template v-if="activeTabName === 'Drop'">
        <measurement-tab
          :testType="'Drop'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>
    <el-tab-pane label="Step" name="Step">
      <!-- Life Time 탭 내용 -->
      <template v-if="activeTabName === 'Step'">
        <measurement-tab
          :testType="'Step'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>
    <!-- SmarterMicro Fuse 탭 내용 -->
    <el-tab-pane label="SmarterMicro Fuse" name="SmarterMicro Fuse">
      <template v-if="activeTabName === 'SmarterMicro Fuse'">
        <measurement-tab
          :testType="'SmarterMicro Fuse'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>
     <!-- Degrade 탭 내용 -->
    <el-tab-pane label="Degrade" name="Degrade">
      <template v-if="activeTabName === 'Degrade'">
        <measurement-tab
          :testType="'Degrade'"
          :searchType="'normal'"
          :status="'reserved'"
        ></measurement-tab>
      </template>
    </el-tab-pane>

    <!-- 여기에 다른 탭들을 추가할 수 있습니다. -->
  </el-tabs>
</template>

<script lang="ts" setup>
import { onActivated, onMounted } from "vue";
import MeasurementTab from "./MeasurementTab.vue";
import { useSessionRef } from "../../../utils/session-state";
import { resetSearchUnlessReturning } from "../../../utils/measurement-search";

// 화면에 들어올 때마다(keep-alive 복귀 포함): 의뢰서 화면에서 돌아온 게 아니면 검색어 비움
// (keep-alive 에 없는 경우엔 onActivated 가 안 불리므로 onMounted 에서도 호출. 두 번 불려도 결과 같음)
onMounted(() => resetSearchUnlessReturning("reserved"));
onActivated(() => resetSearchUnlessReturning("reserved"));

// 뒤로가기 시 페이지 전체 새로고침은 제거 (MeasurementTab 이 목록을 기억했다가 바로 보여주고 뒤에서 갱신)
// 보던 탭은 F5/뒤로가기 후에도 유지 (브라우저 탭을 닫으면 MAX FUSE 로 초기화)
const activeTabName = useSessionRef<string>("measurement_list:reserved:tab", "maxFuse");
</script>
