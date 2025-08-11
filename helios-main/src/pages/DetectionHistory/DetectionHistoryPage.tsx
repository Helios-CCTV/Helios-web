import React from "react";
import Banner from "../../components/Banner/Banner";
import HistoryPageSlogan from "../../components/DetectionHistory/HistoryPageSlogan";
import DetectionHistorySearchBar from "../../components/DetectionHistory/DetectionHistorySearchBar";
import DetectionHistoryContent from "../../components/DetectionHistory/DetectionHistoryContent";
import DetectionHistoryNextButton from "../../components/DetectionHistory/DetectionHistoryNextButton";

export default function DetectionHistoryPage() {
  return (
    <>
      {/* 전체 페이지 컨테이너 - 배경색과 최소 높이 설정 */}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* 상단 네비게이션 배너 */}
        <Banner />

        {/* 페이지 헤더 (제목, 통계 등) */}
        <HistoryPageSlogan />

        {/* 검색 및 필터 영역 */}
        <DetectionHistorySearchBar />

        {/* 메인 컨텐츠 영역 - 탐지 기록 리스트 */}
        <div className="flex-1 bg-white">
          <DetectionHistoryContent />
        </div>

        {/* 하단 페이지네이션 */}
        <DetectionHistoryNextButton />
      </div>
    </>
  );
}
