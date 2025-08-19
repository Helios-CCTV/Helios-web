import Banner from "../../components/Banner/Banner";
import Slogan from "../../components/MainPage/Slogan";
import ViewStatusEx from "../../components/MainPage/ViewStatusEx";
import ViewStatus from "../../components/MainPage/ViewStatus";
import DetectionResult from "../../components/MainPage/DetectionResult";
import ReportService from "../../components/MainPage/ReportService";

export default function MainPage() {
  return (
    <>
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        <div>
          <Banner />
        </div>
        <div className="snap-start w-full h-screen">
          <Slogan />
        </div>
        <div className="snap-start w-full h-screen">
          <ViewStatusEx />
        </div>
        <div className="snap-start w-full h-screen">
          <ViewStatus />
        </div>
        <div className="snap-start w-full h-screen">
          <DetectionResult />
        </div>
        <div className="snap-start w-full h-screen">
          <ReportService />
        </div>
      </div>
    </>
  );
}
