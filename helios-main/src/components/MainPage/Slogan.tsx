import { useNavigate } from "react-router-dom";

// 슬로건, 메인 배너 이미지에 대한 컴포넌트
export default function Slogan() {
  const navigate = useNavigate();

  return (
    <>
      {/* 전체 div */}
      <div className="w-screen min-h-screen flex items-start justify-center relative">
        {/* gradation 적용 */}
        <div className="absolute bg-gradient-to-b from-white via-white/60 to-white/0 z-20 h-[15%] w-full top-[7.3vh]"></div>

        {/* 배경 이미지 */}
        <img
          className="absolute w-full h-[99vh] mt-[7.3vh] object-cover"
          src="src/assets/backgroundImage.png"
          alt="slogan"
        />

        {/* 어두운 오버레이 추가 */}
        <div className="absolute w-full h-[99vh] mt-[7.3vh] bg-black/20 z-10"></div>

        {/* 슬로건 컨테이너 */}
        <div className="absolute z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="mb-6">
            <div className="text-white text-4xl lg:text-6xl md:text-5xl sm:text-4xl font-[900] leading-tight drop-shadow-2xl">
              AI가 먼저 알고 즉시 알려요.
            </div>
            <div className="text-white text-4xl lg:text-6xl md:text-5xl sm:text-4xl font-[900] leading-tight drop-shadow-2xl mt-4">
              더 안전한 길 우리와 함께
            </div>
          </div>

          {/* 서브 텍스트 추가 */}
          <div className="text-white/90 text-lg lg:text-2xl md:text-xl font-[500] mt-8 drop-shadow-lg">
            AI 기반 실시간 도로 파손 탐지 시스템
          </div>

          {/* CTA 버튼 추가 */}
          <div className="mt-12 flex gap-4 justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-[700] px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
              onClick={() => {
                navigate("/MapPage");
              }}
            >
              CCTV 현황 보기
            </button>
            <button
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-[700] px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/30"
              onClick={() => {
                navigate("/ReportPage");
              }}
            >
              도로 신고하기
            </button>
          </div>
        </div>

        {/* 아래로 이동 화살표 - 개선된 디자인 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex flex-col items-center animate-bounce">
            <div className="text-white/70 text-sm font-[500] mb-2">
              아래로 스크롤
            </div>
            <div className="relative">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
