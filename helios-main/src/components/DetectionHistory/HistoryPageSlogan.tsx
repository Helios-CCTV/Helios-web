export default function HistoryPageSlogan() {
  return (
    <>
      {/* 페이지 헤더 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 mt-20">
          {/* 메인 타이틀 */}
          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-[900] text-3xl lg:text-4xl text-gray-800">
              최근 파손 정보를 한번에 확인해요.
            </h1>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-[600]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              실시간 업데이트
            </div>
          </div>

          {/* 서브 타이틀 */}
          <p className="text-lg text-gray-600 font-[500] leading-relaxed max-w-3xl">
            AI가 실시간으로 탐지한 도로 파손 정보를 지역별, 유형별로 확인하고
            <span className="text-blue-600 font-[700]"> 상세한 분석 결과</span>
            를 살펴보세요.
          </p>

          {/* 통계 정보 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600 text-lg">🚨</span>
                </div>
                <div>
                  <div className="text-xl font-[700] text-red-600">127</div>
                  <div className="text-sm text-gray-600">위험 구간</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>
                <div>
                  <div className="text-xl font-[700] text-yellow-600">284</div>
                  <div className="text-sm text-gray-600">주의 구간</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
                <div>
                  <div className="text-xl font-[700] text-green-600">1,892</div>
                  <div className="text-sm text-gray-600">안전 구간</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">📅</span>
                </div>
                <div>
                  <div className="text-xl font-[700] text-blue-600">오늘</div>
                  <div className="text-sm text-gray-600">마지막 업데이트</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
