import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-[60px] z-50 flex bg-white justify-between px-[11.8vw] py-[0.3vh] shadow-md border-b border-gray-300">
        <div className="flex">
          <img
            className="size-[50px]"
            onClick={() => navigate("/")}
            src="/assets/logo.png"
            alt="logo"
          />
          <button
            className="font-[700] sm:text-[20px] text-[15px]  flex justify-center items-center"
            onClick={() => navigate("/")}
          >
            Helios
          </button>
        </div>

        <div className="flex gap-[8vw] font-[600] sm:text-[15px] text-[10px] text-neutral-500 justify-center items-center">
          <button onClick={() => navigate("/MapPage")}>cctv현황</button>
          <button onClick={() => navigate("/DetectionHistory")}>
            탐지기록
          </button>
          <button onClick={() => navigate("/ReportPage")}>신고하기</button>
        </div>
      </div>
    </>
  );
}
