/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCCTVDataByBounds,
  getCCTVQueryKey,
  type CCTVData,
  type BoundingBox,
} from "../../API/cctvAPI.ts";
import { useDetailPanelStore } from "../../stores/detailPanelStore";

/**
 * 카카오맵 전역 객체 타입 선언
 */
declare global {
  interface Window {
    kakao: any;
  }
}

/**
 * 카카오맵 bounds 객체 타입 정의
 * 지도의 현재 표시 영역 정보를 담는 객체
 */
interface KakaoBounds {
  getSouthWest: () => {
    getLng: () => number;
    getLat: () => number;
  };
  getNorthEast: () => {
    getLng: () => number;
    getLat: () => number;
  };
}

type MapPageProps = {
  onBoundsChange?: (bounds: BoundingBox) => void; // 지도 영역 변경
  onData?: (data: CCTVData[]) => void; // CCTV 데이터 변경
  onMapLevelChange?: (level: number) => void; // 지도 레벨 변경
  focusCCTV?: CCTVData | null; // 외부에서 포커스할 CCTV 데이터
};

/**
 * MapPage 컴포넌트
 * 카카오맵을 표시하고 CCTV 마커를 동적으로 로드하는 페이지
 * React Query를 사용하여 효율적인 데이터 관리
 */
