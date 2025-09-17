import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetectionData } from "../../API/Detection";
import type { DetectionModel } from "../../API/Detection";
export default function HistoryPageSlogan() {
  // ---------------------------------------------
  // 실데이터 로딩 (DetectionModel[])
  // ---------------------------------------------
  const { data: detections = [] } = useQuery<DetectionModel[]>({
    queryKey: ["detectionList"],
    queryFn: fetchDetectionData,
    staleTime: 60 * 1000,
  });

  // 유틸: 건수 → 상태 매핑 (팀 정책)
  const getStatusInfo = (count: number) => {
    if (count >= 2) return { status: "위험" as const, color: "red" as const };
    if (count >= 1) return { status: "주의" as const, color: "yellow" as const };
    return { status: "안전" as const, color: "green" as const };
  };

  // 위험/주의 구간 집계 (각 CCTV 별 탐지 건수 기반)
  const dangerCount = useMemo(
    () => detections.filter((d) => getStatusInfo(d.detections.length).status === "위험").length,
    [detections]
  );
  const warningCount = useMemo(
    () => detections.filter((d) => getStatusInfo(d.detections.length).status === "주의").length,
    [detections]
  );

  // 마지막 업데이트: 가장 최근 date (동일 일시 스펙 → 그대로 최대값 사용)
  const lastUpdatedLabel = useMemo(() => {
    if (detections.length === 0) return "-";
    const maxDate = detections.reduce((acc, cur) => (cur.date > acc ? cur.date : acc), detections[0].date);
    // 오늘 여부 판단 후 라벨 결정
    const now = new Date();
    const isSameYMD =
      now.getFullYear() === maxDate.getFullYear() &&
      now.getMonth() === maxDate.getMonth() &&
      now.getDate() === maxDate.getDate();
    if (isSameYMD) return "오늘";
    const yyyy = maxDate.getFullYear();
    const mm = String(maxDate.getMonth() + 1).padStart(2, "0");
    const dd = String(maxDate.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  }, [detections]);

  return (
    <>
      {/* 페이지 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 mt-20">
          {/* 메인 타이틀 */}
          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-[900] text-3xl lg:text-4xl text-gray-800">
              최근 파손 정보를{" "}
              <span className="block sm:inline">한번에 확인해요.</span>
            </h1>
          </div>

          {/* 서브 타이틀 */}
          <p className="text-lg text-gray-600 font-[500] leading-relaxed max-w-3xl">
            AI가 실시간으로 탐지한 도로 파손 정보를
            <span className="block sm:inline">
              지역별, 유형별로 확인하고{" "}
              <span className="inline text-blue-600 font-[700]">
                {" "}
                상세한 분석 결과
              </span>
              를 <span className="block sm:inline">살펴보세요.</span>
            </span>
          </p>

          {/* 통계 정보 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xl font-[700] text-red-600">{dangerCount}</div>
                  <div className="text-sm text-gray-600">위험 구간</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xl font-[700] text-yellow-600">{warningCount}</div>
                  <div className="text-sm text-gray-600">주의 구간</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xl font-[700] text-blue-600">{lastUpdatedLabel}</div>
                  <div className="text-sm text-gray-600">마지막 업데이트</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
