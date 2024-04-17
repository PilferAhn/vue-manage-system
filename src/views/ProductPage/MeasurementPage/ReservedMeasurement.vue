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

    <!-- 여기에 다른 탭들을 추가할 수 있습니다. -->
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import MeasurementTab from "./MeasurementTab.vue";

onMounted(() => {
  const reloadOnBack = () => {
    window.location.reload();
  };

  window.addEventListener("popstate", reloadOnBack);

  // 페이지를 벗어날 때 이벤트 리스너 제거
  onUnmounted(() => {
    window.removeEventListener("popstate", reloadOnBack);
  });
});

const activeTabName = ref("maxFuse");
</script>
