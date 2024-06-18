<!-- Wafer.vue -->
<template>
  <div>
    <!-- <h3>Wafer Size: {{ props.waferInfo.size }} x {{ props.waferInfo.size }}</h3> -->
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
import { defineProps, reactive, computed, defineEmits, watch } from 'vue';

const props = defineProps<{
  waferInfo: {
    shots: string[];
    disableShots: string[];
    size: number;
    status: string[];
  }
}>();



const emits = defineEmits(['updateActiveShots']);

// Initialize buttonStates without data initially
const buttonStates = reactive([]);

// Watch for changes in waferInfo and update buttonStates accordingly
watch(() => props.waferInfo, (newVal) => {
  buttonStates.splice(
    0,
    buttonStates.length,
    ...newVal.shots.map((shot, index) => ({
      text: shot,
      active: newVal.status[index] === 'activate',
      disabled: newVal.disableShots.includes(shot)
    }))
  );
}, { deep: true });



const toggleButton = (index: number) => {
  buttonStates[index].active = !buttonStates[index].active;
  props.waferInfo.status[index] = "activate"
  emits('updateActiveShots', buttonStates.filter(b => b.active).map(b => b.text));
};

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${props.waferInfo.size}, 1fr)`,
  gap: '5px'
}));

const buttonStyle = computed(() => {
  let buttonWidth = '50px'; // Default button width
  let buttonHeight = '50px'; // Default button height

  if (props.waferInfo.size === 13) { // Adjusting for "4 Inch (0.5CM)" or "6 Inch"
    buttonWidth = '40px'; // Smaller button width
    buttonHeight = '40px'; // Smaller button height
  }

  return {
    width: buttonWidth,
    height: buttonHeight,
    margin: '2px', // Add margin if needed
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
  background-color: #4CAF50; /* Green background for active buttons */
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: scale(1.05); /* Slightly larger scale for emphasis */
}

.grid-button:not(:disabled):not(.is-active) {
  background-color: #f0f0f0; /* Lighter for non-active but enabled buttons */
  color: #333;
}

.grid-button:disabled {
  opacity: 0.5; /* Less emphasis on disabled buttons */
}
</style>
