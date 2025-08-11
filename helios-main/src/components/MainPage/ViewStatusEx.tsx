import React from "react";

export default function ViewStatusEx() {
  return (
    <>
      <div className="w-full h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center relative overflow-hidden">
        {/* 배경 데코레이션 */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-indigo-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-sky-100 rounded-full opacity-50"></div>

        <div className="text-center z-10">
          
          {/* 메인 타이틀 */}
          <div className="mt-20 font-[900] text-5xl lg:text-6xl flex flex-col gap-2 text-gray-800 leading-tight">
            <div className="flex items-center justify-center gap-4">
              <span>전국 CCTV 현황</span>
              <span className="text-blue-500">한번에</span>
            </div>
            <div className="text-gray-700">조회하기</div>
          </div>

          {/* 서브 텍스트 */}
          <div className="mt-8 text-xl text-gray-600 font-[500] leading-relaxed">
            <div>복잡했던 기존 시스템을 벗어나</div>
            <div className="mt-2">
              <span className="text-blue-600 font-[700]">직관적이고 빠른</span>{" "}
              CCTV 모니터링을 경험하세요
            </div>
          </div>

          {/* 특징 카드들 */}
          <div className="mt-16 flex justify-center gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">🗺️</div>
              <div className="font-[700] text-gray-800 mb-2">실시간 지도</div>
              <div className="text-sm text-gray-600">전국 CCTV 위치 확인</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">🔍</div>
              <div className="font-[700] text-gray-800 mb-2">스마트 검색</div>
              <div className="text-sm text-gray-600">원하는 지역 빠른 검색</div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">📊</div>
              <div className="font-[700] text-gray-800 mb-2">상세 분석</div>
              <div className="text-sm text-gray-600">도로 상태 실시간 분석</div>
            </div>
          </div>

          {/* 스크롤 안내 */}
          <div className="mt-20 flex flex-col items-center">
            <div className="text-gray-500 text-sm font-[500] mb-4">
              자세한 기능을 확인해보세요
            </div>
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
