<template>
  <div>

    <!-- Table -->
    <el-table
      :data="stockItems"
      style="width: 100%; font-size: 16px; padding: 20px"
      :border="true"
      :header-cell-style="{
        backgroundColor: '#f2f2f2',
        fontWeight: 'bold',
        fontSize: '18px',
      }"
      :row-style="{ height: '50px' }"
            class="custom-table"
      :row-class-name="tableRowClassName"
    >
    <el-table-column label="No" width="80" :align="'center'">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        label="PN_FAB"
        width="200"
        :align="'center'"
      >
        <template #default="scope">
          <div  v-for="firstMesMaterial in scope.row?.stockItemLabel?.lot?.firstMesMaterials">
            {{ firstMesMaterial.materialId || "-"}}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="PN_WHC"
        width="200"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row?.stockItemLabel?.lot?.materialId  || "-" }}
        </template>
      </el-table-column>

      <el-table-column
        prop="designer"
        label="개발자"
        width="120"
        :align="'center'"
      >
        <template #default="scope">
          <div  v-for="firstMesMaterial in scope.row?.stockItemLabel?.lot?.firstMesMaterials">
            {{ firstMesMaterial?.designer?.userName || "-" }}
          </div>
        </template>

      </el-table-column>

      <el-table-column
        v-if="props.operationType === 'reel'"
        prop="label"
        label="Reel ID"
        width="170"
        :align="'center'"
      ></el-table-column>
      <el-table-column
        v-else
        prop="label"
        label="Assay ID"
        width="170"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        prop="location"
        label="Location"
        width="100"
        :align="'center'"
      ></el-table-column>

      <el-table-column label="Received Date" width="120" :align="'center'">
        <template #default="scope">
          {{ formatDate(scope.row.dateOfCreated) }}
        </template>
      </el-table-column>

      <el-table-column
        label="Receiver"
        width="150"
        prop="receiver"
        :align="'center'"
      ></el-table-column>

      <el-table-column
        prop="quantity"
        label="Total"
        width="100"
        :align="'center'"
      ></el-table-column>

      <el-table-column label="Remain" width="100" :align="'center'">
        <template #default="scope">
          {{ scope.row.quantity - scope.row.assumedQuantity }}
        </template>
      </el-table-column>

      <el-table-column prop="note" label="Note" width="100" :align="'Left'"></el-table-column>

      <!-- Button Column -->
      <el-table-column label="Actions" width="200" :align="'center'">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleDetail(scope.row)">
            View Detail
          </el-button>
          <el-button type="primary" size="small" @click="handleEditNote(scope.row)">
            Edit Note
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog v-model="dialogEditNoteVisible" title="Edit note" width="500">
    <el-form v-model="editingNote">
      <el-form-item label="Note">
        <el-input v-model="editingNote.note" :autosize="{ minRows: 5, maxRows: 10 }" type="textarea" placeholder="Please input note"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancelEditNote">Cancel</el-button>
        <el-button @click="handleConfirmEditNote">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import type { StockItem, StockItemType } from "../../../../interface/stock";
import { formatDate } from "../../../../utils/date-utils";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { updateStockItemNote } from "../StockItem/StockItem";


const props = defineProps<{
  stockItems: StockItem[];
  operationType: StockItemType;
}>();

const router = useRouter();

function handleDetail(row: StockItem) {
  router.push({
    name: "LoadLotStock",
    params: { id: row.id },
  });
}

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: StockItem;
  rowIndex: number;
}) => {
  const firstMesMaterials = row?.stockItemLabel?.lot?.firstMesMaterials
  if (!(firstMesMaterials !== undefined && firstMesMaterials.filter(m => m.designer).length > 0)) {
    return "el-warning"; // Ensure this matches your CSS class
  }
  return "";
};


// Editing note functionality
interface EditingNote {
  row: StockItem;
  note: string;
}
const dialogEditNoteVisible = ref(false);
const editingNote = ref<EditingNote | null>(null);

function handleEditNote(row: StockItem) {
  editingNote.value = {
    row,
    note: row.note || "",
  };
  dialogEditNoteVisible.value = true;
}

async function handleConfirmEditNote() {
  if (editingNote.value) {
    try {
      const updatedStockItem = await updateStockItemNote(editingNote.value.row.id, editingNote.value.note);
      editingNote.value.row.note = updatedStockItem.note; // Update the row note
      dialogEditNoteVisible.value = false;
    } catch (error) {
      ElMessage.error("Failed to update note");
    }
  }  
}

function handleCancelEditNote() {
  dialogEditNoteVisible.value = false;  
}

</script>

<style lang="scss" scoped>
.custom-table ::v-deep(.el-warning) {
  background-color: hsl(0, 42%, 90%) !important; /* Ensure the background changes */
  color: hsl(0, 68%, 12%) !important;  
}
</style>