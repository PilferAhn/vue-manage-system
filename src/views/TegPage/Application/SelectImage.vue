<template>
    <div class="image-uploader">
      <el-button size="default" @click="selectFile">사진 선택</el-button>
      <el-button size="default" class="delete-button" @click="deleteImage" :disabled="!imageUrl">사진 삭제</el-button>
      <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange" style="display: none" />
      <div v-if="imageUrl" class="image-container">
        <img :src="imageUrl" alt="Selected Image" />
      </div>
    </div>
  </template>

  
  <script setup lang="ts">
  import { ref } from 'vue';
  import 'element-plus/dist/index.css';
  
  const emits = defineEmits(['updateFile']);
  const fileInput = ref<HTMLInputElement | null>(null);
  const imageUrl = ref<string | null>(null);
  
  const selectFile = () => {
    fileInput.value?.click();
  };
  const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = e => imageUrl.value = e.target?.result as string;
    reader.readAsDataURL(files[0]);
    emits('updateFile', files[0]);
  }
};
  
const deleteImage = () => {
  imageUrl.value = null;
  emits('updateFile', null);
};
  </script>
  
  <style scoped>
  .image-uploader {
    position: relative;
    display: flex;
    flex-direction: column;
    
  }
  
  .image-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px; /* 이미지 컨테이너의 너비 설정 */
    height: 500px; /* 이미지 컨테이너의 높이 설정 */
    overflow: hidden; /* 컨테이너 크기 초과 시 숨김 */
    margin-top : 20px;
  }
  
  .image-container img {    
    width: 100%;  /* 이미지가 컨테이너 크기에 맞도록 확장 */
    height: 100%; /* 이미지가 컨테이너 크기에 맞도록 확장 */
    object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너를 꽉 채움 */
  }
  
  .delete-button {
    position: absolute;
    top: 0;
    right: 0;
  }
  </style>
  
  