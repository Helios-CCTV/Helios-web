import React from "react";
import Banner from "../../components/Banner/Banner";
import MapPage from "../../components/CCTVLive/MapPage";
import RoadInsightPanel from "../../components/CCTVLive/RoadInsightPanel";
import DetailPanel from "../../components/CCTVLive/DetailPanel";

export default function LivePage() {
  return (
    <>
      <div className="flex w-full">
        <Banner />
        <RoadInsightPanel />
      </div>
      <MapPage />
      <DetailPanel />
    </>
  );
}
