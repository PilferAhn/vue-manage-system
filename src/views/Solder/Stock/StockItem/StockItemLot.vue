<template>
    <el-form :model="stockItemLot" label-width="120px">
        <el-form-item prop="lotId" label="lot ID">
            {{ stockItemLot.lotId }}
        </el-form-item>
        
        <el-form-item prop="materialId" label="PN WHC">
            <div v-if="stockItemLot.isEditable">
                <el-input v-model="stockItemLot.materialId" />
            </div>
            <div v-else>
                {{ stockItemLot.materialId }}
            </div>
        </el-form-item>

        
        <!-- PN FAB (firstMesMaterialId) - list all firstMesMaterials -->
        <div v-if="stockItemLot.firstMesMaterials && stockItemLot.firstMesMaterials.length > 0">
            <div v-for="(mat, idx) in stockItemLot.firstMesMaterials" :key="idx" style="border:1px solid #eee; margin-bottom:8px; padding:8px; border-radius:4px;">
                <el-form-item :label="`PN FAB #${idx+1}`">
                    <template v-if="mat.isEditable">
                        <el-input v-model="mat.materialId" placeholder="Enter PN FAB" style="width: 200px;" />
                        <el-button type="danger" icon="el-icon-delete" @click="removeFirstMesMaterial(idx)" circle size="small" style="margin-left:8px;" />
                    </template>
                    <template v-else>
                        {{ mat.materialId }}
                    </template>
                </el-form-item>
                <el-form-item label="Source">
                    {{ mat.sourceId || '-' }}
                </el-form-item>

                <el-form-item label="Designer Name" v-if="mat.designer">
                    {{ mat.designer.userName || '-' }}
                </el-form-item>
                <el-form-item label="Designer Email" v-if="mat.designer">
                    {{ mat.designer.email || '-' }}
                </el-form-item>
            </div>
        </div>
        <el-button type="primary" @click="addFirstMesMaterial" style="margin-bottom: 16px;">Add PN FAB</el-button>

        <el-form-item label="Source">
            {{ stockItemLot.sourceId }}
        </el-form-item>

        <el-form-item label="isNewLot">
            {{ props.isNewLot }}
        </el-form-item>

    </el-form>
</template>

<script setup lang="ts">

import type {  StockItemLot } from "../../../../interface/stock";

const props = defineProps({
    isNewLot: Boolean
});

const stockItemLot = defineModel<StockItemLot>()

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


</script>