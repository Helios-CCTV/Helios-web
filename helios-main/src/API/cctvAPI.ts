/**
 * CCTV API 관련 함수들을 모아둔 모듈
 * 지도 영역 내의 CCTV 데이터를 가져오는 API 호출 처리
 * axios를 사용하여 HTTP 요청 처리
 */

import axios from "axios";

/**
 * 환경변수에서 CCTV API URL을 가져옴
 * .env 파일의 VITE_CCTV_API_URL 값을 사용
 * Vite 환경에서는 VITE_ 접두사가 필요함
 */
const CCTV_API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

// 인터페이스 정의

/**
 * CCTV 데이터 응답 인터페이스 정의
 */
export interface CCTVData {
  id: number; // CCTV 고유 ID
  roadsectionid: string; // 도로 구간 ID
  filecreatetime: string; // 파일 생성 시간
  cctvtype: string; // CCTV 타입 (1: 일반형)
  cctvurl: string; // CCTV 스트리밍 URL
  cctvresolution: string; // CCTV 해상도 정보
  coordx: string; // X좌표 (경도, longitude)
  coordy: string; // Y좌표 (위도, latitude)
  cctvformat: string; // 스트리밍 포맷 (HLS 등)
  cctvname: string; // CCTV 이름/위치 설명
}

export interface CCTVDataTopLevel {
  regionId: string;
  localname: string;
  coordx: number;
  coordy: number;
  count: number;
  polygon: string; // GeoJSON 형식의 폴리곤 좌표
}

/**
 * API 응답 구조 정의
 */
export interface APIResponse {
  success: boolean; // 요청 성공 여부
  code: number; // HTTP 상태 코드
  message: string; // 응답 메시지
  data: CCTVData[]; // CCTV 데이터 배열
}

/**
 * 지도 경계 좌표 정보 인터페이스
 */
export interface BoundingBox {
  minX: number; // 최소 경도 (서쪽 경계)
  maxX: number; // 최대 경도 (동쪽 경계)
  minY: number; // 최소 위도 (남쪽 경계)
  maxY: number; // 최대 위도 (북쪽 경계)
}

/**
 * axios 인스턴스 생성
 * 기본 설정과 인터셉터를 적용
 */
const apiClient = axios.create({
  baseURL: CCTV_API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 요청을 보낼 때 먼저 수행되는 파트
 * config가 우선적으로 사용되며 에러가 발생했을 경우 error를 실행
 * 인터셉트하는거임 ㅇㅇ
 */
apiClient.interceptors.request.use(
  (config) => {
    console.log(
      `🔄 CCTV API 요청: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API 요청 설정 오류:", error);
    return Promise.reject(error);
  }
);

/**
 * 응답 받았을 때 실행되는 파트
 * 응답이 제대로 왔을 경우 response의 status와 data를 console에 찍음
 * 서버가 응답했는데 오류를 뱉을 경우 아래 오류를 실행
 */
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ CCTV API 응답: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // 서버가 응답했지만 오류 상태 코드
      console.error(
        `❌ API 서버 오류: ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못함
      console.error("❌ API 서버 무응답:", error.request);
    } else {
      // 요청 설정 중 오류 발생
      console.error("❌ API 요청 설정 오류:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * 지도 영역 내의 CCTV 데이터를 가져오는 함수 (axios 사용)
 * React Query와 함께 사용하기 위해 Promise를 반환
 * @param bounds - 지도 경계 좌표 객체
 * @returns CCTV 데이터 배열을 반환하는 Promise
 * @throws API 호출 실패 시 에러 발생
 */
export const fetchCCTVDataByBounds = async (
  bounds: BoundingBox
): Promise<CCTVData[]> => {
  try {
    console.log("📍 요청할 지도 영역:", bounds);

    // axios를 사용하여 GET 요청
    const response = await apiClient.get<APIResponse>("/cctv/view", {
      // 파라미터 로깅, 요청할 bounds를 minX 부터 maxX, minY부터 maxY
      params: {
        minX: bounds.minX,
        maxX: bounds.maxX,
        minY: bounds.minY,
        maxY: bounds.maxY,
        level: 7,
      },
    });

    // API 응답 데이터 검증
    // 응답이 없을 경우 뱉음
    if (!response.data.success) {
      throw new Error(
        `API 오류: ${response.data.message || "알 수 없는 오류"}`
      );
    }

    // CCTV 데이터가 있는지 확인
    // 데이터가 없으면 빈 Array를 뱉음
    if (!response.data.data || !Array.isArray(response.data.data)) {
      return [];
    }

    // data를 cctvData에 삽입
    const cctvData = response.data.data;
    console.log(`📹 CCTV 데이터 ${cctvData.length}개 로드 완료`);

    // 좌표 유효성 검사
    // 좌표가 유효한지 검사하는거임
    const validCCTVData = cctvData.filter((cctv) => {
      const hasValidCoords =
        cctv.coordx &&
        cctv.coordy &&
        !isNaN(parseFloat(cctv.coordx)) &&
        !isNaN(parseFloat(cctv.coordy));
      if (!hasValidCoords) {
        console.warn("⚠️ 유효하지 않은 좌표:", cctv);
      }
      return hasValidCoords;
    });

    console.log(`✅ 유효한 CCTV 데이터 ${validCCTVData.length}개`);

    return validCCTVData;
  } catch (error) {
    console.error("💥 CCTV 데이터 로딩 실패:", error);
    // React Query에서 에러를 처리할 수 있도록 다시 throw
    throw error;
  }
};

/**
 * React Query 키 생성 함수
 * 지도 영역에 따라 고유한 쿼리 키를 생성
 * @param bounds - 지도 경계 좌표
 * @returns React Query 키 배열
 */
// QueryKey이며 같은 경계로 다시 열람했을 경우 캐시를 재사용 ;; ㅅㅂ 뭐라는지 모르겠음
export const getCCTVQueryKey = (bounds: BoundingBox, level: number) => {
  return ["cctv-data", bounds, level] as const;
};

/**
 * API 상태를 확인하는 헬스체크 함수
 * CCTV API 서버가 정상 동작하는지 확인
 * @returns API 서버 정상 여부
 */
export const checkCCTVAPIHealth = async (): Promise<boolean> => {
  try {
    // 간단한 요청으로 서버 상태 확인
    const response = await apiClient.get("/health", { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    console.error("❌ CCTV API 헬스체크 실패:", error);
    return false;
  }
};
