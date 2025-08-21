export default function ViewStatus() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-0 flex flex-col justify-center items-center">
      {/* 첫 번째 섹션 */}
      <div className="max-w-7xl min-w-[330px] px-8 mb-20 mt-20">
        <div className="flex items-center gap-16 lg:gap-20">
          {/* 텍스트 영역 */}
          <div className="flex-1 max-w-2xl">
            <div className="font-[900] text-2xl lg:text-3xl leading-tight text-gray-800 mb-6">
              <div>전국의 CCTV를 쉽고 빠르게</div>
              <div className="text-blue-600 mt-2">찾아볼 수 있게</div>
            </div>

            <div className="md:bg-white md:p-6 rounded-2xl md:shadow-lg md:border md:border-gray-100">
              <div className="text-lg font-[600] text-gray-700 leading-relaxed hidden md:block">
                <div>
                  보기 어려웠던 기존의 CCTV
                  <span className="block sm:inline">
                    {" "}
                    제공 사이트보다 쉽고 빠르게
                  </span>
                </div>
                <div className="mt-2 text-blue-600">
                  볼 수 있는 서비스를 제공해요.
                </div>
              </div>
              <span className="text-sm font-[600] text-gray-500 md:hidden">
                기존의 CCTV 보다 쉽고 빠르게{" "}
                <span className="block">찾아볼 수 있어요.</span>
              </span>
            </div>
          </div>

          {/* 이미지 영역 */}
          <div className="flex-shrink-0 hidden md:flex">
            <div className="relative">
              <div className="absolute"></div>
              <img
                className="relative w-90 h-65 lg:w-105 lg:h-80 object-cover rounded-2xl shadow-2xl border-4 border-white"
                src="/assets/mainPage/mainPageMapImage.png"
                alt="map"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 두 번째 섹션 */}
      <div className="max-w-7xl min-w-[330px] px-8">
        <div className="flex items-center gap-16 lg:gap-20">
          {/* 이미지 영역 */}
          <div className="flex-shrink-0 hidden md:flex">
            <div className="relative">
              <div className="absolute"></div>
              <img
                className="relative w-95 h-65 lg:w-110 lg:h-72 object-cover rounded-2xl shadow-2xl border-4 border-white"
                src="/assets/mainPage/mainPageDangerImage.png"
                alt="danger"
              />
            </div>
          </div>

          {/* 텍스트 영역 */}
          <div className="flex-1 max-w-2xl">
            <div className="font-[900] text-2xl lg:text-3xl leading-tight text-gray-800 mb-6">
              <div>파손된 도로를 AI가 분석해</div>
              <span className="text-red-600 mt-2">알려줘요</span>
            </div>

            <div className="md:bg-white md:p-6 rounded-2xl md:shadow-lg md:border md:border-gray-100">
              <div className="text-lg font-[600] text-gray-700 leading-relaxed hidden md:block">
                <div>
                  전국의 도로를 AI가 분석해{" "}
                  <span className="block sm:inline">
                    파손 유형과 파손 위치를 분석 해요.
                  </span>
                </div>
                <div className="mt-2 text-red-600">
                  분석한 결과는 사용자가 볼 수 있게{" "}
                  <span className="block sm:inline">
                    시각적으로 표현합니다.
                  </span>
                </div>
              </div>
              <span className="text-sm font-[600] text-gray-500 md:hidden">
                분석한 결과를 쉽고 빠르게{" "}
                <span className="block sm:inline">사용자에게 제공합니다.</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
