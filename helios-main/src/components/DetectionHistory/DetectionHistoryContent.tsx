import * as React from "react";
// import React
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Hls from "hls.js";

// import API
import { fetchDetectionData } from "../../API/Detection";
import { fetchSearchData } from "../../API/Search";
import type { DetectionModel } from "../../API/Detection";

export default function DetectionHistoryContent({
  labelFilter,
  searchData,
}: {
  labelFilter?: string | null;
  searchData?: string | null;
}) {
  // 탐지 기록 데이터 API 호출
  const DetectionListQuery = useQuery({
    queryKey: ["detectionList"],
    queryFn: fetchDetectionData,
    staleTime: 60 * 1000,
  });

  // 검색 쿼리가 존재할때 API 호출
  const searchResultQuery = useQuery({
    queryKey: ["cctvSearch", searchData],
    queryFn: () => fetchSearchData({ query: (searchData ?? "").trim() }),
    enabled: !!(searchData && searchData.trim().length > 0),
    staleTime: 60 * 1000,
  });

  // 탐지 기록 데이터
  const detectionListData = DetectionListQuery.data || [];

  // 검색이 있을 때 검색 결과 제공, 없으면 전체 데이터 제공
  const baseDetections = useMemo(() => {
    const q = (searchData ?? "").trim(); // 검색어 공백 제거
    if (!q) return detectionListData as DetectionModel[]; // 검색어 없으면 전체 데이터

    const results = (searchResultQuery.data ?? []) as { id: number | string }[]; // 검색 결과 저장
    if (!results || results.length === 0) return []; // 검색 결과 없으면 빈 배열

    const idSet = new Set<number>( // 검색 결과 ID 집합
      results.map((r) => Number(r.id)).filter((n) => Number.isFinite(n))
    );
    return (detectionListData as DetectionModel[]).filter(
      (
        d //검색 결과 리턴 (id 제공)
      ) => idSet.has(Number(d.id))
    );
  }, [detectionListData, searchData, searchResultQuery.data]);

  // 검색 기능 이전 코드
  // - labelFilter가 없으면 전체 컨텐츠 제공
  // - labelFilter가 있으면 해당 라벨을 가진 CCTV만 남김
  // const filteredDetections = useMemo(() => {
  //   if (!labelFilter) return detectionListData;
  //   return (detectionListData as DetectionModel[]).filter((item) =>
  //     item.detections.some((d) => d.label === labelFilter)
  //   );
  // }, [detectionListData, labelFilter]);

  // 필터링된 탐지 기록 데이터 (라벨 필터), 검색 기록과 비교에서 검색이 존재하면 검색 결과 제공
  const filteredDetections = useMemo(() => {
    if (!labelFilter) return baseDetections;
    return baseDetections.filter((item) =>
      item.detections.some((d) => d.label === labelFilter)
    );
  }, [baseDetections, labelFilter]);

  // 10개씩 컨텐츠 제공
  const PER_PAGE = 10; // 한 페이지 표시 개수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (1부터 시작)

  // HLS 플레이어
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);

  // 데이터가 바뀌면 항상 1페이지로 초기화 (검색/필터 추가 시에도 동일 패턴 권장)
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredDetections]);

  // 총 페이지 수 (최소 1)
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDetections.length / PER_PAGE)
  );

  // 현재 페이지가 총 페이지 수를 넘어가면 보정
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // 현재 페이지에 보여줄 10개 아이템 슬라이스
  const pagedDetections = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredDetections.slice(start, start + PER_PAGE);
  }, [filteredDetections, currentPage]);

  // 하단 숫자 버튼 목록 (단순/가독성 우선)
  const getPageNumbers = (total: number, current: number) => {
    const pages: (number | string)[] = [];
    if (total <= 10) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    const start = Math.max(2, current - 2);
    const end = Math.min(total - 1, current + 2);
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("…");
    pages.push(total);
    return pages;
  };

  // 페이지네이션 버튼 목록
  const pageNumbers = useMemo(
    () => getPageNumbers(totalPages, currentPage),
    [totalPages, currentPage]
  );

  // 상태에 대한 매핑
  const getStatusInfo = (count: number) => {
    if (count >= 2) return { status: "위험" as const, color: "red" as const };
    if (count >= 1)
      return { status: "주의" as const, color: "yellow" as const };
    return { status: "안전" as const, color: "green" as const };
  };

  // 날짜
  const formatDateParts = (dt?: Date) => {
    if (!dt || isNaN(dt.getTime())) return { date: "-", time: "-" };
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const HH = String(dt.getHours()).padStart(2, "0");
    const MM = String(dt.getMinutes()).padStart(2, "0");
    return { date: `${yyyy}.${mm}.${dd}`, time: `${HH}:${MM}` };
  };

  // HLS attach: 모달이 열릴 때 .m3u8 재생 시도
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // playerOpen 또는 playerUrl이 바뀔 때마다 재생 시도
  useEffect(() => {
    if (!playerOpen || !playerUrl) return;
    const video = videoRef.current;
    if (!video) return;

    // Safari(iOS/macOS)는 HLS를 네이티브로 재생 가능
    const canNative = video.canPlayType("application/vnd.apple.mpegurl");
    let hls: Hls | null = null;

    if (canNative) {
      // 네이티브 재생: src에 바로 연결
      video.src = playerUrl;
      video.play().catch(() => {});
    } else if (Hls.isSupported()) {
      // 다른 브라우저: hls.js 사용
      hls = new Hls({ enableWorker: true });
      hls.loadSource(playerUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else {
      // 재생 불가 환경
      alert(
        "이 브라우저에서는 HLS 재생을 지원하지 않습니다. 다른 브라우저를 사용하거나 앱을 이용해주세요."
      );
    }

    return () => {
      // 정리: detach & destroy
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [playerOpen, playerUrl]);

  console.log(
    "[DetectionHistory] raw:",
    detectionListData.length,
    "filtered:",
    filteredDetections.length,
    "label:",
    labelFilter
  );

  // 심각도에 따른 상태 아이콘 및 스타일 반환
  const getSeverityIcon = (color: string) => {
    const icons = {
      red: "",
      yellow: "",
      green: "",
    };

    const bgColors = {
      red: "bg-red-100",
      yellow: "bg-yellow-100",
      green: "bg-green-100",
    };

    return (
      <div
        className={`flex items-center justify-center w-12 h-12 ${
          bgColors[color as keyof typeof bgColors]
        } rounded-full`}
      >
        <span className="text-xl">{icons[color as keyof typeof icons]}</span>
      </div>
    );
  };

  // 파손 유형 태그 렌더링
  const renderDamageTypes = (types: string[]) => {
    if (types.length === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-[600]">
          파손 없음
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {types.map((type, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-[600] bg-gray-100 text-gray-700`}
          >
            {type}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* 탐지 기록 리스트 컨테이너 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 테이블 헤더 (데스크톱용) */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-4 mb-6 p-4 bg-gray-50 rounded-xl font-[600] text-gray-700 text-sm">
          <div>상태</div>
          <div className="col-span-2">위치</div>
          <div>파손 유형</div>
          <div>탐지 시간</div>
        </div>

        {/* 탐지 기록 리스트 */}
        <div className="space-y-4">
          {pagedDetections.map((item: DetectionModel) => {
            // 실데이터(DetectionModel)에서 화면 표시값 파생
            const count = item.detections.length; // 탐지 건수
            const { status, color } = getStatusInfo(count); // 위험/주의/안전 + 색상
            const { date, time } = formatDateParts(item.date); // 표시용 날짜/시간
            const types = Array.from(
              new Set(item.detections.map((d) => d.label))
            ); // 중복 제거된 파손 유형 목록
            const cctvId = item.analyzeId ?? item.id; // 식별자 표기
            const location = item.cctvName; // 위치 텍스트는 cctvName 사용

            const cctvUrl: string | undefined = (item as any).cctvUrl; // API가 제공 시 사용 (.m3u8 HLS)
            const handleOpenCCTV = () => {
              if (!cctvUrl) {
                console.warn("[DetectionHistory] CCTV URL missing for", item);
                alert("CCTV URL이 없습니다. 관리자에게 문의해주세요.");
                return;
              }
              setPlayerUrl(cctvUrl);
              setPlayerOpen(true);
            };

            return (
              <div
                key={Number(item.id)}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
              >
                {/* 모바일 및 태블릿용 레이아웃 */}
                <div className="lg:hidden">
                  <div className="flex items-start mb-4">
                    {/* 메인 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-[700] text-gray-800 text-lg">
                          {location}
                        </h3>
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-[600] ${
                            color === "red"
                              ? "bg-red-100 text-red-700"
                              : color === "yellow"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="mb-3">{renderDamageTypes(types)}</div>

                      <div className="text-sm text-gray-600 mb-4">
                        <div>
                          탐지 시간: {date} {time}
                        </div>
                        <div>CCTV ID: {cctvId}</div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-[600] text-sm transition-colors"
                      onClick={handleOpenCCTV}
                      disabled={!cctvUrl}
                    >
                      CCTV 보기
                    </button>
                  </div>
                </div>

                {/* 데스크톱용 그리드 레이아웃 */}
                <div className="hidden lg:grid lg:grid-cols-6 gap-4 items-center">
                  {/* 상태 아이콘 */}
                  <div className="flex justify-center">
                    {getSeverityIcon(color)}
                  </div>

                  {/* 위치 정보 */}
                  <div className="col-span-2">
                    <div className="font-[700] text-gray-800 mb-1">
                      {location}
                    </div>
                    <div className="text-sm text-gray-600">
                      CCTV ID: {cctvId}
                    </div>
                  </div>

                  {/* 파손 유형 */}
                  <div>{renderDamageTypes(types)}</div>

                  {/* 탐지 시간 */}
                  <div className="text-sm text-gray-700">
                    <div className="font-[600]">{date}</div>
                    <div className="text-gray-600">{time}</div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2 justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors group"
                      onClick={handleOpenCCTV}
                      disabled={!cctvUrl}
                      aria-label="CCTV 보기"
                      title={
                        cctvUrl ? "새 창에서 CCTV 보기" : "CCTV URL이 없습니다"
                      }
                    >
                      <span className="text-sm">👩‍💻</span>
                      <div className="hidden group-hover:block absolute bg-gray-800 text-white text-xs py-1 px-2 rounded mt-1">
                        CCTV 보기
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 페이지네이션 컨트롤 */}
        {filteredDetections.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6 select-none">
            {pageNumbers.map((p, idx) =>
              typeof p === "number" ? (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1.5 text-sm rounded border ${
                    p === currentPage
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                  aria-current={p === currentPage ? "page" : undefined}
                >
                  {p}
                </button>
              ) : (
                <span key={idx} className="px-1 text-sm text-gray-400">
                  {p}
                </span>
              )
            )}
          </div>
        )}

        {/* 빈 상태 (데이터가 없을 때 표시) */}
        {filteredDetections.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-[700] text-gray-800 mb-2">
              탐지 기록이 없습니다
            </h3>
            <p className="text-gray-600">
              검색 조건을 변경하거나 다른 필터를 사용해보세요.
            </p>
          </div>
        )}

        {/* HLS 플레이어 모달 */}
        {playerOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60">
            <div className="bg-white w-[92vw] max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="font-[700] text-gray-800">CCTV 실시간 영상</h3>
                <button
                  onClick={() => {
                    setPlayerOpen(false);
                    setPlayerUrl(null);
                  }}
                  className="px-3 py-1 text-xs font-[600] rounded-md border border-gray-200 hover:bg-gray-100"
                >
                  X
                </button>
              </div>
              <div className="p-4">
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  playsInline
                  className="w-full rounded-lg bg-black"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
