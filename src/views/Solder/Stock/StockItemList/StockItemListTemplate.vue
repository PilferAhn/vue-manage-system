<template>
  <div>
    <!-- Search Input -->
    <!-- <div style="margin-bottom: 20px; display: flex; justify-content: flex-start; align-items: center;">
      <el-input
        v-model="searchTerm"
        placeholder="Model Name 검색"
        clearable
        style="width: 300px;"
        @clear="handleClear"
      >
        <template #prefix>
          <i class="el-icon-search"></i>
        </template>
      </el-input>
    </div> -->

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
    <el-table-column label="No" width="60" :align="'center'">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        label="PN_FAB"
        width="140"
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
        width="150"
        :align="'center'"
      >
        <template #default="scope">
          {{ scope.row?.stockItemLabel?.lot?.materialId  || "-" }}
        </template>
      </el-table-column>
      
      <el-table-column
        prop="designer"
        label="개발자"
        width="100"
        :align="'center'"
      >
        <template #default="scope">
          <div  v-for="firstMesMaterial in scope.row?.stockItemLabel?.lot?.firstMesMaterials">
            {{ firstMesMaterial?.designer?.userName || "-" }}
          </div>
        </template>

      </el-table-column>
   
  
    <!-- <el-table-column v-if="name==='admin'"
        
        label="ID"
        width="150"
        :align="'center'"
      >

      <template #default="scope">
        
      </template>
    </el-table-column> -->

    <!-- <el-table-column v-if="name === 'admin'" label="Designer" width="150" :align="'center'">
  <template #default="scope">
    <el-autocomplete
      v-model="scope.row.designer"
      :fetch-suggestions="(queryString, cb) => querySearch(queryString, cb)"
      placeholder="Enter user name"
      @select="(item) => handleSelect(item, scope.row)"
      clearable
      :disabled ="scope.row.isFound"
    ></el-autocomplete>
    <el-select v-model="scope.row.designer">
      <el-option v-for="(u , index) in userList"
      :key="index"
      :label="u.userName"
      :value="u.userName"
      ></el-option>
    </el-select>
  </template>
</el-table-column> -->

      <el-table-column
        v-if="props.operationType === 'reel'"
        prop="label"
        label="Reel ID"
        width="160"
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
        width="110"
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

      <!-- Button Column -->
      <el-table-column label="Actions" width="200" :align="'center'">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(scope.row)"
          >
            View Detail
          </el-button>
          <!-- <el-button
          type="success"
          size="small"
          @click="handleUpdate(scope.row)"
          >
          Update
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { StockItem, StockItemType } from "../../../../interface/stock";
import { formatDate } from "../../../../utils/date-utils";
import { useRouter } from "vue-router";

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

</script>

<style lang="scss" scoped>
.custom-table ::v-deep(.el-warning) {
  background-color: hsl(0, 42%, 90%) !important; /* Ensure the background changes */
  color: hsl(0, 68%, 12%) !important;  
}
</style>