import axios from "axios";

const CCTV_API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

// 파손 라벨 종류
export type DetectionLabel =
  | "반사균열"
  | "세로방향균열"
  | "밀림균열"
  | "러팅"
  | "코루게이션및쇼빙"
  | "함몰"
  | "포트홀"
  | "라벨링"
  | "박리"
  | "정상"
  | "단부균열"
  | "시공균열"
  | "거북등";

  // API 응답 타입
export interface AnalyzeResponse {
  id: number;
  cctvName: string;
  analyzeId: number;
  date: string;
  detections: DetectionLabel[];
}

// 가공 된 데이터 타입
export interface AnalyzeModel {
  id: number;
  cctvName: string;
  analyzeId: number;
  date: Date; //Date 형태로 변환
  detections: { label: DetectionLabel }[]; // 라벨 종류
  hasDefect: boolean; // 검출 여부
}


// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: CCTV_API_BASE_URL,
  timeout: 500000, // 5초 타임아웃 설정
});


// 분석 데이터 가져오는 함수
export const fetchAnalyzeData = async (): Promise<AnalyzeModel[]> => {
  const response = await apiClient.get<{ data: AnalyzeResponse[] }>(
    "analyze/get-analyze"
  );

  return response.data.data.map((item) => ({
    id: item.id,
    cctvName: item.cctvName,
    analyzeId: item.analyzeId,
    date: new Date(item.date),
    detections: item.detections.map((label) => ({ label })),
    hasDefect: item.detections.length > 0,
  }));
};
