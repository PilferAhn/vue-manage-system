<template>
  <div>
    <div class="grid-container" :style="gridStyle">
      <el-button
        v-for="(button, index) in buttonStates"
        :key="index"
        :disabled="button.disabled"
        :class="{ 'is-active': button.active }"
        :style="buttonStyle"
        @click="toggleButton(index)"
        class="grid-button"
      >
        {{ button.text }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, reactive, computed, defineEmits, watch } from "vue";

const props = defineProps<{
  waferInfo: {
    shots: string[];
    disableShots: string[];
    size: number;
    status: string[];
  };
  applicationType: string;
}>();

const emits = defineEmits(["updateActiveShots"]);

// 🧠 로컬 복사본으로 반응형 상태 관리
const buttonStates = reactive<Array<{
  text: string;
  active: boolean;
  disabled: boolean;
}>>([]);

// 상태만 따로 복사해 놓기 (props 직접 수정하지 않기 위함)
const localStatus = reactive<string[]>([]);

// Watch props.waferInfo 변경 감지
watch(
  () => props.waferInfo,
  (newVal) => {
    // 로컬 상태 초기화
    localStatus.length = 0;
    localStatus.push(...newVal.status);

    // 특정 조건일 때 상태 값 조정 (props 직접 변경 X)
    if (
      newVal.shots.length === 169 &&
      !["load", "clone"].includes(props.applicationType)
    ) {
      [48, 72, 96, 120].forEach((idx) => {
        localStatus[idx] = "activate";
      });
    }

    // 버튼 상태 초기화
    buttonStates.splice(0, buttonStates.length); // clear
    newVal.shots.forEach((shot, index) => {
      buttonStates.push({
        text: shot,
        active: localStatus[index] === "activate",
        disabled: newVal.disableShots.includes(shot),
      });
    });
  },
  { immediate: true, deep: true }
);

// 버튼 클릭 핸들러
const toggleButton = (index: number) => {
  buttonStates[index].active = !buttonStates[index].active;
  localStatus[index] = buttonStates[index].active ? "activate" : "inactive";

  emits(
    "updateActiveShots",
    buttonStates.filter((b) => b.active).map((b) => b.text)
  );
};

// 스타일 계산
const gridStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${props.waferInfo.size}, 1fr)`,
  gap: "5px",
}));

const buttonStyle = computed(() => {
  let buttonWidth = "50px";
  let buttonHeight = "50px";

  if (props.waferInfo.size === 13) {
    buttonWidth = "40px";
    buttonHeight = "40px";
  }

  return {
    width: buttonWidth,
    height: buttonHeight,
    margin: "2px",
  };
});
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 5px;
}

.grid-button {
  transition: transform 0.3s, box-shadow 0.3s;
}

.is-active {
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.05);
}

.grid-button:not(:disabled):not(.is-active) {
  background-color: #f0f0f0;
  color: #333;
}

.grid-button:disabled {
  opacity: 0.5;
}
</style>

<script lang="ts">
export default {};
</script>
