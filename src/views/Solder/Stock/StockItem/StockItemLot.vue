<template>
    <el-form :model="stockItemLot" label-width="120px" ref="ruleFormRef" @submit.prevent>
        <el-form-item prop="lotId" label="lot ID">
            {{ stockItemLot.lotId }}
        </el-form-item>

        <el-form-item label="Source">
            {{ stockItemLot.sourceId }}
        </el-form-item>

        <el-form-item prop="materialId" label="PN WHC" :rules="[
            {
                required: true,
                message: 'Please enter PN WHC',
                trigger: 'blur',
            }]">
            <div v-if="stockItemLot.isEditable">
                <el-input v-model="stockItemLot.materialId" />
            </div>
            <div v-else>
                {{ stockItemLot.materialId }}
            </div>
        </el-form-item>


        <!-- PN FAB (firstMesMaterialId) - list all firstMesMaterials -->
        <div v-if="stockItemLot.firstMesMaterials && stockItemLot.firstMesMaterials.length > 0">
            <div v-for="(mat, idx) in stockItemLot.firstMesMaterials" :key="idx"
                style="border:1px solid #eee; margin-bottom:8px; padding:8px; border-radius:4px;">
                <el-form-item :label="`PN FAB #${idx + 1}`" :prop="`firstMesMaterials.${idx}.materialId`" :rules="[
                    {
                        required: true,
                        message: 'Please enter PN FAB',
                        trigger: 'blur',
                    }]">
                    <template v-if="mat.isEditable">
                        <el-input v-model="mat.materialId" placeholder="Enter PN FAB" style="width: 200px;"
                            @change="updateFirstMesMaterialDisigner(idx)" />
                        <el-button type="danger" icon="Delete" @click="removeFirstMesMaterial(idx)" circle size="small"
                            style="margin-left:8px;" />
                    </template>
                    <template v-else>
                        {{ mat.materialId }}
                    </template>
                </el-form-item>
                <el-form-item label="Source">
                    {{ mat.sourceId || '-' }}
                </el-form-item>

                <template v-if="mat.designer">
                    <el-form-item label="Designer Name">
                        {{ mat.designer.userName }}
                    </el-form-item>
                    <el-form-item label="Designer Email">
                        {{ mat.designer.email }}
                    </el-form-item> 
                </template>
                <template v-else-if="mat.materialId && mat.designer === null">
                    Fab request not found
                </template>

            </div>
        </div>
        <el-button type="primary" @click="addFirstMesMaterial" style="margin-bottom: 16px;">Add PN FAB to the
            lot</el-button>

        <div v-if="isNewLot">
            <el-button type="primary" @click="handleCreate(ruleFormRef)">Create lot</el-button>
        </div>
        <div v-else>
            <el-button type="primary" @click="handleUpdate(ruleFormRef)">Update lot</el-button>
        </div>

    </el-form>
</template>

<script setup lang="ts">

import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import type {  StockItemLot } from "../../../../interface/stock";
import { createStockItemLot, getDesignerByFirstMesMaterialId, updateStockItemLot } from "./StockItem";
import { ref } from "vue";

const props = defineProps({
    isNewLot: Boolean
});

const stockItemLot = defineModel<StockItemLot>()
const isNewLot = defineModel<boolean>('isNewLot')

// Add a new editable firstMesMaterial
function addFirstMesMaterial() {
    if (!stockItemLot.value.firstMesMaterials) {
        stockItemLot.value.firstMesMaterials = [];
    }
    stockItemLot.value.firstMesMaterials.push({
        materialId: '',
        sourceId: 'user',
        isEditable: true,
        designer: undefined
    });
}

// Remove a firstMesMaterial by index, only if isEditable
function removeFirstMesMaterial(idx: number) {
    const mat = stockItemLot.value.firstMesMaterials?.[idx];
    if (mat && mat.isEditable) {
        stockItemLot.value.firstMesMaterials?.splice(idx, 1);
    }
}

async function updateFirstMesMaterialDisigner(idx: number) {
    const mat = stockItemLot.value.firstMesMaterials?.[idx];
    if (mat && mat.isEditable && mat.materialId) {
        mat.designer = await getDesignerByFirstMesMaterialId(mat.materialId);        
    }
}


const ruleFormRef = ref<FormInstance>();
async function handleCreate(formEl: FormInstance) {
    let validationResult: boolean;
    try {
        validationResult = await formEl.validate();
    } catch (error) {
        ElMessage.error("Lot form is not complete");
        return;
    }
    
    const createdStockItem = await createStockItemLot(stockItemLot.value);
    if (createdStockItem) {
        stockItemLot.value = createdStockItem;
        isNewLot.value = false;
    } else {
        ElMessage.error("Failed to create stock item lot.");
    }
}

async function handleUpdate(formEl: FormInstance | undefined) {
  if (await formEl.validate()) {
    let confirmed = false;
    try {
      await ElMessageBox.confirm(
        "These changes will affect all stock items associated with the same lot id.",
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

    const updatedStockItem = await updateStockItemLot(stockItemLot.value);
    if (updatedStockItem) {
      stockItemLot.value = updatedStockItem;
    } else {
      ElMessage.error("Failed to update stock item lot.");
    }
  }
}


</script>