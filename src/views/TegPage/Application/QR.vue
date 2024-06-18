<template>
  <div class="container">
    <span class="qr-section">
      의뢰서 접수 
      <img :src="qrImages.registration" alt="First QR Code">
    </span>
    <span class="qr-section">
      Form Factor
      <img :src="qrImages.form_factor" alt="Third QR Code">
    </span>
    <span class="qr-section">
      Ez Prob  
      <img :src="qrImages.ez_probe" alt="Second QR Code">
    </span>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchQRCodeImage } from "./QR"


const props = defineProps<{
  applicationUuid: string;
}>();

const qrTypes = ['registration', 'ez_probe', 'form_factor'];
const qrImages = ref<{ [key: string]: string }>({
  registration: '',
  ez_probe: '',
  form_factor: ''
});

onMounted(async () => {
  for (const type of qrTypes) {
    const imageUrl = await fetchQRCodeImage(props.applicationUuid, type);
    qrImages.value[type] = imageUrl;
  }
});

// async function fetchQRCodeImage(uuid: string, imageType: string): Promise<string> {
//   try {
//     const response = await axios.get(`/teg_application/get_qr_image/${uuid}/${imageType}`, {
//       responseType: 'blob'
//     });
//     return URL.createObjectURL(response.data);
//   } catch (error) {
//     console.error('Error fetching QR code image:', error);
//     return '';
//   }
// }
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center; /* 센터 정레로 변경하여 공백 감소 */
  align-items: center; /* 세로축 가운데 정렬 */
  height: 30vh; /* 화면의 높이를 20vh로 설정하여 높이를 줄임 */
  padding: 0 20px; /* 컨테이너 좌우 패딩 추가 */
}

.qr-section {
  display: flex;
  flex-direction: column; /* 아이템들을 수직으로 쌓습니다 */
  align-items: center; /* 가운데 정렬 */
  flex: 0 0 30%; /* flex-grow를 0으로 설정하여 공간 확장 방지, 너비를 30%로 설정 */
  padding: 10px; /* 내부 패딩으로 미관 개선 */
  border: 1px solid #ccc; /* 각 섹션의 테두리를 추가 */
  margin: 0 10px; /* 섹션 사이의 마진 추가 */
}

.qr-section img {
  margin-top: 10px;
  width: 200px; /* 이미지 너비 */
  height: 200px; /* 이미지 높이 */
}
</style>


