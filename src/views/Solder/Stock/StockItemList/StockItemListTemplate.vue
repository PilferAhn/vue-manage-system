<template>
  <div>
    <div class="notice-banner">
      📢 정확한 정보는 반드시 WHC Vinh 프로(한국어통역)에게 문의해 주십시오.
    </div>

     <div style="display:flex; justify-content:flex-end; margin: 10px 0 6px;">
      <el-button type="success" @click="exportExcel">
        엑셀 다운로드
      </el-button>
    </div>
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
import { getStockItem, updateStockItemNote } from "../StockItem/StockItem";
import * as xlsx from "xlsx";

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

function exportExcel() {
  try {
    // 1) 헤더 정의
    const headers = [
      "No",
      "PN_FAB",
      "PN_WHC",
      "개발자",
      props.operationType === "reel" ? "Reel ID" : "Assay ID",
      "Location",
      "Received Date",
      "Receiver",
      "Total",
      "Remain",
      "Note",
    ];

    // 2) 행 데이터 평탄화
    const rows = props.stockItems.map((row, idx) => {
      const firstMesMaterials = row?.stockItemLabel?.lot?.firstMesMaterials ?? [];
      const pnFab = firstMesMaterials.map(m => m?.materialId ?? "-").filter(Boolean).join(", ");
      const designers = firstMesMaterials.map(m => m?.designer?.userName ?? "-").filter(Boolean);
      // 중복 제거
      const designerUnique = Array.from(new Set(designers)).join(", ");

      const pnWhc = row?.stockItemLabel?.lot?.materialId ?? "-";
      const idLabel = row?.label ?? "-";
      const location = row?.location ?? "-";
      const recvDate = formatDate(row?.dateOfCreated) ?? "-";
      const receiver = (row as any)?.receiver ?? "-";
      const total = row?.quantity ?? 0;
      const remain = (row?.quantity ?? 0) - (row?.assumedQuantity ?? 0);
      const note = row?.note ?? "";

      return [
        idx + 1,       // No
        pnFab,         // PN_FAB
        pnWhc,         // PN_WHC
        designerUnique,// 개발자
        idLabel,       // Reel ID / Assay ID
        location,      // Location
        recvDate,      // Received Date
        receiver,      // Receiver
        total,         // Total
        remain,        // Remain
        note,          // Note
      ];
    });

    // 3) 시트 생성
    const sheetData = [headers, ...rows];
    const ws = xlsx.utils.aoa_to_sheet(sheetData);
    // (선택) 컬럼 폭 자동/고정 설정
    const colWidths = headers.map((h, i) => {
      const maxLen = Math.max(
        h.length,
        ...rows.map(r => (r[i] ? String(r[i]).length : 0))
      );
      return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
    });
    (ws as any)['!cols'] = colWidths;

    // 4) 워크북 만들고 시트 추가
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Stock Items");

    // 5) 파일 저장
    const yyyymmdd = new Date().toISOString().slice(0, 10);
    const filename = `StockItems_${props.operationType}_${yyyymmdd}.xlsx`;
    xlsx.writeFile(wb, filename);
  } catch (e) {
    console.error(e);
    ElMessage.error("엑셀 내보내기 중 오류가 발생했습니다.");
  }
}

// Editing note functionality
interface EditingNote {
  row: StockItem;
  note: string;
}
const dialogEditNoteVisible = ref(false);
const editingNote = ref<EditingNote | null>(null);

async function handleEditNote(row: StockItem) {
  // Get frech stock item from backend to ensure we have the latest note
  try {
    const frechStockItem = await getStockItem(row.id);
    Object.assign(row, frechStockItem);
  } catch (error) {
    ElMessage.error("Failed to fetch stock item details");
    return;
  }

  // Prepare the editing note object and open the dialog
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

.notice-banner {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #e0f2fe; /* 파란 배경 */
  color: #075985; /* 진한 파랑 글씨 */
  font-weight: bold;
  border: 1px solid #38bdf8;
  border-radius: 6px;
  text-align: center;
  font-size: 1.1rem;
}

</style>