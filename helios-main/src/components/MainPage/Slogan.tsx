import React from 'react'

// 슬로건, 메인 배너 이미지에 대한 컴포넌트
export default function Slogan() {
  return (
    <>
    {/* 전체 div */}
    <div className="w-screen min-h-screen flex items-start justify-center relative">
      {/* gradation 적용 */}
      <div className='fixed bg-gradient-to-b from-white to-white/0 z-50 h-[10%] w-full top-[7.3vh]'></div>
      {/* 로고 */}
      <img className="absolute w-full h-[99vh] mt-[7.3vh] object-cover" src="src/assets/backgroundImage.png" alt="slogan" />
      {/* <div className='bg-cover bg-center relative w-full h-[99vh] mt-[7.3vh] object-cover' style={{backgroundImage: `url('src/assets/backgroundImage.png')`}}></div> */}


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
