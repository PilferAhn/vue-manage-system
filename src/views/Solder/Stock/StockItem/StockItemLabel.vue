<template>
    <el-form v-loading="loading" :model="stockItemLabel" label-width="120px">
        <el-form-item prop="label" label="Label">
            {{ stockItemLabel.label }}
        </el-form-item>
        <el-form-item prop="lotId" label="Lot ID">
            <el-input v-model="stockItemLabel.lotId" @change="handleUpdateLotId" style="width: 200px; display: inline-block; margin-right: 8px;" />
            <el-button v-if="stockItemLabel.lotId && !stockItemLabel.lot" type="primary" @click="handleAddLot" style="margin-left: 8px;">Add Lot</el-button>
        </el-form-item>
    </el-form>

    <div v-if="isNewLabel">
        <el-button type="primary" :disabled="!updateIsAllowed" @click="handleCreate()">Create stock label</el-button>
    </div>
    <div v-else>
        <el-button type="primary" :disabled="!updateIsAllowed" @click="handleUpdate()">Update stock label</el-button>
    </div>

    <div v-if="stockItemLabel.lot">
        <el-divider />
        <StockItemLot :key="stockItemLabel?.lot?.lotId" v-model="stockItemLabel.lot" v-model:is-new-lot="isNewLot" />
    </div>
</template>

<script setup lang="ts">

import { computed, onMounted, ref} from "vue";
import type { StockItemLabel } from "../../../../interface/stock";
import StockItemLot from "./StockItemLot.vue";
import { createStockItemLabel, getStockItemLot, updateStockItemLabel } from "./StockItem";
import { ElMessage, ElMessageBox } from "element-plus";

// const {isNewLabel = true} = defineProps({
//     isNewLabel: Boolean
// });


const stockItemLabel = defineModel<StockItemLabel>()
const isNewLabel = defineModel<boolean>('isNewLabel')

const loading = ref(false)
const isNewLot = ref<boolean>(false);

const updateIsAllowed = computed(()=>{
    return !stockItemLabel.value.lotId || !isNewLot.value
})


async function handleUpdateLotId(newLotId: string) {
  stockItemLabel.value.lotId = newLotId = newLotId === "" ? null : newLotId;
  if (newLotId) {
    loading.value = true;
    const lot = await getStockItemLot(newLotId);
    if (lot) {
      stockItemLabel.value.lot = lot;
      isNewLot.value = false;
    } else {
      stockItemLabel.value.lot = undefined;
      isNewLot.value = true;
    }
    loading.value = false;
  } else {
    stockItemLabel.value.lot = undefined;
    isNewLot.value = false;
  }
}

async function handleCreate() {
  const createdStockItem = await createStockItemLabel(stockItemLabel.value);
  if (createdStockItem) {
    stockItemLabel.value = createdStockItem;
    isNewLabel.value = false;
  } else {
    ElMessage.error("Failed to create label.");
  }
}

async function handleUpdate() {

  let confirmed = false;
  try {
    await ElMessageBox.confirm(
      "These changes will affect all stock items with the same label.",
      {
        confirmButtonText: "Update",
        cancelButtonText: "No",
        type: "info",
      }
    );
    confirmed = true;
  } catch (error) {
    // Cancelled or closed
    confirmed = false;
  }
  if (!confirmed) return;

  const updatedStockItem = await updateStockItemLabel(stockItemLabel.value);
  if (updatedStockItem) {
    stockItemLabel.value = updatedStockItem;
  } else {
    ElMessage.error("Failed to update label.");
  }
}

// Add a new lot if not present
function handleAddLot() {
  stockItemLabel.value.lot = {
    lotId: stockItemLabel.value.lotId,
    materialId: '',
    firstMesMaterials: [],
    sourceId: 'user',
    isEditable: true
  };
  isNewLot.value = true;
}

onMounted(async () => {
    handleUpdateLotId(stockItemLabel.value.lotId)
})

</script>