// RoadInsightPanel: 좌측 사이드 패널에서 도로 목록을 필터/검색하고,
// 항목을 클릭하면 우측의 DetailPanel을 열어 상세 정보를 보여주는 컴포넌트

// React 필요 import
import { useState, useMemo, useEffect } from "react";
// import DetailPanel from "./DetailPanel";
import { useDetailPanelStore } from "../../stores/detailPanelStore";
import { useQuery } from "@tanstack/react-query";

// 타입, API import
import type { CCTVData } from "../../API/cctvAPI";
import type { AnalyzeModel } from "../../API/Analyze";
import { fetchAnalyzeData } from "../../API/Analyze";
// CCTV 검색 API (Search.ts)
import { fetchSearchData } from "../../API/Search";

// 부모에게 전달할 props
type Props = {
  cctvData: CCTVData[]; // 뷰포트 내의 CCTV 데이터
  mapLevel: number; // 지도 줌 레벨
  onFocusCCTV?: (c: CCTVData) => void; // 이거 버그 걸려서 못고치는중
};

// RoadInsightPanel과 DetailPanel의 값이 서로 다름
// 해당 버그 수정이 필요함, 우선적으로 문제가 있지 않아 내비둠

export default function RoadInsightPanel({
  cctvData,
  mapLevel,
  onFocusCCTV, // 버그 걸림
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState("all"); // 선택한 필터 상태
  const [searchQuery, setSearchQuery] = useState(""); // 검색어의 상태

  // 검색어가 있을 때만 서버 검색 실행 (Search.ts의 fetchSearchData 테스트 목적)
  const cctvSearchQuery = useQuery({
    queryKey: ["cctvSearch", searchQuery], // 검색어가 바뀔때 실행
    queryFn: () => fetchSearchData({ query: searchQuery }), // 검색 API 호출
    enabled: searchQuery.trim().length > 0, // 검색어가 있을 때만 실행
    staleTime: 30 * 1000, // 캐시 유지
  });

  // 분석 데이터 조회 (서버 데이터 → AnalyzeModel[])
  const analyzeListQuery = useQuery({
    queryKey: ["analyzeList"], // 키
    queryFn: fetchAnalyzeData, // API 호출
    staleTime: 60 * 1000,
    select: (raw: any): AnalyzeModel[] => {
      return Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];
    },
  });

  // 서버에서 받은 AnalyzeModel[]
  const raw = analyzeListQuery.data as any;
  const analyzeList: AnalyzeModel[] = Array.isArray(raw?.data)
    ? (raw.data as AnalyzeModel[])
    : Array.isArray(raw)
    ? (raw as AnalyzeModel[])
    : [];

  const analyzeMap = useMemo(() => {
    const m = new Map<number, AnalyzeModel>(); // id값을 이용해 analyze 데이터를 빠르게 찾기 위한 매핑
    for (const a of analyzeList) m.set(a.id, a);
    return m;
  }, [analyzeList]);

  // 유틸: CCTV 이름 → 도로 타입/지역명 파싱
  const parseName = (full: string) => {
    //도로 타입 / 지역명 파싱
    const roadMatch = full.match(/\[(.*?)\]/);
    const roadType = roadMatch ? roadMatch[1] : "일반도로";
    const location = full.replace(/\[.*?\]\s*/, "").trim();
    return { roadType, location };
  };

  // 유틸: 건수 → 상태/색상 매핑
  const getStatusInfo = (count: number) => {
    if (count >= 2) return { status: "위험" as const, color: "red" as const };
    if (count >= 1)
      return { status: "주의" as const, color: "yellow" as const };
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

    // 각 CCTV에 대해 분석 데이터 조인 + 도로명/위치 파싱 + 상태 계산
    return (cctvData ?? []).map((c) => {
      const { roadType, location } = parseName(c.cctvname);
      const a = analyzeMap.get(c.id);

      const damageCount = a ? a.detections.length : 0;
      const damageTypes = a
        ? Array.from(new Set(a.detections.map((d) => d.label)))
        : [];
      const { status, color } = getStatusInfo(damageCount);

      return {
        id: c.id,
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

  // 검색 API 결과 아이템을 그대로 DetailPanel에 쓸 수 있도록 CCTVData로 구성
  // - 재호출 없이 즉시 상세 패널을 열기 위함
  const buildRowFromSearchItem = (item: any) => {
    const id = Number(item.id);
    const cctvname: string = item.cctvName ?? item.cctvname ?? "";
    const { roadType, location } = parseName(cctvname);

    // 분석 데이터 조인 (id 기반)
    const a = analyzeMap.get(id);
    const damageCount = a ? a.detections.length : 0;
    const damageTypes = a
      ? Array.from(new Set(a.detections.map((d: any) => d.label)))
      : [];
    const { status, color } = getStatusInfo(damageCount);

    // 검색 응답을 DetailPanel에서 바로 사용할 수 있는 형태로 매핑
    const cctvDataFromSearch: CCTVData = {
      id,
      cctvname,
      cctvurl: item.cctvUrl ?? item.cctvurl ?? "",
      cctvformat: item.cctvFormat ?? item.cctvformat ?? "",
      coordx: item.coordx ?? "",
      coordy: item.coordy ?? "",
      cctvtype: item.cctvtype ?? "",
      cctvresolution: item.cctvresolution ?? "",
      roadsectionid: item.roadsectionid ?? "",
      cctvurl_pre: item.cctvurl_pre ?? null,
      filecreatetime: item.filecreatetime ?? "",
    } as CCTVData;

    return {
      id, // 리스트 key로도 안전하게 사용
      name: roadType,
      location,
      status,
      statusColor: color,
      damageTypes,
      damageCount,
      lastDetected: getLastDetectedText(a?.date),
      cctvData: cctvDataFromSearch, // ✅ 검색에서도 즉시 상세보기 가능
      _raw: a,
    };
  };

  // 검색어가 있을 땐 서버 검색 결과를 우선 사용하여 목록을 구성
  const effectiveRows = useMemo(() => {
    const q = searchQuery.trim();
    if (q.length === 0) return rows;
    const data = (cctvSearchQuery.data ?? []) as any[];
    if (!data || data.length === 0) return [];
    // Search.ts는 가공된 모델에 id와 cctvName을 포함한다고 가정
    return data
      .filter((item) => item && (item.id ?? null) !== null)
      .map((item) => buildRowFromSearchItem(item));
  }, [rows, cctvSearchQuery.data, searchQuery]);

  // 목록 아이템 클릭 시: 전역 DetailPanel 스토어를 사용해 열거나(처음), 교체(이미 열림)합니다.
  const openDetail = useDetailPanelStore((s) => s.open);
  const replaceDetail = useDetailPanelStore((s) => s.replace);
  const isDetailOpen = useDetailPanelStore((s) => s.isOpen);

  const handleRoadClick = (road: any) => {
    const data: CCTVData | undefined = road?.cctvData;
    if (!data) return;

    // 지도 포커스 요청은 그대로 유지(옵션)
    onFocusCCTV?.(data);

    // 패널 열기/교체
    if (isDetailOpen) {
      replaceDetail(data);
    } else {
      openDetail(data);
    }
  };

  // 화면에 표시할 목록을 계산
  // 1) 상태 필터 조건(selectedFilter)
  // 2) 검색어 포함 여부(도로명 또는 위치에 searchQuery가 포함되는지)
  // 두 조건을 모두 만족하는 항목만 남김
  const filteredRoads = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return effectiveRows.filter((road) => {
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
  }, [effectiveRows, selectedFilter, searchQuery]);

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

  const pageNumbers = useMemo(
    () => getPageNumbers(totalPages, currentPage),
    [totalPages, currentPage]
  );

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
      <div
        className="hidden md:flex w-[315px] top-[60px] z-50 bg-gray-50 justify-center overflow-y-auto absolute border-r border-gray-200 shadow-sm"
        style={{
          height: "calc(100vh - 60px)",
          overflowY: "auto",
          position: "fixed",
        }}
      >
        <div className="flex items-center justify-center w-full text-sm text-gray-500">
          분석 데이터를 불러오는 중…
        </div>
      </div>
    );
  }
  if (analyzeListQuery.isError) {
    return (
      <div
        className="hidden md:flex w-[315px] top-[60px] z-50 bg-gray-50 justify-center overflow-y-auto absolute border-r border-gray-200 shadow-sm"
        style={{
          height: "calc(100vh - 60px)",
          overflowY: "auto",
          position: "fixed",
        }}
      >
        <div className="flex items-center justify-center w-full text-sm text-red-600">
          분석 데이터를 불러오지 못했습니다
        </div>
      </div>
    );
  }

  // 검색 로딩/결과 없음 표시 (검색 중일 때만)
  const isSearching = searchQuery.trim().length > 0;
  const searchLoading = isSearching && cctvSearchQuery.isLoading;
  const searchErrored = isSearching && cctvSearchQuery.isError;

  // - 검색어가 없으면 뷰포트 기반 rows
  // - 검색어가 있으면 검색 결과 기반 effectiveRows
  const countSource = isSearching ? effectiveRows : rows;

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
              {isSearching && (
                <div className="mt-2 text-xs text-gray-500">
                  {searchLoading && "검색 중…"}
                  {searchErrored && "검색 실패: 잠시 후 다시 시도하세요"}
                  {!searchLoading &&
                    !searchErrored &&
                    filteredRoads.length === 0 &&
                    "검색 결과가 없습니다"}
                </div>
              )}
            </div>

            {/* 요약 카드: rows/검색 결과에서 상태별 개수를 실시간 계산하여 표시 */}
            <div className="mt-auto bg-white pb-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-600">
                    {countSource.filter((r) => r.status === "위험").length}
                  </div>
                  <div className="text-xs text-red-600">위험</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-600">
                    {countSource.filter((r) => r.status === "주의").length}
                  </div>
                  <div className="text-xs text-yellow-600">주의</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">
                    {countSource.filter((r) => r.status === "안전").length}
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
                    <span key={idx} className="px-1 text-xs text-gray-400">
                      {p}
                    </span>
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
    </>
  );
}
