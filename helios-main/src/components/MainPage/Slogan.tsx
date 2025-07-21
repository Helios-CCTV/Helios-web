import React from 'react'

// 배너 작업 중, 이미지 그라데이션 작업 해야함
export default function Slogan() {
  return (
    <>
    {/* 전체 div 그라데이션 작업 중이였음 */} 
    <div className="w-screen h-screen flex items-start justify-center relative bg-gradient-to-t from-white to-*">
      {/* 로고 */}
      <img className="w-full h-[99vh] object-cover" src="src/assets/backgroundImage.png" alt="slogan" />
      
      {/* 슬로건 */}
      <div className='absolute flex justify-center items-center transform -translate-y-1/2 top-1/3 text-[30px] lg:top-1/3 font-[700] lg:text-[60px] md:text-[50px] sm:text-[40px]'>AI가 먼저 알고 즉시 알려요.</div>
      <div className='absolute flex justify-center items-center transform -translate-y-1/2 top-[38%] text-[30px] lg:top-[45%] md:top-[43%] sm:top-[40%] font-[700] lg:text-[60px] md:text-[50px] sm:text-[40px]'>더 안전한 길 우리와 함께</div>
      
      {/* 아래로 이동 화살표 */}
      <div className="absolute flex w-[40px] h-[40px] animate-bounce">
        {/* 왼쪽 선 */}
        <div className="absolute w-[80px] h-[5px] opacity-80 bg-gray-500 rounded-full rotate-30 top-[90vh] left-[-33px]"></div>
    
        {/* 오른쪽 선 */}
        <div className="absolute w-[80px] h-[5px] opacity-80 bg-gray-500 rounded-full -rotate-30 top-[90vh] left-[33px]"></div>
      </div>
    </div>
    </>
  )
}
