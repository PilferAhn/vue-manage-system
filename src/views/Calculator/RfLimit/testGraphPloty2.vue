<template>
    <div ref="plotlyChart" style="width: 100%; height: 400px;"></div>
    
  </template>
  

  <script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import Plotly from 'plotly.js-dist';
  
  // Define the interface for the test data
  interface Coordinate {
    x: number;
    y: number;
  }
  
  interface TestDataItem {
    name: string;
    line_color: string;
    coordinates: Coordinate[];
  }
  
  // Props
  const props = defineProps<{
    data: TestDataItem[];
  }>();
  
  const plotlyChart = ref<HTMLDivElement | null>(null);
  let annotations: any[] = [];  // To store all annotations
  
  // Function to plot the graph using Plotly.js
  const plotGraph = () => {
    if (!props.data || props.data.length === 0) {
      return;
    }
  
    const traces = props.data.map(item => {
      return {
        x: item.coordinates.map(coordinate => coordinate.x),
        y: item.coordinates.map(coordinate => coordinate.y),
        mode: 'lines+markers',  // Enable both lines and markers on the plot
        name: item.name,
        line: {
          color: item.line_color,
          width: 2
        },
        hoverinfo: 'x+y+name',
        hovertemplate: 'Name: %{name}<br>X: %{x}<br>Y: %{y}<extra></extra>',
        marker: { size: 6 }
      };
    });
  
    const layout = {
      title: 'Coordinates Plot',
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      autosize: true,
      hovermode: 'closest',
      annotations: annotations,  // Add annotations to layout
    };
  
    if (plotlyChart.value) {
      Plotly.newPlot(plotlyChart.value, traces, layout);
  
      // Attach click event to plotlyChart
      plotlyChart.value.on('plotly_click', function(data: any) {
        const point = data.points[0];  // Get the first clicked point
        addAnnotation(point);
      });
    }
  };
  
  // Function to add annotation on click
  const addAnnotation = (point: any) => {
    const annotation = {
      x: point.x,
      y: point.y,
      xref: 'x',
      yref: 'y',
      text: `(${point.x}, ${point.y})`,
      showarrow: true,
      arrowhead: 6,
      ax: 0,
      ay: -40,
      font: {
        color: 'black',
        size: 12
      },
      arrowcolor: 'black',
      bgcolor: 'rgba(255, 255, 255, 0.7)'
    };
  
    annotations.push(annotation);  // Add annotation to the list
    updateGraph();
  };
  
  // Function to update the graph with new annotations
  const updateGraph = () => {
    if (plotlyChart.value) {
      Plotly.relayout(plotlyChart.value, { annotations: annotations });
    }
  };
  
  // Watch for changes in props.data to re-render the graph
  watch(
    () => props.data,
    (newData) => {
      if (newData && newData.length > 0) {
        plotGraph();
      }
    }
  );
  
  // Plot the graph when the component is mounted
  onMounted(() => {
    if (props.data && props.data.length > 0) {
      plotGraph();
    }
  });
  </script>
  
  <style scoped>
  /* Optional styling for the graph container */
  </style>
  