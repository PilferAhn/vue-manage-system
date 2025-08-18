<template>
    <div class="custom-select" @click="toggleDropdown" ref="selectWrapper">
        <div class="selected">
            {{ selectedLabel || placeholder }}
        </div>
        <div v-if="showDropdown" class="dropdown">
            <div class="option" v-for="item in options" :key="item.mvalue" @click.stop="selectOption(item)">
                {{ item.mlabel }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
    modelValue: [String, Number, null],
    options: {
        type: Array,
        required: true,
    },
    placeholder: {
        type: String,
        default: 'Select',
    },
});

const emit = defineEmits(['update:modelValue']);

const showDropdown = ref(false);
const selectWrapper = ref(null);

const selectedLabel = computed(() => {
    const match = props.options.find(opt => opt.mvalue === props.modelValue);
    return match ? match.mlabel : '';
});

function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
}

function selectOption(item) {
    emit('update:modelValue', item.mvalue);
    showDropdown.value = false;
}

// close when clicking outside
function handleClickOutside(e) {
    if (!selectWrapper.value?.contains(e.target)) {
        showDropdown.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.custom-select {
    position: relative;
    /* font-size: 13px; */
    line-height: normal;
    width: 100%;
    height: 100%;
    border: 0px;
    padding: 0x;
    cursor: pointer;
    user-select: none;
    background: white;
}

.selected {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 24px;
    min-height: 24px;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
}

.option {
    padding: 8px;
    cursor: pointer;
}

.option:hover {
    background-color: #f0f0f0;
}
</style>
