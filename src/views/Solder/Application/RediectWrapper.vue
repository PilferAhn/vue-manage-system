<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const uuid = route.query.uuid as string;
  if (uuid) {
    router.replace(`/whc/clone-application/new/${uuid}`);
  } else {
    router.replace("/404");
  }
});
</script>

<template>
  <div>11</div> <!-- 화면엔 아무것도 안 보임 -->
</template>
