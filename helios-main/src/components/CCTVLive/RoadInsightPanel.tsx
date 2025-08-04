import React from "react";

export default function RoadInsightPanel() {
  return (
    <>
      <div
        className="flex w-[315px] top-[60px] z-50 bg-white justify-center overflow-y-scroll scroll-y-auto absolute border-gray-300 border-r"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <div className="flex flex-col items-center w-full px-4">
          <div className="relative flex items-center w-full h-[4.8vh] mt-[24px] shrink-0">
            <button
              className="absolute left-[13.5px] top-1/2 transform -translate-y-1/2"
              onClick={() => alert("검색 기능은 아직 구현되지 않았습니다.")}
            >
              <img
                className="w-[14px] h-[17px]"
                src="src/assets/livePage/glasses.png"
                alt="검색"
              />
            </button>
            <input
              className="w-full h-full bg-white border border-neutral-300 rounded-2xl pl-[35px] placeholder:text-gray-400"
              placeholder="주소를 입력해주세요."
            />
          </div>

          <div className="flex gap-[25px] mt-4 w-full justify-center">
            <div className="flex flex-row items-center justify-center w-auto h-[35px] px-[16px] py-[6px] border rounded-full gap-[6px] border-black">
              <img
                className="w-[15px] h-[15px]"
                src="src/assets/livePage/danger.png"
                alt="위험"
              />
              <div className="font-[700] text-[12px]">위험</div>
            </div>

            <div className="flex flex-row items-center justify-center w-auto h-[35px] px-[16px] py-[6px] border rounded-full gap-[6px] border-black">
              <img
                className="w-[15px] h-[15px]"
                src="src/assets/livePage/warning.png"
                alt="주의"
              />
              <div className="font-[700] text-[12px]">주의</div>
            </div>

            <div className="flex flex-row items-center justify-center w-auto h-[35px] px-[16px] py-[6px] border rounded-full gap-[6px] border-black">
              <img
                className="w-[15px] h-[15px]"
                src="src/assets/livePage/normal.png"
                alt="안전"
              />
              <div className="font-[700] text-[12px]">안전</div>
            </div>
          </div>

          <div className="bg-white mt-[16px] w-full">
            <div className="font-[700] p-[16px]">현재 파손도로</div>
            <ul className="space-y-[10px]">
              <li>
                <div className="p-[16px]">
                  <div className="font-[600] text-[16px] mb-[10px]">
                    1. 영동 고속도로
                  </div>
                  <div className="font-[500] text-[14px] text-gray-500 pl-[21px] mb-[3px]">
                    현재 상태: 위험
                  </div>
                  <div className="font-[500] text-[12px] pl-[21px]">
                    포트홀, 균열 등
                  </div>
                </div>
              </li>
              <div className="-ml-4 w-[calc(100%+2rem)] border border-gray-200"></div>

              <li>
                <div className="p-[16px]">
                  <div className="font-[600] text-[16px] mb-[10px]">
                    1. 영동 고속도로
                  </div>
                  <div className="font-[500] text-[14px] text-gray-500 pl-[21px] mb-[3px]">
                    현재 상태: 위험
                  </div>
                  <div className="font-[500] text-[12px] pl-[21px]">
                    포트홀, 균열 등
                  </div>
                </div>
              </li>
              <div className="-ml-4 w-[calc(100%+2rem)] border border-gray-200"></div>

              <li>
                <div className="p-[16px]">
                  <div className="font-[600] text-[16px] mb-[10px]">
                    1. 영동 고속도로
                  </div>
                  <div className="font-[500] text-[14px] text-gray-500 pl-[21px] mb-[3px]">
                    현재 상태: 위험
                  </div>
                  <div className="font-[500] text-[12px] pl-[21px]">
                    포트홀, 균열 등
                  </div>
                </div>
              </li>
              <div className="-ml-4 w-[calc(100%+2rem)] border border-gray-200"></div>

              <li>
                <div className="p-[16px]">
                  <div className="font-[600] text-[16px] mb-[10px]">
                    1. 영동 고속도로
                  </div>
                  <div className="font-[500] text-[14px] text-gray-500 pl-[21px] mb-[3px]">
                    현재 상태: 위험
                  </div>
                  <div className="font-[500] text-[12px] pl-[21px]">
                    포트홀, 균열 등
                  </div>
                </div>
              </li>
              <div className="-ml-4 w-[calc(100%+2rem)] border border-gray-200"></div>

              <li>
                <div className="p-[16px]">
                  <div className="font-[600] text-[16px] mb-[10px]">
                    1. 영동 고속도로
                  </div>
                  <div className="font-[500] text-[14px] text-gray-500 pl-[21px] mb-[3px]">
                    현재 상태: 위험
                  </div>
                  <div className="font-[500] text-[12px] pl-[21px]">
                    포트홀, 균열 등
                  </div>
                </div>
              </li>
              <div className="-ml-4 w-[calc(100%+2rem)] border border-gray-200"></div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
