<template>
  <li>
    <h2>{{ friend.name }} {{ isFavorite === '1' ? '(Favorite)' : '' }}</h2>
    <button @click="toggleFavorite">
      {{ detailsAreVisible ? "Hide" : "Show" }} Details
    </button>
    <button @click="toggleDetails">
      {{ detailsAreVisible ? "Hide" : "Show" }} Details
    </button>
    <ul v-if="detailsAreVisible">
      <li>
        <strong>Phone:</strong>
        {{ $props.phone }}
      </li>
      <li>
        <strong>Email:</strong>
        {{ $props.email }}
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  id : String,
  name : String,
  phone : String,
  email : String,
  isFavorite : String
})

const detailsAreVisible = ref(false);
const friend = {
  id: "manuel",
  name: "Manuel Lorenz",
  phone: "0123 45678 90",
  email: "manuel@localhost.com",
};

function toggleDetails() {
  detailsAreVisible.value = !detailsAreVisible.value;
}

function toggleFavorite() {
  props.isFavorite = !props.isFavorite
}

</script>
