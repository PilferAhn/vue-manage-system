import { ref } from "vue";
export const scatterDataSet1 = ref([
  {
    label: "Dataset 1",
    data: [
      { x: -10, y: 0 },
      { x: 0, y: 10 },
      { x: 10, y: 5 },
      { x: 15, y: -5 },
    ],
    backgroundColor: "rgba(255, 99, 132, 0.2)",
    borderColor: "rgba(255, 99, 132, 1)",
    showLine: true,
  },
  {
    label: "Dataset 2",
    data: [
      { x: -20, y: 30 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ],
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)",
    showLine: true,
  },
]);

export const scatterDataSet2 = ref([
  {
    label: "Dataset 2",
    data: [
      { x: -20, y: 30 },
      { x: 10, y: 10 },
      { x: 20, y: 20 },
    ],
    backgroundColor: "rgba(54, 162, 235, 0.2)",
    borderColor: "rgba(54, 162, 235, 1)",
    showLine: true,
  },
]);

export const scatterDataSet3 = ref([
  {
    label: "Dataset 3",
    data: [
      { x: -30, y: 5 },
      { x: -5, y: 20 },
      { x: 25, y: 15 },
    ],
    backgroundColor: "rgba(75, 192, 192, 0.2)",
    borderColor: "rgba(75, 192, 192, 1)",
    showLine: true,
  },
]);

export const scatterDataSet4 = ref([
  {
    label: "Dataset 4",
    data: [
      { x: 5, y: 15 },
      { x: 10, y: 25 },
      { x: 15, y: 35 },
    ],
    backgroundColor: "rgba(153, 102, 255, 0.2)",
    borderColor: "rgba(153, 102, 255, 1)",
    showLine: true,
  },
]);
