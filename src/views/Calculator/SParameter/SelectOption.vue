<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="9">
        <el-form-item :label="'Graph Name'">
          <el-input v-model="props.option.name" />
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item :label="'S'">
          <el-select
            v-model="props.option.output"
            placeholder="Select number of options"
          >
            <el-option
              v-for="item in props.port"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <!-- <el-input v-model="props.option.name" :placeholder="'Label Name'" /> -->
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item :label="''">
          <el-select v-model="props.option.input">
            <el-option
              v-for="item in props.port"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item :label="'IL Level'">
        <el-input v-model="props.option.ilLevel" />
      </el-form-item>
      </el-col>
    </el-row>
    <!-- <p>Option {{ index }}</p> -->

    <!-- Name:
      <input v-model="option.name" placeholder="Name" /> -->

    <!-- 
      TX:
      <el-input v-model="props.option.output" :placeholder="'Label Name'" />

      RX:
      <el-input v-model="props.option.input" :placeholder="'Label Name'" />

      IL Level:
      <el-input v-model="props.option.ilLevel" :placeholder="'Label Name'" /> -->
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  index: number;
  port: number;
  option: {
    name: string;
    output: number;
    input: number;
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
