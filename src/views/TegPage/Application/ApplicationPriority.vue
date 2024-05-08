
  <template>
    <el-form-item label="의뢰 구분" prop = "applicationType">
    <el-select v-model="applicationType" @change="updatePriority" placeholder="Select a group">
      <el-option
        v-for="(item, key) in applicationPriority"
        :key="key"
        :label="key"
        :value="key">
      </el-option>
    </el-select>
    </el-form-item>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { applicationPriority } from '../../../utils/waferApplicationHelper';
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    priority: String,
    applicationType: String
  });
  
  const emits = defineEmits(['update']);
  const applicationType = ref(props.applicationType);
  
  // Watch for external changes to the props and update the local state
  watch(() => props.applicationType, (newValue) => {
    applicationType.value = newValue;
  }, { immediate: true });
  
  const updatePriority = () => {
    if (applicationType.value) {
      const priority = applicationPriority[applicationType.value].priority;
      emits('update', { key: applicationType.value, priority });
    }
  };
  </script>
  