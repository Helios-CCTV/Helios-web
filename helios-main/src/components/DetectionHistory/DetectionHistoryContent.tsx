// import React
import { useQuery } from "@tanstack/react-query";

// import API
import { fetchDetectionData } from "../../API/Detection";
import type { DetectionModel } from "../../API/Detection";

export default function DetectionHistoryContent() {
  const DetectionListQuery = useQuery({
    queryKey: ["detectionList"],
    queryFn: fetchDetectionData,
    staleTime: 60 * 1000,
  });

  const detectionListData = DetectionListQuery.data || [];

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

  console.log(" Detection List Data : ", detectionListData);

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

    const typeColors = {
      포트홀: "bg-red-100 text-red-700",
      균열: "bg-orange-100 text-orange-700",
      침하: "bg-purple-100 text-purple-700",
    };

    return (
      <div className="flex flex-wrap gap-1">
        {types.map((type, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-[600] ${
              typeColors[type as keyof typeof typeColors] ||
              "bg-gray-100 text-gray-700"
            }`}
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
          {detectionListData.map((item: DetectionModel) => {
            // 실데이터(DetectionModel)에서 화면 표시값 파생
            const count = item.detections.length; // 탐지 건수
            const { status, color } = getStatusInfo(count); // 위험/주의/안전 + 색상
            const { date, time } = formatDateParts(item.date); // 표시용 날짜/시간
            const types = Array.from(
              new Set(item.detections.map((d) => d.label))
            ); // 중복 제거된 유형
            const cctvId = item.analyzeId ?? item.id; // 식별자 표기
            const location = item.cctvName; // 위치 텍스트는 cctvName 사용

            return (
              <div
                key={item.id}
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
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-[600] text-sm transition-colors">
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
                    <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors group">
                      <span className="text-sm">▶️</span>
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

        {/* 빈 상태 (데이터가 없을 때 표시) */}
        {detectionListData.length === 0 && (
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
      </div>
    </>
  );
}
