import { useState } from "react";

// 검색창 컴포넌트
export default function DetectionHistorySearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("latest");

  return (
    <>
      {/* 검색 및 필터 섹션 */}
      <div className="bg-white border-b border-gray-200 sticky top-[60px] z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* 상단 검색바와 필터 */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            {/* 검색창 */}
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="지역명, 도로명으로 검색하세요... (예: 강남구, 테헤란로)"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {/* 검색 버튼 */}
                {searchQuery && (
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-[600] transition-colors">
                    검색
                  </button>
                )}
              </div>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-[600] text-gray-700">정렬:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-[500] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="severity">심각도순</option>
                <option value="location">지역순</option>
              </select>
            </div>
          </div>

          {/* 필터 탭 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: "all", label: "전체", icon: "📊", color: "blue" },
              { key: "danger", label: "위험", icon: "🚨", color: "red" },
              { key: "warning", label: "주의", icon: "⚠️", color: "yellow" },
              { key: "safe", label: "안전", icon: "✅", color: "green" },
              { key: "pothole", label: "포트홀", icon: "🕳️", color: "orange" },
              { key: "crack", label: "균열", icon: "⚡", color: "purple" },
              { key: "subsidence", label: "침하", icon: "📉", color: "indigo" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-[600] transition-all whitespace-nowrap ${
                  selectedFilter === filter.key
                    ? `bg-${filter.color}-500 text-white shadow-md`
                    : `bg-${filter.color}-50 text-${filter.color}-700 hover:bg-${filter.color}-100 border border-${filter.color}-200`
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* 검색 결과 요약 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <span className="font-[600] text-gray-800">2,303</span>개의 탐지
                기록
              </span>
              <span>•</span>
              <span>
                마지막 업데이트:{" "}
                <span className="font-[600] text-gray-800">2분 전</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
