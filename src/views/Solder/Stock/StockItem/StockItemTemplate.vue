<template>
  <div class="container">
    <el-form :model="stockItem" :rules="rules" label-width="120px" ref="ruleFormRef">
      <el-form-item prop="label" :label="computedLabels.label">
        <el-input v-model="stockItem.label" :placeholder="computedPlaceholders.label" @change="handleUpdateLabel" />
      </el-form-item>

      <el-form-item prop="location" :label="computedLabels.location">
        <el-input v-model="stockItem.location" :placeholder="computedPlaceholders.location" />
      </el-form-item>

      <el-form-item :label="computedLabels.quantity">
        <el-input v-model="stockItem.quantity" :min="0" :placeholder="computedPlaceholders.quantity" />
      </el-form-item>

      <div v-if="props.formType === 'load'">
        <el-form-item prop="assumedQuantity" :label="computedLabels.assumedQuantity">
          <el-input v-model="stockItem.assumedQuantity" :placeholder="computedPlaceholders.assumedQuantity" />
        </el-form-item>

        <el-form-item :label="computedLabels.remain">
          {{ stockItem.quantity - stockItem.assumedQuantity }}
        </el-form-item>
      </div>

      <el-form-item prop="receiver" :label="computedLabels.receiver">
        <el-input v-model="stockItem.receiver" :placeholder="computedPlaceholders.receiver" />
      </el-form-item>

      <div v-if="props.formType === 'create'">
        <el-button type="primary" :disabled="isNewLabel" @click="handleCreate(ruleFormRef)">Create new stock item</el-button>
      </div>
      <div v-if="props.formType === 'load'">
        <el-button type="primary" :disabled="isNewLabel" @click="handleUpdate(ruleFormRef)">Update stock item</el-button>
        <el-button type="danger" @click="handleDelete()">Remove stock item</el-button>
      </div>
    </el-form>

    <div v-if="stockItem.stockItemLabel">
      <el-divider />
      <StockItemLabel :key="stockItem?.stockItemLabel?.label" v-model="stockItem.stockItemLabel" v-model:isNewLabel="isNewLabel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type { StockItem } from "../../../../interface/stock";
import { rules } from "./StockItemRules";
import { createStockItem, deleteStockItem, updateStockItem, getStockItemLabel } from "./StockItem";
import { useRouter } from "vue-router";
import { FormInstance, ElMessageBox, ElMessage } from "element-plus";
import StockItemLabel from "./StockItemLabel.vue";

const ruleFormRef = ref<FormInstance>();

type FormType = 'create' | 'load';
import type { StockItemType } from "../../../../interface/stock";
const props = defineProps<{
  formType: FormType,
  itemType: StockItemType
}>();
const stockItem = defineModel<StockItem>();
const router = useRouter();

const LABELS_MAP: Record<StockItemType, Record<string, string>> = {
  reel: {
    label: 'Reel ID',
    location: 'Location',
    quantity: 'Total Quantity',
    assumedQuantity: 'Usage Quantity',
    remain: 'Remain',
    receiver: 'Receiver',
  },
  sample: {
    label: 'Sample ID',
    location: 'Location',
    quantity: 'Total Quantity',
    assumedQuantity: 'Used Quantity',
    remain: 'Remain',
    receiver: 'Receiver',
  },
};

const PLACEHOLDERS_MAP: Record<StockItemType, Record<string, string>> = {
  reel: {
    label: 'Scan Reel ID',
    location: 'The Place where LOT will store',
    quantity: 'Entire Chip Quantity',
    assumedQuantity: 'Enter how many samples you used?',
    receiver: 'Enter the Receiver Name',
  },
  sample: {
    label: 'Scan Sample ID',
    location: 'Sample Storage Location',
    quantity: 'Total Sample Quantity',
    assumedQuantity: 'Enter used sample count',
    receiver: 'Enter the Receiver Name',
  },
};

const computedLabels = computed(() => LABELS_MAP[props.itemType]);
const computedPlaceholders = computed(() => PLACEHOLDERS_MAP[props.itemType]);

const isNewLabel = ref<boolean>(true);

async function handleCreate(formEl: FormInstance) {
  let validationResult: boolean;
  try {
    validationResult = await formEl.validate();
  } catch (error) {
    ElMessage.error("Form is not complete");
    return;
  }
  if (validationResult) {
    const createdStockItem = await createStockItem(stockItem.value);
    if (createdStockItem) {
      await router.push({
        name: "LoadLotStock",
        params: { id: createdStockItem.id },
      });
    } else {
      ElMessage.error("Failed to create stock item.");
    }
  }
}

async function handleUpdate(formEl: FormInstance | undefined) {
  if (await formEl.validate()) {
    const updatedStockItem = await updateStockItem(stockItem.value);
    if (updatedStockItem) {
      stockItem.value = updatedStockItem;
    } else {
      ElMessage.error("Failed to update stock item.");
    }
  }
}

async function handleDelete() {

  let confirmed = false;
  try {
    await ElMessageBox.confirm(
      "Are you sure you want to delete this item? Deleted data cannot be restored.",
      {
        confirmButtonText: "Delete",
        cancelButtonText: "No",
        type: "error",
      }
    );
    confirmed = true;
  } catch (error) {
    // Cancelled or closed
    confirmed = false;
  }
  if (!confirmed) return;

  const result = await deleteStockItem(stockItem.value.id);
  if (!result) {
    ElMessage.error("Failed to delete stock item.");
  } else {
    // Try to emit close event if parent listens, otherwise fallback to router.back()
    router.back();
  }
}

async function handleUpdateLabel(newLabel: string) {
  isNewLabel.value = true;
//   stockItem.value.stockItemLabel = undefined;
  if (newLabel && newLabel !== "") {
    const recivedStockItemLabel = await getStockItemLabel(newLabel);
    if (recivedStockItemLabel) {
      stockItem.value.stockItemLabel = recivedStockItemLabel;
      isNewLabel.value = false;
    } else {
      stockItem.value.stockItemLabel = { label: newLabel, lotId: newLabel };
      isNewLabel.value = true;
    }
  }
}

onMounted(async () => {
  await handleUpdateLabel(stockItem.value.label);
});
</script>
