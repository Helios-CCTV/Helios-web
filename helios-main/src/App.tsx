import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import LivePage from "./pages/CCTVLive/LivePage";
import DetectionHistoryPage from "./pages/DetectionHistory/DetectionHistoryPage";
import ReportPage from "./pages/ReportPage/ReportPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}></Route>
      <Route path="/MapPage" element={<LivePage />}></Route>
      <Route
        path="/DetectionHistory"
        element={<DetectionHistoryPage />}
      ></Route>
      <Route path="/ReportPage" element={<ReportPage />}></Route>
    </Routes>
  );
}

export default App;
