import React, { useState } from "react";

export default function RoadInsightPanel() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const roadData = [
    {
      id: 1,
      name: "영동 고속도로",
      location: "강남구 → 용인시",
      status: "위험",
      statusColor: "red",
      damageTypes: ["포트홀", "균열"],
      damageCount: 7,
      lastDetected: "방금 전",
      cctvCount: 3,
      distance: "2.1km",
    },
    {
      id: 2,
      name: "경부 고속도로",
      location: "서초구 → 성남시",
      status: "주의",
      statusColor: "yellow",
      damageTypes: ["침하", "균열"],
      damageCount: 3,
      lastDetected: "5분 전",
      cctvCount: 2,
      distance: "1.8km",
    },
    {
      id: 3,
      name: "강남대로",
      location: "강남구 역삼동",
      status: "안전",
      statusColor: "green",
      damageTypes: [],
      damageCount: 0,
      lastDetected: "1시간 전",
      cctvCount: 5,
      distance: "0.5km",
    },
    {
      id: 4,
      name: "테헤란로",
      location: "강남구 삼성동",
      status: "주의",
      statusColor: "yellow",
      damageTypes: ["균열"],
      damageCount: 2,
      lastDetected: "10분 전",
      cctvCount: 4,
      distance: "1.2km",
    },
  ];

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
      <div
        className="flex w-[315px] top-[60px] z-50 bg-gray-50 justify-center overflow-y-auto absolute border-r border-gray-200 shadow-sm"
        style={{
          height: "calc(100vh - 60px)",
          overflowY: "auto",
          position: "fixed",
        }}
      >
        <div className="flex flex-col w-full">
          {/* 헤더 */}
          <div className="bg-white px-4 py-6 border-b border-gray-200 sticky top-0 z-10">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              🛣️ 도로 현황
            </h2>

            {/* 검색바 */}
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <img
                  className="w-4 h-4 opacity-40"
                  src="src/assets/livePage/glasses.png"
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

            {/* 하단 요약 정보 */}
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

            {/* 필터 버튼 */}
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
                  src="src/assets/livePage/danger.png"
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
                  src="src/assets/livePage/warning.png"
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
                  src="src/assets/livePage/normal.png"
                  alt="안전"
                />
                안전
              </button>
            </div>
          </div>

          {/* 도로 목록 */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">
                총 {filteredRoads.length}개 도로
              </span>
              <span className="text-xs text-gray-400">
                마지막 업데이트: 방금 전
              </span>
            </div>

            <div className="space-y-3">
              {filteredRoads.map((road) => (
                <div
                  key={road.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all cursor-pointer hover:border-blue-200"
                  onClick={() => alert(`${road.name} 상세 정보를 표시합니다.`)}
                >
                  {/* 도로명과 상태 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">
                        {road.name}
                      </h3>
                      <p className="text-xs text-gray-500">{road.location}</p>
                    </div>
                    {getStatusBadge(road.status, road.statusColor)}
                  </div>

                  {/* 파손 정보 */}
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

                  {/* 추가 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>📹 CCTV {road.cctvCount}대</span>
                      <span>📍 {road.distance}</span>
                    </div>
                    <button className="text-blue-500 hover:text-blue-600 font-medium">
                      상세보기 →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredRoads.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-500 text-sm">검색 결과가 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
