import { useState, useRef, useEffect } from "react";
import Hls from "hls.js";
import type { CCTVData } from "../../API/cctvAPI";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyzeData } from "../../API/Analyze";

interface DetailPanelProps {
  selectedcctv: CCTVData;
  onClose: () => void;
}

export default function DetailPanel({
  selectedcctv,
  onClose,
}: DetailPanelProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("1month");
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 분석 데이터 쿼리
  const analyzeListQuery = useQuery({
    queryKey: ["analyzeList"],
    queryFn: fetchAnalyzeData,
    staleTime: 60 * 1000,
  });

  // API 스키마가 {success, code, message, data:[...]} 또는 배열 both 지원
  const analyzerListData: any[] = Array.isArray(
    (analyzeListQuery.data as any)?.data
  )
    ? (analyzeListQuery.data as any).data
    : Array.isArray(analyzeListQuery.data)
    ? (analyzeListQuery.data as any[])
    : [];

  // ✅ id 우선 매칭 (이름 포맷 이슈 방지). 필요 시 이름은 보조(fallback)
  const matchedAnalyze = analyzerListData.find(
    (item: any) =>
      item?.id === selectedcctv.id ||
      item?.cctvId === selectedcctv.id ||
      item?.analyzeId === selectedcctv.analyzeId || // 일부 스키마 대비
      item?.cctvName === selectedcctv.cctvname
  );

  // detections가 string[] 또는 {label:string}[] 모두 대응
  const damageTypes = matchedAnalyze?.detections
    ? Array.from(
        new Set(
          (matchedAnalyze.detections as any[])
            .map((d: any) => (typeof d === "string" ? d : d?.label ?? ""))
            .filter(Boolean)
        )
      )
    : [];

  const detectionHistory = matchedAnalyze?.detections
    ? (matchedAnalyze.detections as any[]).map((d: any) => {
        const type = typeof d === "string" ? d : d?.label ?? "-";
        return {
          date: (typeof d !== "string" ? d?.date : undefined) ?? "-",
          type,
          count: (typeof d !== "string" ? d?.count : undefined) ?? 1,
          severity: (typeof d !== "string" ? d?.severity : undefined) ?? "주의",
        };
      })
    : [];

  // HLS 영상 초기화
  useEffect(() => {
    const loadHLS = async () => {
      if (
        selectedcctv.cctvformat === "HLS" &&
        selectedcctv.cctvurl &&
        videoRef.current
      ) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(selectedcctv.cctvurl);
          hls.attachMedia(videoRef.current);
        } else if (
          videoRef.current.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // Safari에서 네이티브 HLS 지원
          videoRef.current.src = selectedcctv.cctvurl;
        } else {
          console.error("HLS가 지원되지 않는 브라우저입니다.");
        }
      }
    };

    loadHLS();
  }, [selectedcctv.cctvurl, selectedcctv.cctvformat]);

  if (!analyzeListQuery.isLoading && !analyzeListQuery.isError) {
    console.log("분석 데이터:", analyzerListData);
  }

  // 탐지 건수 기반 위험도 계산:
  // 0건 → 안전~보통 사이(약 25%),
  // 1건 → 보통~주의 사이(약 50%),
  // 2건 이상 → 주의~위험 사이(약 80%)
  const detectionsCount = matchedAnalyze?.detections?.length ?? 0;

  const riskLevel = (() => {
    if (detectionsCount <= 0) return 25; // 안전과 보통 사이
    if (detectionsCount === 1) return 50; // 보통과 주의 사이
    return 80; // 주의와 위험 사이
  })();

  return (
    <div
      className="md:left-[315px] absolute md:w-[380px] h-full w-full top-[60px] overflow-y-auto bg-white border-l border-gray-200 shadow-lg text-sm z-50"
      style={{
        height: "calc(100vh - 60px)",
        overflowY: "auto",
        position: "fixed",
      }}
    >
      {/* 헤더 */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">CCTV 상세정보</h2>
            <p className="text-blue-100 text-sm">{selectedcctv.cctvname}</p>
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            aria-label="패널 닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 실시간 상태 카드 */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              실시간 탐지 결과
            </h3>
          </div>

          <div className="flex-col gap-6 mb-3">
            <div className="text-center flex-col justify-center items-center">
              <div className="text-2xl font-bold text-orange-600">
                {matchedAnalyze ? matchedAnalyze.detections.length : 0}
              </div>
              <div className="text-xs text-gray-600">이번 달 탐지</div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            최근 도로 파손 유형 및 평균 건수
          </div>
        </div>

        {/* 기간 선택 탭 */}
        <div className="bg-white border border-gray-200 rounded-xl p-1">
          <div className="grid grid-cols-4 gap-1">
            {[
              { key: "1month", label: "1개월" },
              { key: "3months", label: "3개월" },
              { key: "1year", label: "1년" },
              { key: "all", label: "전체" },
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key)}
                className={`py-2 px-3 text-xs font-medium rounded-lg transition-all ${
                  selectedPeriod === period.key
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h4 className="font-semibold text-gray-800 mb-4 text-center">
            파손 유형별 분포
          </h4>
          <div className="h-40 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                {matchedAnalyze ? matchedAnalyze.detections.length : 0}건
              </div>
              <div className="text-xs text-gray-600">
                {/* 탐지된 유형 목록 */}
                {damageTypes.length > 0
                  ? damageTypes.join(" • ")
                  : "탐지된 유형 없음"}
              </div>
            </div>
          </div>
        </div>

        {/* 최근 탐지 결과 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">최근 탐지 결과</h3>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-gray-600 mb-3 pb-2 border-b border-gray-100">
              <span>탐지 일자</span>
              <span>유형</span>
              <span>건수</span>
            </div>

            <div className="space-y-3">
              {detectionHistory
                .slice(0, isExpanded ? detectionHistory.length : 4)
                .map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-4 text-sm items-center py-2 hover:bg-gray-50 rounded-lg px-2 transition-colors"
                  >
                    <span className="text-gray-700">{item.date}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-800 font-medium">
                        {item.type}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          item.severity === "위험"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {item.count}건
                    </span>
                  </div>
                ))}
            </div>

            {detectionHistory.length > 4 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full mt-3 py-2 text-sm text-blue-500 hover:text-blue-600 font-medium"
              >
                {isExpanded
                  ? "접기"
                  : `더보기 (+${detectionHistory.length - 4}개)`}
              </button>
            )}
          </div>
        </div>

        {/* 도로 위험도 평가 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-4">도로 위험도 평가</h3>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                현재 위험도
              </span>
              <span className="text-lg font-bold text-orange-600">
                {riskLevel}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${riskLevel}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>안전</span>
              <span>보통</span>
              <span>주의</span>
              <span>위험</span>
            </div>
          </div>
        </div>

        {/* CCTV 영상 */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800">실시간 영상</h3>
            </div>
          </div>

          <div className="p-4">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-3">
              {selectedcctv.cctvformat === "HLS" && selectedcctv.cctvurl ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  muted
                  playsInline
                  onError={(e) => {
                    console.error("비디오 재생 오류:", e);
                  }}
                >
                  브라우저가 비디오 재생을 지원하지 않습니다.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      CCTV 영상을 불러올 수 없습니다
                    </div>
                    <div className="text-xs text-gray-500">
                      {selectedcctv.cctvformat} 형식 지원 필요
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 신고 통계 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-4">신고 통계</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-semibold text-blue-800">
                  월간 평균
                </span>
              </div>
              <div className="text-xl font-bold text-blue-600">0회</div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm font-semibold text-red-800">
                  총 누적
                </span>
              </div>
              <div className="text-xl font-bold text-red-600">0회</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
