// RoadInsightPanel: 좌측 사이드 패널에서 도로 목록을 필터/검색하고,
// 항목을 클릭하면 우측의 DetailPanel을 열어 상세 정보를 보여주는 컴포넌트
import { useState, useMemo } from "react";
import DetailPanel from "./DetailPanel";
import type { CCTVData } from "../../API/cctvAPI";

// 현재 선택된 상태 필터(전체/위험/주의/안전)
// 검색어(실시간 입력값)

type Props = { cctvData: CCTVData[] };

// CCTV 데이터를 기반으로 한 도로 정보 타입
interface RoadInfo {
  id: number;
  name: string;
  location: string;
  status: "위험" | "주의" | "안전";
  statusColor: "red" | "yellow" | "green";
  damageTypes: string[];
  damageCount: number;
  lastDetected: string;
  cctvCount: number;
  distance: string;
  cctvData: CCTVData; // 원본 CCTV 데이터 참조
}

export default function RoadInsightPanel({ cctvData }: Props) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // cctvData를 기반으로 도로 정보 생성
  // 각 CCTV의 cctvname을 도로명으로 사용하고, 임의로 상태를 부여
  const roadData = useMemo((): RoadInfo[] => {
    return cctvData.map((cctv, index) => {
      // CCTV 이름에서 대괄호 안의 내용 추출 (예: "[국도1호선] 파주 봉일천4리" -> "국도1호선")
      const roadMatch = cctv.cctvname.match(/\[(.*?)\]/);
      const roadType = roadMatch ? roadMatch[1] : "일반도로";

      // 지역명 추출 (CCTV 이름에서 마지막 부분)
      const locationParts = cctv.cctvname.replace(/\[.*?\]\s*/, "").trim();

      // 인덱스 기반으로 임시 상태 할당 (실제로는 서버에서 받아온 데이터 사용)
      const statusOptions: Array<{
        status: "위험" | "주의" | "안전";
        color: "red" | "yellow" | "green";
      }> = [
        { status: "안전", color: "green" },
        { status: "주의", color: "yellow" },
        { status: "위험", color: "red" },
      ];
      const statusInfo = statusOptions[index % 3];

      // 상태에 따른 가상의 손상 정보 생성
      let damageTypes: string[] = [];
      let damageCount = 0;

      if (statusInfo.status === "위험") {
        damageTypes = ["포트홀", "균열"];
        damageCount = Math.floor(Math.random() * 5) + 3; // 3-7개
      } else if (statusInfo.status === "주의") {
        damageTypes = ["균열"];
        damageCount = Math.floor(Math.random() * 3) + 1; // 1-3개
      }

      return {
        id: index + 1,
        name: roadType,
        location: locationParts,
        status: statusInfo.status,
        statusColor: statusInfo.color,
        damageTypes,
        damageCount,
        lastDetected:
          index < 2 ? "방금 전" : `${Math.floor(Math.random() * 30) + 1}분 전`,
        cctvCount: 1, // 현재는 CCTV 1대당 1개 도로로 표시
        distance: `${(Math.random() * 3 + 0.5).toFixed(1)}km`,
        cctvData: cctv,
      };
    });
  }, [cctvData]);

  // 사용자가 클릭한 CCTV 정보를 보관하는 상태
  // 상세 패널(DetailPanel) 열림/닫힘 상태
  const [selectedCCTV, setSelectedCCTV] = useState<CCTVData | null>(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  // 목록 아이템 클릭 시: 해당 도로를 선택하고 상세 패널을 연다
  const handleRoadClick = (road: RoadInfo) => {
    // RoadInfo에서 원본 CCTVData를 추출하여 DetailPanel에 전달
    setSelectedCCTV(road.cctvData);
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
  const filteredRoads = roadData.filter((road) => {
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "danger" && road.status === "위험") ||
      (selectedFilter === "warning" && road.status === "주의") ||
      (selectedFilter === "safe" && road.status === "안전");

    const matchesSearch =
      road.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      road.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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

  return (
    <>
      {/*
        사이드 패널 래퍼
        - position: fixed + top 오프셋(배너 높이)을 적용하여 화면 좌측에 고정
        - height: calc(100vh - 60px) 으로 세로 높이를 배너를 제외한 영역으로 제한
        - overflow-y: auto 로 패널 내부만 스크롤되게 함
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

            {/* 요약 카드: roadData에서 상태별 개수를 실시간 계산하여 표시 */}
            <div className="mt-auto bg-white pb-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-red-600">
                    {roadData.filter((r) => r.status === "위험").length}
                  </div>
                  <div className="text-xs text-red-600">위험</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-yellow-600">
                    {roadData.filter((r) => r.status === "주의").length}
                  </div>
                  <div className="text-xs text-yellow-600">주의</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">
                    {roadData.filter((r) => r.status === "안전").length}
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
              {filteredRoads.map((road) => (
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
