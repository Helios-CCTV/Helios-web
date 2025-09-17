//import React
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// import API
import { fetchDetectionData } from "../../API/Detection";
import type { DetectionModel } from "../../API/Detection";

// 부모로 "선택한 파손 라벨"을 전달하기 위한 props 타입
type Props = {
  // 필터 탭을 눌렀을 때 호출됩니다. 선택 해제는 null로 전달하세요.
  onFilterLabelChange?: (label: string | null) => void;
};

// 검색창 컴포넌트
export default function DetectionHistorySearchBar({
  onFilterLabelChange,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedSort, setSelectedSort] = useState("latest");

  const DetectionListQuery = useQuery({
    queryKey: ["detectionList"],
    queryFn: fetchDetectionData,
    staleTime: 60 * 1000,
  });

  const detectionListData = DetectionListQuery.data || [];

  // 필터 탭 정의 (key는 내부 식별자, label은 실제 파손명 - 컨텐츠로 넘길 값)
  const FILTERS = [
    { key: "crack2", label: "반사균열", color: "blue" },
    { key: "crack3", label: "세로방향균열", color: "red" },
    { key: "crack4", label: "밀림균열", color: "yellow" },
    { key: "rutting", label: "러팅", color: "green" },
    { key: "shoving", label: "코루게이션및쇼빙", color: "orange" },
    { key: "hammol", label: "함몰", color: "blue" },
    { key: "pothole", label: "포트홀", color: "green" },
    { key: "label", label: "라벨링", color: "yellow" },
    { key: "bakli", label: "박리", color: "blue" },
    { key: "danbu", label: "단부균열", color: "red" },
    { key: "sigong", label: "시공균열", color: "yellow" },
    { key: "turtleback", label: "거북등", color: "orange" },
  ] as const;

  // 탭 클릭 핸들러: 선택 상태를 업데이트하고, 부모에 "라벨"을 전달
  const handleFilterClick = (key: string) => {
    // 같은 버튼을 다시 누르면 선택 해제 (전체 보기)
    if (selectedFilter === key) {
      setSelectedFilter("all");
      onFilterLabelChange?.(null);
      return;
    }
    // 새 선택 적용
    setSelectedFilter(key);
    const found = FILTERS.find((f) => f.key === key);
    onFilterLabelChange?.(found ? found.label : null);
  };

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
            {/* 전체(해제) 버튼 */}
            <button
              onClick={() => { setSelectedFilter("all"); onFilterLabelChange?.(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-[600] transition-all whitespace-nowrap ${
                selectedFilter === "all"
                  ? "bg-gray-800 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
              aria-pressed={selectedFilter === "all"}
              aria-label="전체 필터 해제"
            >
              <span>전체</span>
            </button>
            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterClick(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-[600] transition-all whitespace-nowrap ${
                  selectedFilter === filter.key
                    ? `bg-${filter.color}-500 text-white shadow-md`
                    : `bg-${filter.color}-50 text-${filter.color}-700 hover:bg-${filter.color}-100 border border-${filter.color}-200`
                }`}
                aria-pressed={selectedFilter === filter.key}
                aria-label={`${filter.label} 필터`}
              >
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          {/* 검색 결과 요약 */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <span className="font-[600] text-gray-800">
                  {detectionListData.length}
                </span>
                개의 탐지 기록
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
