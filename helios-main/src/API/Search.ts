import axios from "axios";

const CCTV_API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

// 검색을 위해 사용하는 파라미터 데이터 타입
export interface SearchRequest {
  query: string;
}

// 검색 결과 데이터 타입
export interface SearchResponse {
  id: number;
  roadsectionid: string;
  filecreatetime: string;
  cctvtype: number;
  cctvurl: string;
  cctvresolution: string;
  coordx: number;
  coordy: number;
  cctvformat: string;
  cctvname: string;
  cctvurl_pre: null;
}

// 가공할 데이터 타입
export interface SearchModel {
  id: number;
  cctvType: number;
  cctvUrl: string;
  coorDx: number;
  coorDy: number;
  cctvFormat: string;
  cctvName: string;
  cctvUrlPre: null;
}

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: CCTV_API_BASE_URL,
  timeout: 500000,
});

// 검색 API 호출 함수
export const fetchSearchData = async (
  body: SearchRequest
): Promise<SearchModel[]> => {
  const response = await apiClient.get<{ data: SearchResponse[] }>(
    "cctv/search", // 검색 주소
    { params: { search: body.query } } // 파라미터
  );

  // 응답 데이터
  const raw = response.data.data;


  // 데이터 가공
  return raw.map((item) => ({
    id: item.id,
    cctvType: item.cctvtype,
    cctvUrl: item.cctvurl,
    coorDx: item.coordx,
    coorDy: item.coordy,
    cctvFormat: item.cctvformat,
    cctvName: item.cctvname,
    cctvUrlPre: item.cctvurl_pre,
  }));
};
