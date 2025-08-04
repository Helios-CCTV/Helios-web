import React from "react";

export default function DetailPanel() {
  return (
    // 전체 div 부분
    <div className="left-[315px] absolute w-[348px] h-full top-[60px] overflow-y-auto bg-white border-l border-gray-300 shadow-sm text-sm flex flex-col">
      {/* 헤더 부분 */}
      <div className="flex items-center w-full h-[70px] pl-[24px] bg-sky-500 text-white text-[18px] font-bold flex-shrink-0">
        CCTV 정보 보기
      </div>

      <div className="m-[24px]">
        {/* CCTV 실시간 탐지 결과 섹션*/}
        <div className="text-[20px] font-[700]">실시간 탐지 결과</div>
        <div className="text-[16px] text-sky-500 font-[700] mt-[30px]">
          최근 도로 파손 유형 및 평균 건수
        </div>
        <div className="text-[25px] font-[700] text-sky-600">35개</div>
        {/* 최근 기간에 따른 파손 유형 갯수 파악 */}
        <div className="flex justify-between items-center gap-2 text-[16px] font-[500] border-b border-gray-200 mt-[30px]">
          <span className="border-b-2 text-blue-500 border-blue-500">
            최근 1개월
          </span>
          <span>최근 3개월</span>
          <span>최근 1년</span>
          <span>전체 기간</span>
        </div>
        {/* 차트 부분 */}
        <div className="h-[220px] mt-[24px] bg-yellow-50 rounded flex items-center justify-center text-gray-500 shrink-0">
          파이 차트 영역
        </div>
      </div>

      <div className="border-[5px] border-gray-200"></div>

      <div className="m-[24px]">
        {/* 최근 탐지 결과 확인 파트 */}
        <div className="text-[20px] font-[700] mb-[24px]">
          최근 탐지 결과 확인
        </div>
        <div className="flex gap-[60px] text-[16px] font-[600]">
          <span>탐지 일자</span>
          <span>탐지 유형</span>
          <span>파손 갯수</span>
        </div>
        <div className="text-[16px] pt-2">
          <div className="flex gap-[65px] text-[12px] font-[500]">
            <span>2025.07.10</span>
            <span>포트홀</span>
            <div className="pl-[35px]">
              <span>3건</span>
            </div>
          </div>
          <div className="border border-gray-200 my-[10px]"></div>
          <div className="flex gap-[65px] text-[12px] font-[500]">
            <span>2025.07.10</span>
            <span>포트홀</span>
            <div className="pl-[35px]">
              <span>3건</span>
            </div>
          </div>
          <div className="border border-gray-200 my-[10px]"></div>
          <div className="flex gap-[65px] text-[12px] font-[500]">
            <span>2025.07.10</span>
            <span>포트홀</span>
            <div className="pl-[35px]">
              <span>3건</span>
            </div>
          </div>
          <div className="border border-gray-200 my-[10px]"></div>
          <div className="flex gap-[65px] text-[12px] font-[500]">
            <span>2025.07.10</span>
            <span>포트홀</span>
            <div className="pl-[35px]">
              <span>3건</span>
            </div>
          </div>
          <div className="border border-gray-200 my-[10px]"></div>
        </div>
      </div>

      <div className="border-[5px] border-gray-200"></div>

      {/* 도로 위험도 평가 섹션 */}
      <div className="m-[24px]">
        <div className="text-[20px] font-[700]">도로 위험도 평가</div>

        <div className="flex justify-center my-[24px]">
          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden shrink-0">
            <div className="h-full bg-yellow-400 w-2/5"></div>
          </div>
        </div>

        <div className="flex justify-between text-[16px] text-gray-600">
          <span>안전</span>
          <span>보통</span>
          <span>주의</span>
          <span>위험</span>
        </div>
      </div>

      <div className="border-[5px] border-gray-200"></div>

      {/* 도로 현황 보기 */}
      <div className="m-[24px]">
        <div className="text-[24px] font-[700]">도로 현황 보기</div>
        <div className="h-[220px] mt-[24px] bg-gray-100 rounded flex items-center justify-center text-gray-500 shrink-0">
          CCTV 영상 썸네일
        </div>
      </div>

      <div className="border-[5px] border-gray-200"></div>

      {/* 누적 신고 횟수 섹션 */}
      <div className="m-[24px]">
        <div className="text-[24px] font-[700] mb-[24px]">누적 신고 횟수</div>
        <div className="flex justify-between text-xs items-center mb-[24px]">
          <div className="flex items-center gap-3 text-[16px] font-[600]">
            <img
              className="w-[30px] h-[36px]"
              src="src/assets/livePage/siren.png"
              alt="사이렌"
            />
            <span className="">한달 평균 건수</span>
          </div>
          <span className="text-right font-bold text-lg">23회</span>
        </div>
        <div className="flex justify-between text-xs items-center mb-[24px]">
          <div className="flex items-center gap-3 text-[16px] font-[600]">
            <img
              className="w-[30px] h-[36px]"
              src="src/assets/livePage/siren.png"
              alt="사이렌"
            />
            <span>누적 횟수</span>
          </div>
          <span className="text-right font-bold text-lg">300회</span>
        </div>
      </div>
    </div>
  );
}
