import React from 'react'



export default function ViewStatusEx() {
  return (
<>

    <div className='w-full h-screen text-[35px] flex flex-col justify-center items-center'>
        <div className='text-blue-400 font-[700] text-[25px]'>CCTV 현황 보기</div>

        <div className='font-[700] text-[35px] flex gap-[1vw]'>
            <div>전국 CCTV 현황</div>
            <div>한번에</div>
            <div>조회하기</div>
        </div>

        {/* 아래로 이동 화살표 */}
        <div className="flex w-[40px] h-[40px] justify-center items-center animate-bounce">
            {/* 왼쪽 선 */}
            <div className="absolute w-[80px] h-[5px] opacity-80 bg-gray-500 rounded-full rotate-30 top-[30vh] left-[-45px]"></div>

            {/* 오른쪽 선 */}
            <div className="absolute w-[80px] h-[5px] opacity-80 bg-gray-500 rounded-full -rotate-30 top-[30vh] left-[20px] "></div>
        </div>
    </div>
</>
  )
}