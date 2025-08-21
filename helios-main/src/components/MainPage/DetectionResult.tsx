export default function DetectionResult() {
  return (
    <>
      <div className="w-full h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex flex-col justify-center items-center py-20">
        {/* 헤더 섹션 */}
        <div className="text-center mb-16">
          <div className="font-[900] text-2xl sm:text-3xl lg:text-4xl text-gray-800 leading-tight mt-30">
            AI가 탐지한 결과를 모아봤어요
          </div>
        </div>

        {/* 메인 컨텐츠 섹션 */}
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-8 md:gap-16 lg:gap-20">
          {/* 왼쪽 설명 */}
          <div className="flex-shrink-0">
            <div className="bg-white p-7 md:p-8 rounded-2xl shadow-lg border border-gray-100 min-h-[200px] min-w-[120px] ">
              <div className="text-center mb-6">
                <div className="font-[700] text-sm text-gray-800 leading-relaxed">
                  <div className="text-blue-600">얼마나 위험한지</div>
                  <div>판단해요.</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>위험 구간 탐지</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>실시간 분석</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>안전도 평가</span>
                </div>
              </div>
            </div>
          </div>

          {/* 중앙 이미지 */}
          <div className="relative hidden md:flex">
            <div className="absolute"></div>
            <img
              className="relative w-[550px] h-[400px] object-cover rounded-3xl shadow-2xl border-4 border-white"
              src="/assets/mainPage/DetectionResultImage.png"
              alt="map"
            />
          </div>

          {/* 오른쪽 설명 */}
          <div className="flex-shrink-0">
            <div className="bg-white p-5 md:p-8 rounded-2xl shadow-lg border border-gray-100 min-h-[200px] min-w-[120px] flex-col justify-center items-center">
              <div className="text-center mb-6">
                <div className="font-[700] text-sm text-gray-800 leading-relaxed">
                  <div>도로 속 위험을 AI가</div>
                  <div className="text-red-600">찾아서 알려줘요.</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>포트홀 탐지</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>균열 분석</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>침하 감지</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 설명 섹션 */}
        <div className="text-center max-w-4xl mx-auto px-8">
          <div className="p-8">
            <div className="font-[700] text-1xl lg:text-2xl text-gray-800 leading-relaxed mb-4">
              <div>처음 사용하는 사용자도 이해할 수 있게,</div>
              <div className="text-blue-600 mt-2">
                쉽고 빠르게 탐지 결과를 확인해봐요
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
