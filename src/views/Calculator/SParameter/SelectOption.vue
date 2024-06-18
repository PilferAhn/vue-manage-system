<template>
  <div>
    <p>Option {{ index }}</p>
    <label>
      Name:
      <input v-model="option.name" placeholder="Name" />
    </label>
    <label>
      TX:
      <input v-model="option.tx" placeholder="TX" />
    </label>
    <label>
      RX:
      <input v-model="option.rx" placeholder="RX" />
    </label>
    <label>
      IL Level:
      <input v-model="option.ilLevel" placeholder="IL Level" type="number" />
    </label>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  index: number;
  option: {
    name: string;
    tx: string;
    rx: string;
    ilLevel: number;
  };
}>();
</script>

<style scoped>
/* 하위 컴포넌트 스타일 */
label {
  display: block;
  margin-bottom: 8px;
}
input {
  margin-left: 8px;
}
</style>
