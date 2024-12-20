// dataProcessor.ts

export interface MeasurementData {
  date?: string;
  measurement_type: string;
  finished_task: number;
}

export interface WeeklyResult {
  week: string;
  measurement_type: string;
  finished_task: number;
}

export interface TotalResult {
  measurement_type: string;
  finished_task: number;
}

export const MEASUREMENT_ORDER = [
  "특성 평가",
  "PDT(Manual_수탑)",
  "PDT(SMT)",
  "PS 신뢰성",
  "TCF",
  "비선형",
];

export function sumTotalData(data: MeasurementData[]): MeasurementData[] {
  const totalData: { [key: string]: number } = {};

  data.forEach((item) => {
    const type = item.measurement_type;
    if (!totalData[type]) {
      totalData[type] = 0;
    }
    totalData[type] += item.finished_task;
  });

  // 결과를 순서에 맞게 정렬
  return MEASUREMENT_ORDER.map((type) => ({
    measurement_type: type,
    finished_task: totalData[type] || 0,
  }));
}

export function getMaxNumFromResult(data : TotalResult[]){
  return Math.max(...data.map(item => item.finished_task));
}

export function sortTotalMeasurementTypes(data: MeasurementData[]): MeasurementData[] {
  return data.sort((a, b) => {
    const indexA = MEASUREMENT_ORDER.indexOf(a.measurement_type);
    const indexB = MEASUREMENT_ORDER.indexOf(b.measurement_type);
    return indexA - indexB;
  });
}

export function sortMeasurementTypes(data: WeeklyResult[]): WeeklyResult[] {
  return data.sort((a, b) => {
    const indexA = MEASUREMENT_ORDER.indexOf(a.measurement_type);
    const indexB = MEASUREMENT_ORDER.indexOf(b.measurement_type);
    return indexA - indexB;
  });
}

function getWeekNumber(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const adjustedDate = date.getDate() + dayOfWeek - 1;
  return Math.ceil(adjustedDate / 7);
}

export function processWeeklyData(data: MeasurementData[]): WeeklyResult[] {
  const weeklyData: { [key: string]: { [key: string]: number } } = {};

  data.forEach((item) => {
    const dateObj = new Date(item.date);
    const weekKey = `Week ${getWeekNumber(dateObj)}`;
    const typeKey = item.measurement_type;

    if (!weeklyData[weekKey]) weeklyData[weekKey] = {};

    if (!weeklyData[weekKey][typeKey]) {
      weeklyData[weekKey][typeKey] = 0;
    }

    weeklyData[weekKey][typeKey] += item.finished_task;
  });

  const result: WeeklyResult[] = [];
  for (const week in weeklyData) {
    for (const type in weeklyData[week]) {
      result.push({
        week,
        measurement_type: type,
        finished_task: weeklyData[week][type],
      });
    }
  }

  return result;
}
