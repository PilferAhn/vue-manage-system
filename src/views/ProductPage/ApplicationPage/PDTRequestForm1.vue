<template>
  <el-container>
    <el-header>
      <h1>Person Information</h1>
    </el-header>
    <el-main>
      <el-form :model="person" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="person.name"></el-input>
        </el-form-item>
        <el-form-item label="Age">
          <el-input-number v-model="person.age" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="Number of Addresses">
          <el-input-number v-model.number="person.addressQuantity" :min="0" @change="updateAddresses"></el-input-number>
        </el-form-item>
      </el-form>

      <h2>Addresses:</h2>
      <el-form>
        <div v-for="(address, index) in person.addresses" :key="index">
          <el-form-item :label="'House Number ' + (index + 1)">
            <el-input-number v-model.number="address.houseNumber" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item :label="'Street ' + (index + 1)">
            <el-input v-model="address.street"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <h2>Summary:</h2>
      <p>Name: {{ person.name }}</p>
      <p>Age: {{ person.age }}</p>
      <p>Number of Addresses: {{ person.addressQuantity }}</p>
      <h3>Addresses:</h3>
      <ul>
        <li v-for="address in person.addresses" :key="address.houseNumber">
          {{ address.houseNumber }} - {{ address.street }}
        </li>
      </ul>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { Person } from './Application';
import 'element-plus/dist/index.css';
import { ElInput, ElInputNumber, ElForm, ElFormItem, ElContainer, ElHeader, ElMain } from 'element-plus';

const person = reactive<Person>({
  name: '',
  age: 0,
  addressQuantity: 0,
  addresses: []
});

const updateAddresses = () => {
  const addresses = [];
  for (let i = 0; i < person.addressQuantity; i++) {
    addresses.push({ houseNumber: 0, street: '' });
  }
  person.addresses = addresses;
};

// Watcher to update addresses whenever addressQuantity changes
watch(() => person.addressQuantity, updateAddresses);
</script>

<style scoped>
/* 스타일은 필요에 따라 추가하세요 */
</style>
./Application1