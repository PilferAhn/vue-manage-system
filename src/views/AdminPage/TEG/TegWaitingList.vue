<template>
    <div class="container">
      <!-- 입력창 및 접수 버튼을 상단 왼쪽에 고정 -->
      <div class="input-container">
        <el-input
          v-model="inputText"
          placeholder="Enter Lot ID"
          clearable
          class="input-box"
        ></el-input>
        <el-button type="primary" @click="handleSubmit" class="submit-btn">
          접수
        </el-button>
      </div>
  
      <!-- Lot 리스트 테이블 -->
      <el-table :data="lotList" class="lot-table">
        <!-- No Column -->
        <el-table-column
          label="No"
          width="50"
          type="index"
          align="center"
        ></el-table-column>
  
        <!-- Lot ID Column -->
        <el-table-column
          prop="lotId"
          label="Lot ID"
          align="center"
        ></el-table-column>
  
        <!-- Action Column (접수, 삭제 버튼) -->
        <el-table-column label="Actions" width="180" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="registerLot(scope.$index)"
              class="action-btn"
            >
              접수
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="deleteLot(scope.$index)"
              class="action-btn"
            >
              삭제
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import { reactive } from "vue";
  
  // 입력한 문자열을 저장할 변수
  const inputText = ref("");
  
  // 접수 버튼 클릭 시 실행할 함수
  const handleSubmit = () => {
    if (inputText.value.trim() !== "") {
      // 입력된 텍스트를 새로운 Lot로 추가
      lotList.push({ lotId: inputText.value });
      inputText.value = ""; // 입력창 초기화
    }
  };
  
  // lot list 인터페이스 정의
  interface LotList {
    lotId: string;
  }
  
  // 배열 형태의 reactive 변수 선언
  const lotList = reactive<LotList[]>([
    { lotId: "LOT001" },
    { lotId: "LOT002" },
    { lotId: "LOT003" },
  ]);
  
  // 접수 버튼 클릭 시 실행할 함수
  const registerLot = (index: number) => {
    console.log(`Lot ${lotList[index].lotId} 접수됨`);
  };
  
  // 삭제 버튼 클릭 시 실행할 함수
  const deleteLot = (index: number) => {
    lotList.splice(index, 1); // 해당 index의 Lot 삭제
  };
  </script>
  
  <style scoped>
  .container {
    position: relative; /* 상단 고정 배치를 위한 상대 위치 설정 */
    width: 100%;
    height: 100vh; /* 화면 전체 높이를 차지 */
    display: flex;
    flex-direction: column;
  }
  
  .input-container {
    position: absolute;
    top: 20px; /* 현재 페이지 상단 기준으로 20px 아래 */
    left: 20px; /* 페이지 왼쪽 기준으로 20px 우측 */
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .input-box {
    width: 300px;
  }
  
  .submit-btn {
    white-space: nowrap;
  }
  
  .lot-table {
    margin-top: 80px; /* 입력창과 버튼을 위한 공간 */
    width: 100%;
    height: calc(100vh - 100px); /* 상단의 입력창과 버튼을 제외한 나머지 화면을 꽉 채움 */
    overflow: auto;
  }
  </style>
  