export default function MapPage({
  onBoundsChange,
  onData,
  onMapLevelChange,
}: MapPageProps) {
  // 카카오맵 인스턴스 참조
  const mapRef = useRef<any>(null);

  // 지도에 표시된 마커들의 배열 참조
  const markersRef = useRef<any[]>([]);

  // 현재 열려있는 정보창 참조
  const infoWindowRef = useRef<any>(null);

  // 현재 지도 영역의 경계 좌표 상태
  const [currentBounds, setCurrentBounds] = useState<BoundingBox | null>(null);

  const [mapLevel, setMapLevel] = useState<number>(9);

  // 전역 DetailPanel 스토어 사용: 열기/교체/열림 상태
  const openDetail = useDetailPanelStore((s) => s.open);
  const replaceDetail = useDetailPanelStore((s) => s.replace);
  const isDetailOpen = useDetailPanelStore((s) => s.isOpen);

  const handleRoadClick = (cctvData: CCTVData) => {
    // 이미 열려 있으면 데이터만 교체하여 깜빡임 없이 갱신
    if (isDetailOpen) {
      replaceDetail(cctvData);
    } else {
      openDetail(cctvData);
    }
  };

  // React Query를 사용한 CCTV 데이터 패칭
  // currentBounds가 변경될 때마다 자동으로 새로운 데이터를 가져옴

  const {
    data: cctvData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey:
      currentBounds && mapLevel < 8
        ? getCCTVQueryKey(currentBounds, mapLevel)
        : ["cctv-data", "empty"],
    queryFn: () =>
      currentBounds && mapLevel < 8
        ? fetchCCTVDataByBounds(currentBounds)
        : Promise.resolve([]),
    enabled: !!currentBounds, // currentBounds가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 2, // 2분간 캐시 유효
    gcTime: 1000 * 60 * 5, // 5분간 캐시 버리지 않음
  });

  useEffect(() => {
    // 부모(LivePage)로 최신 CCTV 데이터를 전달하여 다른 패널에서도 사용할 수 있게 함
    onData?.(cctvData);
  }, [cctvData, onData]);

  /**
   * 카카오맵 bounds를 BoundingBox 형태로 변환하는 함수
   * @param bounds - 카카오맵 bounds 객체
   * @returns BoundingBox 형태의 좌표 정보
   */
  const convertBounds = useCallback((bounds: KakaoBounds): BoundingBox => {
    const swLatLng = bounds.getSouthWest(); // 남서쪽 모서리
    const neLatLng = bounds.getNorthEast(); // 북동쪽 모서리

    return {
      minX: swLatLng.getLng(), // 서쪽 경계 (최소 경도)
      maxX: neLatLng.getLng(), // 동쪽 경계 (최대 경도)
      minY: swLatLng.getLat(), // 남쪽 경계 (최소 위도)
      maxY: neLatLng.getLat(), // 북쪽 경계 (최대 위도)
    };
  }, []);

  /**
   * 지도에 CCTV 마커들을 표시하는 함수
   * 기존 마커를 모두 제거하고 새로운 데이터로 마커를 생성
   * @param data - 표시할 CCTV 데이터 배열
   */
  const displayMarkers = useCallback(
    (data: CCTVData[]) => {
      // 카카오맵이 로드되지 않았다면 함수 종료
      if (!mapRef.current || !window.kakao) {
        console.warn("⚠️ 카카오맵이 아직 로드되지 않았습니다.");
        return;
      }

      // 기존에 표시된 모든 마커들을 지도에서 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null); // 지도에서 마커 제거
      });
      markersRef.current = []; // 마커 배열 초기화

      // 열려있는 정보창이 있다면 닫기
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }

      // 새로운 CCTV 데이터로 마커들 생성
      data.forEach((cctv, index) => {
        try {
          // 문자열로 된 좌표를 숫자로 변환하여 카카오맵 좌표 객체 생성
          const lat = parseFloat(cctv.coordy); // 위도
          const lng = parseFloat(cctv.coordx); // 경도

          // 좌표 유효성 검사
          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`⚠️ 잘못된 좌표 (${index + 1}번째 CCTV):`, cctv);
            return;
          }

          const position = new window.kakao.maps.LatLng(lat, lng);

          // CCTV 아이콘을 위한 SVG 이미지 생성
          // Base64로 인코딩된 SVG를 data URL로 사용
          const imageSrc =
            "data:image/svg+xml;base64," +
            btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
            <circle cx="14" cy="14" r="8" fill="#ffffff"/>
            <circle cx="14" cy="14" r="4" fill="#3B82F6"/>
          </svg>
        `);

          // 마커 이미지 크기 설정
          const imageSize = new window.kakao.maps.Size(14, 14);
          const imageOption = {
            offset: new window.kakao.maps.Point(14, 14), // 마커 중심점 설정
          };

          // 마커 이미지 객체 생성
          const markerImage = new window.kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imageOption
          );

          // 마커 객체 생성
          const marker = new window.kakao.maps.Marker({
            position: position, // 마커 위치
            image: markerImage, // 마커 이미지
            title: cctv.cctvname, // 마커 툴팁 (브라우저 기본 툴팁)
            clickable: true, // 클릭 가능하도록 설정
          });

          marker.setMap(mapRef.current);
          onMapLevelChange?.(mapLevel); // 부모 컴포넌트에 지도 레벨 변경 알림

          // 마커를 배열에 추가 (나중에 제거하기 위함)
          markersRef.current.push(marker);

          // 마커 호버 시 표시할 정보창 생성
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `
            <div style="
              padding: 10px 12px;
              font-size: 13px;
              font-weight: 600;
              color: #1F2937;
              background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              max-width: 240px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              position: relative;
            ">
              <div style="display: flex; justify-content: center; align-items: center; gap: 6px;">
                <span>${cctv.cctvname}</span>
              </div>
            </div>
          `,
            removable: false, // 사용자가 X 버튼으로 닫을 수 없게 설정
            zIndex: 1000, // 다른 요소들 위에 표시
          });

          // 마커에 마우스를 올렸을 때 이벤트
          window.kakao.maps.event.addListener(marker, "mouseover", function () {
            // 다른 정보창이 열려있다면 먼저 닫기
            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }

            // 현재 마커의 정보창 열기
            infoWindow.open(mapRef.current, marker);
            infoWindowRef.current = infoWindow;
          });

          // 마커에서 마우스를 뗐을 때 이벤트
          window.kakao.maps.event.addListener(marker, "mouseout", function () {
            // 약간의 지연 후 정보창 닫기 (깜빡임 방지)
            setTimeout(() => {
              if (infoWindowRef.current === infoWindow) {
                infoWindow.close();
                infoWindowRef.current = null;
              }
            }, 150);
          });

          // 마커 클릭 이벤트 (추후 CCTV 상세보기 등에 활용 가능)
          window.kakao.maps.event.addListener(marker, "click", function () {
            console.log("🎬 CCTV 클릭:", {
              name: cctv.cctvname,
              url: cctv.cctvurl,
              coordinates: { lat, lng },
              type: cctv.cctvtype,
              format: cctv.cctvformat,
            });
            handleRoadClick(cctv);
          });

          // console.log(`✅ 마커 생성 완료: ${cctv.cctvname} (${lat}, ${lng})`);
        } catch (error) {
          console.error(
            `❌ 마커 생성 실패 (${index + 1}번째 CCTV):`,
            error,
            cctv
          );
        }
      });
    },
    [onMapLevelChange, mapLevel, handleRoadClick]
  );

  /**
   * 지도 영역이 변경되었을 때 호출되는 함수
   * 디바운싱을 적용하여 너무 빈번한 API 호출을 방지
   */
  const handleBoundsChanged = useCallback(
    (bounds: KakaoBounds) => {
      const boundingBox = convertBounds(bounds);
      // console.log("🗺️ 지도 영역 변경:", boundingBox);
      setCurrentBounds(boundingBox);
      onBoundsChange?.(boundingBox); // 부모 컴포넌트에 변경된 영역 전달
    },
    [convertBounds, onBoundsChange]
  );

  // CCTV 데이터가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (cctvData && cctvData.length > 0) {
      // console.log("📡 새로운 CCTV 데이터 수신:", cctvData.length);
      displayMarkers(cctvData);
    } else {
      // console.log("📭 CCTV 데이터가 없습니다.");
      displayMarkers([]);
    }
  }, [cctvData, displayMarkers]);

  // 에러 상태 처리
  useEffect(() => {
    if (isError && error) {
      console.error("💥 CCTV 데이터 로딩 오류:", error);
    }
  }, [isError, error]);

  /**
   * 컴포넌트 마운트 시 카카오맵 초기화 및 이벤트 설정
   * useEffect를 사용해 한 번만 실행되도록 함
   */
  useEffect(() => {
    // 카카오맵 API가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      // 지도를 표시할 HTML 요소 가져오기
      const mapContainer = document.getElementById("map");
      if (!mapContainer) {
        console.error("❌ 지도 컨테이너를 찾을 수 없습니다.");
        return;
      }

      // 지도 초기 옵션 설정
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.35, 127.1324), // 서울 강남역 근처 좌표
        level: mapLevel, // 지도 확대 레벨 (1~14, 숫자가 작을수록 더 확대)
      };

      // 카카오맵 인스턴스 생성 및 ref에 저장
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      mapRef.current = map;

      setMapLevel(map.getLevel()); // 현재 지도 레벨 저장

      // 지도 로딩 완료 후 초기 CCTV 데이터 로드
      // setTimeout을 사용해 지도 렌더링이 완료된 후 bounds 설정
      setTimeout(() => {
        const bounds = map.getBounds(); // 현재 지도 영역 가져오기
        handleBoundsChanged(bounds); // 초기 영역 설정
      }, 500); // 지연 시간을 늘려서 안정적인 초기화

      // 지도 영역이 변경될 때마다 CCTV 데이터 다시 로드
      let boundsChangedTimeout: number;

      window.kakao.maps.event.addListener(map, "bounds_changed", function () {
        // 디바운싱 처리: 지도 이동/확대가 빈번할 때 API 호출을 제한
        clearTimeout(boundsChangedTimeout);

        // 0.5초 후에 API 호출 (사용자가 지도 조작을 멈췄을 때)
        boundsChangedTimeout = window.setTimeout(() => {
          const bounds = map.getBounds(); // 변경된 지도 영역 가져오기
          const level = map.getLevel(); // 현재 지도 레벨 가져오기
          setMapLevel(level);
          handleBoundsChanged(bounds); // 새 영역의 CCTV 데이터 로드
        }, 500); // 디바운싱 시간을 500ms로 설정
      });

      // 컴포넌트 언마운트 시 정리 작업
      return () => {
        // 타이머 정리
        clearTimeout(boundsChangedTimeout);

        // 모든 마커를 지도에서 제거
        markersRef.current.forEach((marker) => {
          marker.setMap(null);
        });
        markersRef.current = [];

        // 정보창 닫기
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
          infoWindowRef.current = null;
        }
      };
    } else {
      // 카카오맵 API가 로드되지 않은 경우 에러 로그
      console.error(
        "❌ 카카오맵 API가 로드되지 않았습니다. index.html에서 스크립트 태그를 확인해주세요."
      );
    }
  }, []);

  // 컴포넌트 렌더링
  return (
    <div className="relative">
      {/* 카카오맵 컨테이너 - 전체 화면 크기로 고정 */}
      <div id="map" className="fixed h-[100vh] w-[100vw] bg-gray-100"></div>

      {/* 로딩 인디케이터 - API 호출 중일 때 표시 */}
      {isLoading && (
        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center gap-3">
          {/* CSS 애니메이션을 사용한 로딩 스피너 */}
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm text-gray-700 font-medium">
            CCTV 데이터 로딩 중...
          </span>
        </div>
      )}

      {/* 에러 표시 */}
      {isError && (
        <div className="absolute top-4 left-4 z-10 bg-red-50 border border-red-200 rounded-lg shadow-lg px-4 py-2 flex items-center gap-3">
          <span className="text-red-600">❌</span>
          <span className="text-sm text-red-800 font-medium">
            데이터 로딩 실패:{" "}
            {error instanceof Error ? error.message : "알 수 없는 오류"}
          </span>
        </div>
      )}
    </div>
  );
}
