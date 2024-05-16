<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height: 252px">
          <div class="user-info">
            <el-avatar :size="120" :src="imgurl" />
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            접속 시간：
            <span>{{ currentDateTime }}</span>
          </div>
          <!-- <div class="user-info-list">
						上次登录地点：
						<span>东莞</span>
					</div> -->
        </el-card>

        <el-card shadow="hover" style="height: 252px">
          <template #header>
            <div class="clearfix">
              <span>지난 의뢰 비율</span>
            </div>
          </template>
          MAX FUSE
          <el-progress :percentage="79.4" color="#42b983"></el-progress>
          Aging
          <el-progress :percentage="14" color="#f1e05a"></el-progress>
          Life Time
          <el-progress :percentage="5.6"></el-progress>
          AMR
          <el-progress :percentage="1" color="#f56c6c"></el-progress>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <img class="grid-con-icon" :src="chipIcon" alt="description">
                <div class="grid-cont-right">
                  <div class="grid-num">{{productQuantity.quantity}}</div>
                  <div>Product</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <img class="grid-con-icon" :src="waferIcone" alt="description">
                <div class="grid-cont-right">
                  <div class="grid-num">{{ tegQuantity.quantity }}</div>
                  <div>TEG</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <img class="grid-con-icon" :src="nonLinearIcone" alt="description">
                <div class="grid-cont-right">
                  <div class="grid-num">0</div>
                  <div>Non Linear</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <RecentAppList></RecentAppList>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <WeeklyTEGSummaryGraph> </WeeklyTEGSummaryGraph>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <MonthlyTEGSummaryGraph></MonthlyTEGSummaryGraph>
          <!-- <Pie></Pie> -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import { ref, onMounted, reactive } from "vue";
import axios from "../../utils/request";
// import Pie from "../views/ProductPieChart.vue";

import MonthlyTEGSummaryGraph from "./MonthlyTEGSummaryGraph.vue";
import WeeklyTEGSummaryGraph from "./WeeklyTEGSummaryGraph.vue";
// import WeeklyProductSummaryGraph from "../../views/DashboardPage/WeeklyProductSummaryGraph.vue";
import RecentAppList from '../../views/DashboardPage/RecentAppList.vue';

import imgurl from "../../assets/img/img.jpg";
import chipIcon from "../../assets/img/chipIcon.webp";
import waferIcone from "../../assets/img/waferIcon.webp";
import nonLinearIcone from "../../assets/img/nonLinearIcon.webp";

// 현재 날짜
const now = new Date();

// 이번 달의 첫째 날
const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

// 이번 달의 마지막 날을 구하기
const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0")

// 날짜를 "YYYY-MM-DD HH:MM:SS" 형식의 문자열로 변환하는 함수
function formatDateToCustomString(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 이번 달의 첫째 날의 가장 이른 시간
const firstDayEarliestTime = formatDateToCustomString(firstDayOfMonth);

// 이번 달의 마지막 날의 가장 늦은 시간
// 마지막 날의 시간을 23:59:59로 설정하기
lastDayOfMonth.setHours(23, 59, 59);
const lastDayLatestTime = formatDateToCustomString(lastDayOfMonth);


// aowie jfrioawe
interface q {
  date_from: string;
  date_end: string;
  status: string[];
}

const dateAndStatus = ref<q>({
  date_from: firstDayEarliestTime,
  date_end: lastDayLatestTime,
  status: ["start", "finish"],
});

interface quantity {
  // start: string;
  // finish: string;
  quantity : string;
}

const productQuantity = ref<quantity>({
  // start: "",
  // finish: "",
  quantity : ""
});

const tegQuantity = ref<quantity>({
  // start: "",
  // finish: "",
  quantity : ""
});

const getStatusQuan = async () => {
  try {
    const { data } = await axios.get(
      "/pdt_measurement/get-quantity"
      // dateAndStatus.value
    );

    productQuantity.value = data;
    
    //console.log(measList.value)
  } catch (error) {
    console.error("Error fetching application type list:", error);
    throw error;
  }
};

const getTegQuantity = async () => {
  try {
    const { data } = await axios.get(
      "/measurement/get-quantity"
      // dateAndStatus.value
    );

    tegQuantity.value = data;
    
    //console.log(measList.value)
  } catch (error) {
    console.error("Error fetching application type list:", error);
    throw error;
  }
};

const currentDateTime = ref<string>("");

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  currentDateTime.value = formattedDateTime;
};

onMounted(() => {

  getStatusQuan();
  getTegQuantity()
  getCurrentDateTime();

  // 1초마다 현재 날짜 및 시간을 갱신
  setInterval(() => {
    getCurrentDateTime();
  }, 1000);
});

const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "RF개발팀" : "RF개발팀";



</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}
</style>
