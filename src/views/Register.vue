<template>
    <div class="app-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="form-container"
        @submit.prevent="handleSubmit"
      >
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
  
        <el-form-item label="Department" prop="department">
          <el-input
            v-model="form.department"
            placeholder="Enter your department"
            clearable
          ></el-input>
        </el-form-item>
  
        <el-form-item label="Employee ID" prop="employeeId">
          <el-input
            v-model="form.employeeId"
            placeholder="w2200202 or wjc2200202"
            clearable
          ></el-input>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" native-type="submit">Register</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElMessage,
  } from "element-plus";
  
  const form = ref({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    department: "",
    employeeId: ""
  });
  
  const rules = {
    name: [
      { required: true, message: "Please input your name", trigger: "blur" },
    ],
    email: [
      {
        required: true,
        message: "Please input your email address",
        trigger: "blur",
      },
      {
        type: "email",
        message: "Please input a valid email address",
        trigger: ["blur", "change"],
      },
    ],
    password: [
      { required: true, message: "Please input your password", trigger: "blur" },
    ],
    passwordConfirmation: [
      {
        required: true,
        message: "Please confirm your password",
        trigger: "blur",
      },
    ],
    department: [
      { required: true, message: "Please input your department", trigger: "blur" },
    ],
    employeeId: [
      { required: true, message: "Please input your employee ID", trigger: "blur" },
    ],
  };
  
  const formRef = ref(null);
  
  const handleSubmit = async () => {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      ElMessage.error("Please correct the errors before submitting.");
      return;
    }
    if (form.value.password !== form.value.passwordConfirmation) {
      ElMessage.error("Passwords do not match.");
      return;
    }
    console.log("Form submitted:", form.value);
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
  