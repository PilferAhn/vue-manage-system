import axios from 'axios';

export interface Machine {
  
  modelName: string;
  machineName: string;
  requestNumber: string;
  sampleNumber: string;
  status : string;
  s21Points: Array<{ x: number, y: number }>;
  measurementPoints: Array<{ x: number, y: number }>;
  startTime : string;
  endTime : string;
  testType : string;
  applicationUuid : string;
  measurementUuid : string;
  pdtSampleUuid : string;
}

export const fetchMachine = async (pdtSampleUuid : string): Promise<Machine | null> => {
  try {
    const response = await axios.get(`machine/get_machine/${pdtSampleUuid}`);

    const item = response.data;  // 단일 객체를 가정
    const machine: Machine = {
      modelName: item.model_name,  // modelName 필드가 없다면 빈 문자열로 초기화
      machineName: item.machine_name,
      requestNumber: item.request_number,
      sampleNumber: item.sample_number,
      s21Points: item.s21_points,
      measurementPoints: item.measurement_points,
      startTime: item.start_time,
      endTime: item.end_time,
      status: item.status.toUpperCase(),
      testType: item.test_type,
      applicationUuid: item.application_uuid,
      measurementUuid: item.measurement_uuid,
      pdtSampleUuid : item.pdt_sample_uuid
    };
    return machine;
  } catch (error) {
    console.error('Error fetching machine:', error);
    return null;
  }
};

export const fetchMachines = async (): Promise<Machine[]> => {
  try {
    const response = await axios.get('machine/get_machine_list');
    const data = response.data.map((item: any) => ({
      modelName: item.model_name,  // modelName 필드가 없다면 빈 문자열로 초기화
      machineName: item.machine_name,
      requestNumber: item.request_number,
      sampleNumber: item.sample_number,
      s21Points: item.s21_points,
      measurementPoints: item.measurement_points,
      startTime : item.start_time,
      endTime : item.end_time,
      status : item.status.toUpperCase(),
      testType : item.test_type,
      applicationUuid : item.application_uuid,
      measurementUuid : item.measurement_uuid,
      pdtSampleUuid : item.pdt_sample_uuid
    }));
    return data;
  } catch (error) {
    console.error('Error fetching machines:', error);
    return [];
  }
};
