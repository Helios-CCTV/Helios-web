import React from "react";
import Banner from "../../components/Banner/Banner";
import HistoryPageSlogan from "../../components/DetectionHistory/HistoryPageSlogan";
import DetectionHistorySearchBar from "../../components/DetectionHistory/DetectionHistorySearchBar";
import DetectionHistoryContent from "../../components/DetectionHistory/DetectionHistoryContent";
import DetectionHistoryNextButton from "../../components/DetectionHistory/DetectionHistoryNextButton";

export default function DetectionHistoryPage() {
  return (
    <>
      <div className="min-h-screen flex flex-col overflow-y-auto scroll-y-auto">
        <Banner />
        <HistoryPageSlogan />
        <DetectionHistorySearchBar />
        <DetectionHistoryContent />
        <DetectionHistoryNextButton />
      </div>
    </>
  );
}
