import React from "react";

export default function DetailPanel() {
  return (
    // 전체 div 부분
    <div className="right-0 absolute w-[348px] h-[650px] mr-[24px] mt-[79px] overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm text-sm flex flex-col">
      {/* 헤더 부분 */}
      <div className="flex items-center w-full h-[70px] pl-[24px] bg-sky-500 text-white text-[18px] font-bold rounded-t-md flex-shrink-0">
        CCTV 정보 보기
      </div>
      {/* CCTV 실시간 탐지 결과 섹션*/}
      <div className="text-[15px] font-bold pl-[24px] mt-[30px]">
        실시간 탐지 결과
      </div>
      <div className="text-xs text-sky-500 font-[700] pl-[24px] mt-[30px]">
        최근 도로 파손 유형 및 평균 건수
      </div>
      <div className="text-[30px] font-bold text-sky-600 pl-[24px]">
        35개
      </div>
      {/* 최근 기간에 따른 파손 유형 갯수 파악 */}
      <div className="flex justify-between items-center gap-2 text-[15px] font-[600] border-b border-gray-200 pb-2 px-[24px] mt-[30px]">
        <span className="border-b-2 text-blue-500 border-blue-500">
          최근 1개월
        </span>
        <span>최근 3개월</span>
        <span>최근 1년</span>
        <span>전체 기간</span>
      </div>

      {/* 차트 부분 */}
      <div className="w-full h-40 bg-yellow-50 rounded flex items-center justify-center text-gray-500">
        파이 차트 영역
      </div>

      {/* 최근 탐지 결과 확인 파트 */}
      <div className="text-[10px] font-[600] my-[15px] pl-[24px] text-gray-400">최근 탐지 결과 확인</div>
      <div className="flex gap-[80px] text-[12px] font-[600] px-[24px] ">
        <span>탐지 일자</span>
        <span>탐지 유형</span>
        <span>파손 갯수</span>
      </div>
      <div className="text-[15px] pt-2">
        
        <div className="flex gap-[65px] px-[24px] text-[12px] font-[500]">
          <span>2025.07.10</span>
          <span>포트홀</span>
          <div className="pl-[35px]"><span>3건</span></div>
        </div>
        <div className="border border-gray-200 my-[10px]"></div>
        <div className="flex gap-[65px] px-[24px] text-[12px] font-[500]">
          <span>2025.07.10</span>
          <span>포트홀</span>
          <div className="pl-[35px]"><span>3건</span></div>
        </div>
        <div className="border border-gray-200 my-[10px]"></div>
        <div className="flex gap-[65px] px-[24px] text-[12px] font-[500]">
          <span>2025.07.10</span>
          <span>포트홀</span>
          <div className="pl-[35px]"><span>3건</span></div>
        </div>
        <div className="border border-gray-200 my-[10px]"></div>
        <div className="flex gap-[65px] px-[24px] text-[12px] font-[500]">
          <span>2025.07.10</span>
          <span>포트홀</span>
          <div className="pl-[35px]"><span>3건</span></div>
        </div>
        <div className="border border-gray-200 my-[10px]"></div>
      </div>

      {/* 도로 위험도 평가 섹션 */}
      <div className="text-[15px] font-[600] pl-[24px] mt-[30px]">도로 위험도 평가</div>
      <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden shrink-0">
        <div className="h-full bg-yellow-400 w-2/5"></div>
      </div>
      <div className="flex justify-between text-xs px-1 mt-1 text-gray-600">
        <span>안전</span>
        <span>보통</span>
        <span>주의</span>
        <span>위험</span>
      </div>

      <div className="text-sm font-bold mt-4">도로 현황 보기</div>
      <div className="w-full h-28 bg-gray-100 rounded flex items-center justify-center text-gray-500">
        CCTV 영상 썸네일
      </div>

      <div className="text-sm font-bold mt-4">누적 신고 횟수</div>
      <div className="flex justify-between text-xs items-center mt-2">
        <div className="flex items-center gap-1">
          <span role="img" aria-label="신고">
            🚨
          </span>
          <span>한달 평균 건수</span>
        </div>
        <span className="text-right font-bold text-lg">23회</span>
      </div>
      <div className="flex justify-between text-xs items-center mt-2">
        <div className="flex items-center gap-1">
          <span role="img" aria-label="신고">
            🚨
          </span>
          <span>누적 횟수</span>
        </div>
        <span className="text-right font-bold text-lg">300회</span>
      </div>
    </div>
  );
}
