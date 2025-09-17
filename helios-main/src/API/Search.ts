import axios from "axios";

const CCTV_API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
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

export interface SearchModel {
  cctvType: number;
  cctvUrl: string;
  coorDx: number;
  coorDy: number;
  cctvFormat: string;
  cctvName: string;
  cctvUrlPre: null;
}

const apiClient = axios.create({
  baseURL: CCTV_API_BASE_URL,
  timeout: 500000,
});

export const fetchSearchData = async (
  body: SearchRequest
): Promise<SearchModel[]> => {
  const response = await apiClient.post<{ data: SearchResponse[] }>(
    "api/cctv/search",
    null,
    { params: { search: body.query } }
  );

  const raw = response.data.data;

  return raw.map((item) => ({
    cctvType: item.cctvtype,
    cctvUrl: item.cctvurl,
    coorDx: item.coordx,
    coorDy: item.coordy,
    cctvFormat: item.cctvformat,
    cctvName: item.cctvname,
    cctvUrlPre: item.cctvurl_pre,
  }));
};
