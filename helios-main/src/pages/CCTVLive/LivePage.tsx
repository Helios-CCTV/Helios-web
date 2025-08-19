import Banner from "../../components/Banner/Banner";
import MapPage from "../../components/CCTVLive/MapPage";
import RoadInsightPanel from "../../components/CCTVLive/RoadInsightPanel";

import { useState, useCallback } from "react";
import type { CCTVData } from "../../API/cctvAPI";

export default function LivePage() {
  const [cctvData, setCctvData] = useState<CCTVData[]>([]);

  const handleBoundsChange = useCallback(() => {}, []);

  return (
    <>
      <div className="flex w-full">
        <Banner />
        <RoadInsightPanel cctvData={cctvData} />
      </div>
      <MapPage
        onBoundsChange={handleBoundsChange}
        onData={(data) => setCctvData(data)}
      />
    </>
  );
}
