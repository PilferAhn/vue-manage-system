<template>
  <div class="app-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="registrationRules"
      label-position="top"
      class="form-container"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="ID" prop="employeeId">
        <el-input
          v-model="form.employeeId"
          placeholder="w2200202 or wjc2200202"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Enter your password"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item label="Confirm Password" prop="passwordConfirmation">
        <el-input
          v-model="form.passwordConfirmation"
          type="password"
          placeholder="Confirm your password"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item label="Name" prop="name">
        <el-input
          v-model="form.name"
          placeholder="Enter your name"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input
          v-model="form.email"
          type="email"
          placeholder="Enter your email"
          clearable
        ></el-input>
      </el-form-item>

      <SelectOption
        v-model="form.department"
        label="Department"
        prop="department"
        :rules="registrationRules.department"
        :options="departmentList"
        placeholder=""
      ></SelectOption>

      <el-form-item>
        <el-button type="primary" native-type="submit">Register</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage } from "element-plus";

import SelectOption from "../TegPage/Application/SelectOption.vue";
import { useRouter } from "vue-router";
import { useForm } from "../../utils/form";
import { registrationRules } from "../../utils/FromRule";
import { checkPassword, departmentList } from "../../utils/registerUtility";

const router = useRouter();

const formRef = ref<InstanceType<typeof ElForm> | null>(null);
const form = useForm();

const handleSubmit = async () => {
  const isValid = await formRef.value?.validate();
  const passwordValid = checkPassword(
    form.value.password,
    form.value.passwordConfirmation
  );

  if (!isValid) {
    ElMessage.error("Please correct the errors before submitting.");
    return;
  } else if (!passwordValid) {
    ElMessage.error("비밀번호가 일치하지 않습니다.");
    return;
  }

  const temp_user_info = {
    user_name: form.value.name,
    email: form.value.email,
    password: form.value.password,
    department: form.value.department,
    id: form.value.employeeId,
  };

  const url = "user/create_user";
  const response = await axios.post(url, temp_user_info);

  if (response.data.status === "success") {
    ElMessage.success(response.data.message);

    // Countdown and redirect logic
    let countdown = 3;
    const countdownInterval = setInterval(() => {
      ElMessage.info(`Redirecting in ${countdown} seconds...`);
      countdown -= 1;
      if (countdown === 0) {
        clearInterval(countdownInterval);
        router.push("/login");
      }
    }, 1000);
  }
  if (response.data.status === "fail") {
    ElMessage.error(response.data.message);
  }

  // Here, you can handle the form submission to a backend server.
};
</script>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-container {
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-button {
  width: 100%;
  transition: background-color 0.3s ease;
}

.el-button:hover {
  background-color: #409eff;
  border-color: #409eff;
}

body {
  margin: 0;
  font-family: "Helvetica Neue", Arial, sans-serif;
}
</style>
