<template>
  <div>
    <h2>Measurement Data</h2>
    <table>
      <thead>
        <tr>
          <th>구분</th>
          <th>주간 의뢰 건 수(웨이퍼 매수)</th>
          <th>Leadtime</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>제품(3,4순위)</td>
          <td>{{ productQuantity }}</td>
          <td>{{ productLeadTime }}일</td>
        </tr>
        <tr>
          <td>일반(1,2순위)</td>
          <td>{{ modelQuantity }}</td>
          <td>{{ modelLeadTime }}일</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, onMounted } from "vue";
const product = ref("")
const model = ref("")

const productQuantity = ref("")
const productLeadTime = ref("")

const modelQuantity = ref("")
const modelLeadTime = ref("")

async function getLeadTime(){

  try {
    
    const url = "/teg_application/cal_lead_time"

    const response = await axios.get(url);

    product.value = response.data["product"]
    model.value = response.data["model"]

    console.log(product.value)
    console.log(model.value)

    productQuantity.value = product.value["number_of_application"].toString() + "(" + product.value["number_of_wafer"].toString() + ")"
    modelQuantity.value = model.value["number_of_application"].toString() + "(" + model.value["number_of_wafer"].toString() + ")"

    productLeadTime.value = parseFloat(product.value["lead_time"].toFixed(2)).toString()
    modelLeadTime.value = parseFloat(model.value["lead_time"].toFixed(2)).toString()


  } catch (error) {
    
  }

}

onMounted(() => {
  getLeadTime();
});

</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table,
th,
td {
  border: 1px solid black;
}

th,
td {
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}
</style>
