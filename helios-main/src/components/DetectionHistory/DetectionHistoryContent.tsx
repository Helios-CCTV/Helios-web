import React from "react";

// 더미 데이터 - 실제 API 데이터로 대체될 예정
const detectionData = [
  {
    id: 1,
    location: "서울특별시 강남구 테헤란로 123",
    damageTypes: ["포트홀", "균열"],
    severity: "위험",
    severityColor: "red",
    detectedDate: "2025.08.06",
    detectedTime: "14:32",
    cctvId: "CCTV-GN-001",
    coordinates: { lat: 37.5066, lng: 127.0536 },
  },
  {
    id: 2,
    location: "경기도 성남시 분당구 정자동",
    damageTypes: ["침하"],
    severity: "주의",
    severityColor: "yellow",
    detectedDate: "2025.08.06",
    detectedTime: "13:15",
    cctvId: "CCTV-BD-042",
    coordinates: { lat: 37.3595, lng: 127.1052 },
  },
  {
    id: 3,
    location: "인천광역시 연수구 송도동",
    damageTypes: ["균열"],
    severity: "주의",
    severityColor: "yellow",
    detectedDate: "2025.08.06",
    detectedTime: "12:48",
    cctvId: "CCTV-SD-128",
    coordinates: { lat: 37.3894, lng: 126.6581 },
  },
  {
    id: 4,
    location: "서울특별시 서초구 반포대로",
    damageTypes: ["포트홀", "균열", "침하"],
    severity: "위험",
    severityColor: "red",
    detectedDate: "2025.08.06",
    detectedTime: "11:22",
    cctvId: "CCTV-SC-067",
    coordinates: { lat: 37.5147, lng: 127.0358 },
  },
  {
    id: 5,
    location: "경기도 고양시 일산동구",
    damageTypes: [],
    severity: "안전",
    severityColor: "green",
    detectedDate: "2025.08.06",
    detectedTime: "10:15",
    cctvId: "CCTV-IS-205",
    coordinates: { lat: 37.6544, lng: 126.7707 },
  },
  {
    id: 6,
    location: "부산광역시 해운대구 센텀시티",
    damageTypes: ["균열"],
    severity: "주의",
    severityColor: "yellow",
    detectedDate: "2025.08.05",
    detectedTime: "16:40",
    cctvId: "CCTV-CT-089",
    coordinates: { lat: 35.1693, lng: 129.1316 },
  },
];

export default function DetectionHistoryContent() {
  // 심각도에 따른 상태 아이콘 및 스타일 반환
  const getSeverityIcon = (severity: string, color: string) => {
    const icons = {
      red: "🚨",
      yellow: "⚠️",
      green: "✅",
    };

    const bgColors = {
      red: "bg-red-100",
      yellow: "bg-yellow-100",
      green: "bg-green-100",
    };

    const textColors = {
      red: "text-red-700",
      yellow: "text-yellow-700",
      green: "text-green-700",
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
          {detectionData.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
            >
              {/* 모바일 및 태블릿용 레이아웃 */}
              <div className="lg:hidden">
                <div className="flex items-start gap-4 mb-4">
                  {/* 상태 아이콘 */}
                  {getSeverityIcon(item.severity, item.severityColor)}

                  {/* 메인 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-[700] text-gray-800 text-lg">
                        {item.location}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-[600] ${
                          item.severityColor === "red"
                            ? "bg-red-100 text-red-700"
                            : item.severityColor === "yellow"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>

                    <div className="mb-3">
                      {renderDamageTypes(item.damageTypes)}
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <div>
                        탐지 시간: {item.detectedDate} {item.detectedTime}
                      </div>
                      <div>CCTV ID: {item.cctvId}</div>
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
                  {getSeverityIcon(item.severity, item.severityColor)}
                </div>

                {/* 위치 정보 */}
                <div className="col-span-2">
                  <div className="font-[700] text-gray-800 mb-1">
                    {item.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    CCTV ID: {item.cctvId}
                  </div>
                </div>

                {/* 파손 유형 */}
                <div>{renderDamageTypes(item.damageTypes)}</div>

                {/* 탐지 시간 */}
                <div className="text-sm text-gray-700">
                  <div className="font-[600]">{item.detectedDate}</div>
                  <div className="text-gray-600">{item.detectedTime}</div>
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
          ))}
        </div>

        {/* 빈 상태 (데이터가 없을 때 표시) */}
        {detectionData.length === 0 && (
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
