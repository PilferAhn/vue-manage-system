<template>
    <div>
      <div ref="chartDiv" style="width: 80%; max-width: 900px; height: 600px; margin: auto;"></div>
      <table class="coordinate-table">
        <thead>
          <tr>
            <th>Data Set</th>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>jig</td>
            <td>{{ highlightPoint.x }}</td>
            <td>{{ highlightPoint.y }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import Plotly from 'plotly.js-dist';
  
  // Props definition for test data
  const props = defineProps<{
    data: Array<{
      name: string;
      line_color: string;
      coordinates: Array<{ x: number; y: number }>;
    }>;
  }>();
  
  // Reference for the div element where Plotly will render the chart
  const chartDiv = ref<HTMLDivElement | null>(null);
  
  // Coordinates for the marker to highlight
  const highlightPoint = { x: 2418.75, y: -1.703 };
  
  onMounted(() => {
    if (chartDiv.value) {
      // Map the data for Plotly
      const traces = props.data.map((dataItem) => ({
        x: dataItem.coordinates.map(point => point.x),
        y: dataItem.coordinates.map(point => point.y),
        mode: 'lines',
        name: dataItem.name,
        line: { color: dataItem.line_color },
      }));
  
      // Adding a marker to the second graph (jig) at the specific point
      traces.push({
        x: [highlightPoint.x],
        y: [highlightPoint.y],
        mode: 'markers',
        marker: { color: 'blue', size: 12, symbol: 'circle' },
        name: 'Highlighted Point',
      });
  
      // Define layout options for the plot
      const layout = {
        title: 'Test Data Plot',
        xaxis: { title: 'X Axis', zeroline: false },
        yaxis: { title: 'Y Axis', zeroline: false },
        margin: { t: 50, b: 50, l: 50, r: 50 },
        autosize: true,
        showlegend: true,
      };
  
      // Create the plot with Plotly
      Plotly.newPlot(chartDiv.value, traces, layout);
    }
  });
  </script>
  
  <style scoped>
  /* Style for the plot container */
  div {
    margin: auto;
  }
  
  /* Table styling */
  .coordinate-table {
    margin-top: 20px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    border-collapse: collapse;
  }
  
  .coordinate-table th,
  .coordinate-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }
  
  .coordinate-table th {
    background-color: #f2f2f2;
  }
  </style>
  