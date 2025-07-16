<template>
    <el-form :model="stockItemLabel" label-width="120px">
        <el-form-item prop="label" label="Label">
            {{ stockItemLabel.label }}
        </el-form-item>
        <el-form-item prop="lotId" label="Lot ID">
            <el-input v-model="stockItemLabel.lotId" @change="handleUpdateLotId" />
        </el-form-item>
        <el-form-item label="isNewLabel">
            {{ isNewLabel }}
        </el-form-item>
    </el-form>

    <div v-if="isNewLabel">
        <el-button type="primary" :disabled="!updateIsAllowed" @click="handleCreate()">Create</el-button>
    </div>
    <div v-else>
        <el-button type="primary" :disabled="!updateIsAllowed" @click="handleUpdate()">Update</el-button>
    </div>

    <div v-if="stockItemLabel.lot">
        <el-divider />
        <StockItemLot v-model="stockItemLabel.lot" :is-new-lot="isNewLot" />
    </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref} from "vue";
import type { StockItemLabel } from "../../../../interface/stock";
import StockItemLot from "./StockItemLot.vue";
import { createStockItemLabel, getStockItemLot, updateStockItemLabel } from "./StockItem";
import { ElMessage } from "element-plus";

// const {isNewLabel = true} = defineProps({
//     isNewLabel: Boolean
// });

const updateIsAllowed = computed(()=>{
    return !stockItemLabel.value.lotId || !isNewLot.value
})

const stockItemLabel = defineModel<StockItemLabel>()
const isNewLabel = defineModel<boolean>('isNewLabel')

const isNewLot = ref<boolean>(false);

async function handleUpdateLotId(newLotId: string) {
  stockItemLabel.value.lotId = newLotId = newLotId === "" ? null : newLotId;
  isNewLot.value = true;
  stockItemLabel.value.lot = undefined;
  if (newLotId) {
    const lot = await getStockItemLot(newLotId);
    if (lot) {
      stockItemLabel.value.lot = lot;
      isNewLot.value = false;
    } else {
      isNewLot.value = true;
    }
  }
}

async function handleCreate() {
  const createdStockItem = await createStockItemLabel(stockItemLabel.value);
  if (createdStockItem) {
    Object.assign(stockItemLabel.value, createdStockItem);
    isNewLabel.value = false;
  } else {
    ElMessage.error("Failed to create label.");
  }
}

async function handleUpdate() {
  const updatedStockItem = await updateStockItemLabel(stockItemLabel.value);
  if (updatedStockItem) {
    Object.assign(stockItemLabel.value, updatedStockItem);
  } else {
    ElMessage.error("Failed to update label.");
  }
}


onMounted(async () => {
    handleUpdateLotId(stockItemLabel.value.lotId)
})

</script>