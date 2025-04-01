// 파일을 표현하는 인터페이스
export interface ApplicationFile {
  name: string;
  size: number;
  type: string;
  rawFile: File; // 원본 파일 객체
}