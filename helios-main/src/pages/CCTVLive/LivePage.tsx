import Banner from "../../components/Banner/Banner";
import MapPage from "../../components/CCTVLive/MapPage";
import RoadInsightPanel from "../../components/CCTVLive/RoadInsightPanel";

import { useState, useCallback } from "react";
import type { CCTVData } from "../../API/cctvAPI";

export default function LivePage() {
  const [cctvData, setCctvData] = useState<CCTVData[]>([]);
  const [mapLevel, setMapLevel] = useState<number>(8);
  const [focusCCTV, setFocusCCTV] = useState<CCTVData | null>(null);

  const handleBoundsChange = useCallback(() => {}, []);

  const handleFocusCCTV = useCallback((c: CCTVData) => {
    if (!c) return;
    setFocusCCTV(c);
  }, []);

  return (
    <>
      <div className="flex w-full">
        <Banner />
        <RoadInsightPanel
          cctvData={cctvData}
          mapLevel={mapLevel}
          onFocusCCTV={handleFocusCCTV}
        />
      </div>
      <MapPage
        onBoundsChange={handleBoundsChange}
        onData={(data) => setCctvData(data)}
        onMapLevelChange={setMapLevel}
        focusCCTV={focusCCTV}
      />
    </>
  );
}
