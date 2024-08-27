<template>
  <div class="container">

    <div class="schart-box">
      <div class="content-title">Last Week</div>
      <WeeklyLastWeekPie></WeeklyLastWeekPie>
    </div>

    <div class="schart-box">
      <div class="content-title">This Week</div>
      <WeeklyThisWeekPie></WeeklyThisWeekPie>
    </div>
    

    <div class="schart-box">
      <div class="content-title">Last Week</div>
      <WeeklyTEGSummaryGraph2></WeeklyTEGSummaryGraph2>
    </div>

    <div class="schart-box">
      <div class="content-title">This Week</div>
      <WeeklyTEGSummaryGraph></WeeklyTEGSummaryGraph>
    </div>

    <div><LeadTime></LeadTime></div>
    <!-- <div class="schart-box">
			<div class="content-title">饼状图</div>
			<schart class="schart" canvasId="pie" :options="options3"></schart>
		</div> -->
    <!-- <div class="schart-box">
      <div class="content-title">Weekly</div>
      <WeeklyTegSummaryLineGraph></WeeklyTegSummaryLineGraph>
    </div>
    <div class="schart-box">
      <div class="content-title">Monthly</div>
      <MonthlyTegSummaryLineGraph></MonthlyTegSummaryLineGraph>
    </div> -->
  </div>
</template>

<script setup lang="ts" name="basecharts">
import Schart from "vue-schart";
import WeeklyThisWeekPie from "./WeeklyThisWeekPie.vue";
import WeeklyLastWeekPie from "./WeeklyLastWeekPie.vue";
import WeeklyTEGSummaryGraph from "./WeeklyTEGSummaryGraph.vue";
import WeeklyTEGSummaryGraph2 from "./WeeklyTEGSummaryGraph2.vue";
import MonthlyTegSummaryLineGraph from "./MonthlyTegSummaryLineGraph.vue";
import WeeklyTegSummaryLineGraph from "./WeeklyTegSummaryLineGraph.vue";
import LeadTime from "./LeadTime.vue";

</script>

<style scoped>
.schart-box {
  display: inline-block;
  margin: 20px;
}
.schart {
  width: 600px;
  height: 400px;
}
.content-title {
  clear: both;
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
</style>
