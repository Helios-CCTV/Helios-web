// RoadInsightPanel: 좌측 사이드 패널에서 도로 목록을 필터/검색하고,
// 항목을 클릭하면 우측의 DetailPanel을 열어 상세 정보를 보여주는 컴포넌트

// React 필요 import
import { useState, useMemo, useEffect } from "react";
import DetailPanel from "./DetailPanel";
import { useQuery } from "@tanstack/react-query";

// 타입, API import
import type { CCTVData } from "../../API/cctvAPI";
import type { AnalyzeModel } from "../../API/Analyze";
import { fetchAnalyzeData } from "../../API/Analyze";

// 현재 선택된 상태 필터(전체/위험/주의/안전)
// 검색어(실시간 입력값)

type Props = { cctvData: CCTVData[]; mapLevel: number };


export default function RoadInsightPanel({ cctvData, mapLevel }: Props) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  // 분석 데이터 조회 (서버 데이터 → AnalyzeModel[])
  const analyzeListQuery = useQuery({
    queryKey: ["analyzeList"],
    queryFn: fetchAnalyzeData,
    staleTime: 60 * 1000,
  });

  // 서버에서 받은 AnalyzeModel[]
  const analyzeList = analyzeListQuery.data ?? [];

  // 분석 데이터를 빠르게 조회하기 위한 맵 (키: 정규화된 cctvName)
  const normalize = (s: string) => (s ?? "").replace(/\s+/g, "").replace(/[()]/g, "").trim();
  const analyzeMap = useMemo(() => {
    const m = new Map<string, AnalyzeModel>();
    for (const a of analyzeList) m.set(normalize(a.cctvName), a);
    return m;
  }, [analyzeList]);


  // 유틸: CCTV 이름 → 도로 타입/지역명 파싱
  const parseName = (full: string) => {
    const roadMatch = full.match(/\[(.*?)\]/);
    const roadType = roadMatch ? roadMatch[1] : "일반도로";
    const location = full.replace(/\[.*?\]\s*/, "").trim();
    return { roadType, location };
  };

  // 유틸: 건수 → 상태/색상 매핑
  const getStatusInfo = (count: number) => {
    if (count >= 2) return { status: "위험" as const, color: "red" as const };
    if (count >= 1) return { status: "주의" as const, color: "yellow" as const };
    return { status: "안전" as const, color: "green" as const };
  };

  // 유틸: 최근 탐지 시각 표시(간단 상대표현)
  const getLastDetectedText = (date?: Date) => {
    if (!date) return "-";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.max(0, Math.floor(diffMs / 60000));
    if (diffMin <= 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}시간 전`;
  };

  // 뷰포트에 보이는 마커(cctvData)를 기준으로 목록 생성 + 분석 정보 조인
  const rows = useMemo(() => {
    // mapLevel 비교 안전화(문자/undefined 방어). 너무 멀리서 보면 목록 비움
    const level = Number(mapLevel ?? 99);
    if (!Number.isFinite(level) || level > 8) return [];

    return (cctvData ?? []).map((c) => {
      const { roadType, location } = parseName(c.cctvname);
      const a = analyzeMap.get(normalize(c.cctvname));

      const damageCount = a ? a.detections.length : 0;
      const damageTypes = a ? Array.from(new Set(a.detections.map((d) => d.label))) : [];
      const { status, color } = getStatusInfo(damageCount);

      return {
        id: (c as any).roadsectionid ?? c.cctvname,
        name: roadType,
        location,
        status,
        statusColor: color,
        damageTypes,
        damageCount,
        lastDetected: getLastDetectedText(a?.date),
        cctvData: c,
        _raw: a,
      };
    });
  }, [cctvData, analyzeMap, mapLevel]);

  // 사용자가 클릭한 CCTV 정보를 보관하는 상태
  // 상세 패널(DetailPanel) 열림/닫힘 상태
  const [selectedCCTV, setSelectedCCTV] = useState<CCTVData | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  // 목록 아이템 클릭 시: 해당 도로를 선택하고 상세 패널을 연다
  const handleRoadClick = (road: any) => {
    // 매핑된 항목에서 원본 CCTVData를 추출하여 DetailPanel에 전달
    if (road?.cctvData) setSelectedCCTV(road.cctvData);
    setIsDetailPanelOpen(true);
  };

  // 상세 패널 닫기: 패널을 닫고 선택된 CCTV 상태를 초기화
  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false);
    setSelectedCCTV(null);
  };

  // 화면에 표시할 목록을 계산
  // 1) 상태 필터 조건(selectedFilter)
  // 2) 검색어 포함 여부(도로명 또는 위치에 searchQuery가 포함되는지)
  // 두 조건을 모두 만족하는 항목만 남김
  const filteredRoads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return rows.filter((road) => {
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "danger" && road.status === "위험") ||
        (selectedFilter === "warning" && road.status === "주의") ||
        (selectedFilter === "safe" && road.status === "안전");

      const matchesSearch =
        road.name.toLowerCase().includes(q) ||
        road.location.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [rows, selectedFilter, searchQuery]);

  // -------------------------------------------------
  // 간단 페이지네이션 (숫자 버튼, 페이지 이동)
  //   현재 페이지에 해당하는 10개의 파손정보만 보여줍니다.
  // -------------------------------------------------
  
  // 현재 페이지에 대한 상태
  const [currentPage, setCurrentPage] = useState(1);
  
  // 한 페이지에 보여질 숫자
  const PER_PAGE = 10;

  // 필터/검색/데이터가 바뀌면 1페이지로 초기화
  /**
   * rows : 뷰포트 cctv
   * selectedFilter : 위험 상태
   * searchQuery : 검색어
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [rows, selectedFilter, searchQuery]);

  // 전체 페이지 계산
  const totalPages = Math.max(1, Math.ceil(filteredRoads.length / PER_PAGE));

  // 현재 페이지가 총 페이지를 초과하는 경우
  // if : 3페이지에 있을 때 필터링 결과가 2 페이지로 바뀔 때 자동으로 1페이지로 이동
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // 현재 페이지 아이템 (10개)
  const pagedRoads = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredRoads.slice(start, start + PER_PAGE);
  }, [filteredRoads, currentPage]);

  // 하단 숫자 버튼에 사용할 페이지 배열 (단순/가독성 위주)
  // - 전체 페이지가 10 이하: 1..totalPages 모두 노출
  // - 11개 이상일 경우 ...으로 표기
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

  const pageNumbers = useMemo(() => getPageNumbers(totalPages, currentPage), [totalPages, currentPage]);

  // 상태 뱃지 렌더링 유틸: 상태값과 색상 키에 따라 Tailwind 클래스를 매핑
  const getStatusBadge = (status: string, color: string) => {
    const colors = {
      red: "bg-red-100 text-red-700 border-red-200",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
      green: "bg-green-100 text-green-700 border-green-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold border ${
          colors[color as keyof typeof colors]
        }`}
      >
        {status}
      </span>
    );
  };

  if (analyzeListQuery.isLoading) {
    return (
      <div className="hidden md:flex w-[315px] top-[60px] z-50 bg-gray-50 justify-center overflow-y-auto absolute border-r border-gray-200 shadow-sm" style={{ height: "calc(100vh - 60px)", overflowY: "auto", position: "fixed" }}>
        <div className="flex items-center justify-center w-full text-sm text-gray-500">분석 데이터를 불러오는 중…</div>
      </div>
    );
  }
  if (analyzeListQuery.isError) {
    return (
      <div className="hidden md:flex w-[315px] top-[60px] z-50 bg-gray-50 justify-center overflow-y-auto absolute border-r border-gray-200 shadow-sm" style={{ height: "calc(100vh - 60px)", overflowY: "auto", position: "fixed" }}>
        <div className="flex items-center justify-center w-full text-sm text-red-600">분석 데이터를 불러오지 못했습니다</div>
      </div>
    );
  }

  return (
    <>
      {/*
        사이드 패널 rapper
      */}
      <div
        className="hidden md:flex w-[315px] top-[60px] z-50 bg-gray-50 justify-center overflow-y-auto absolute border-r border-gray-200 shadow-sm"
        style={{
          height: "calc(100vh - 60px)",
          overflowY: "auto",
          position: "fixed",
        }}
      >
        <div className="flex flex-col w-full">
          {/* 상단 헤더: 제목, 검색바, 요약 카드, 상태 필터 버튼들을 포함 */}
          <div className="bg-white px-4 py-6 border-b border-gray-200 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4">도로 현황</h2>

            {/* 검색바: 입력 시 setSearchQuery 로 상태가 갱신되고, 아래 filteredRoads 재계산 */}
            <div className="relative mb-4 hidden md:flex">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <img
                  className="w-4.5 h-5 opacity-80"
                  src="/assets/livePage/glasses.png"
                  alt="검색"
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="도로명, 지역 검색..."
              />
            </div>

            {/* 요약 카드: rows에서 상태별 개수를 실시간 계산하여 표시 */}
            <div className="mt-auto bg-white pb-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-600">
                    {rows.filter((r) => r.status === "위험").length}
                  </div>
                  <div className="text-xs text-red-600">위험</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-600">
                    {rows.filter((r) => r.status === "주의").length}
                  </div>
                  <div className="text-xs text-yellow-600">주의</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">
                    {rows.filter((r) => r.status === "안전").length}
                  </div>
                  <div className="text-xs text-green-600">안전</div>
                </div>
              </div>
            </div>

            {/* 상태 필터 버튼: selectedFilter 값을 변경하여 목록을 즉시 필터링 */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFilter("all")}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setSelectedFilter("danger")}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "danger"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <img
                  className="w-3 h-3"
                  src="/assets/livePage/danger.png"
                  alt="위험"
                />
                위험
              </button>
              <button
                onClick={() => setSelectedFilter("warning")}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "warning"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <img
                  className="w-3 h-3"
                  src="/assets/livePage/warning.png"
                  alt="주의"
                />
                주의
              </button>
              <button
                onClick={() => setSelectedFilter("safe")}
                className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  selectedFilter === "safe"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <img
                  className="w-3 h-3"
                  src="/assets/livePage/normal.png"
                  alt="안전"
                />
                안전
              </button>
            </div>
          </div>

          {/* 목록 상단 정보행: 현재 필터/검색 결과의 총 개수와 업데이트 시각 */}
          <div className="px-4 py-2 hidden md:table-row">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                총 {filteredRoads.length}개 도로
              </span>
              <span className="text-xs text-gray-400">
                마지막 업데이트: 방금 전
              </span>
            </div>

            {/* 필터/검색 결과 목록 렌더링: 각 카드 클릭 시 handleRoadClick 호출 */}
            <div className="space-y-3">
              {pagedRoads.map((road) => (
                <div
                  key={road.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-blue-200"
                  onClick={() => handleRoadClick(road)}
                >
                  {/* 도로명/위치 + 상태 뱃지 영역 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        {road.name}
                      </h3>
                      <p className="text-xs text-gray-500">{road.location}</p>
                    </div>
                    {getStatusBadge(road.status, road.statusColor)}
                  </div>

                  {/* 파손 정보: 파손 건수가 있으면 상세 태그와 함께 표시, 없으면 '파손 없음' */}
                  {road.damageCount > 0 ? (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-700">
                          파손 {road.damageCount}건
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {road.lastDetected}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {road.damageTypes.map((type, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <span className="text-xs text-green-600 font-medium">
                        ✅ 파손 없음
                      </span>
                    </div>
                  )}

                  {/* 추가 메타 정보 + 상세보기 버튼(UX 요소) */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <button className="text-blue-500 hover:text-blue-600 font-medium">
                      상세보기 →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 페이지네이션: 하단 숫자 버튼 + 이전/다음 */}
            {filteredRoads.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-4 select-none mb-4">
                

                {pageNumbers.map((p, idx) =>
                  typeof p === "number" ? (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(p)}
                      className={`px-2.5 py-1.5 text-xs rounded border ${
                        p === currentPage
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ) : (
                    <span key={idx} className="px-1 text-xs text-gray-400">{p}</span>
                  )
                )}

              </div>
            )}

            {/* 검색/필터 결과가 없을 때의 빈 상태(Empty State) */}
            {filteredRoads.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-500 text-sm">
                  {cctvData.length === 0
                    ? "현재 지도 영역에 CCTV가 없습니다"
                    : "검색 결과가 없습니다"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DetailPanel: CCTV 선택 시에만 우측에서 오버레이로 표시됨 */}
      {isDetailPanelOpen && selectedCCTV && (
        <>
          <DetailPanel
            selectedcctv={selectedCCTV}
            onClose={handleCloseDetailPanel}
          />
        </>
      )}
    </>
  );
}
