import React from 'react'

// 배너 작업 중, 이미지 그라데이션 작업 해야함
export default function Slogan() {
  return (
    <>
    <div className="w-screen h-screen flex items-start justify-center relative">
      <img className="min-w-[1280px] min-h-[720px] w-[100vw] h-[90vh] " src="src/assets/backgroundImage.png" alt="slogan" />
      <div className='absolute flex justify-center items-center top-1/3 transform -translate-y-1/2 font-[700] text-[60px]'>AI가 먼저 알고 즉시 알려요.</div>
      <div className='absolute flex items-center justify-center top-[40%] transform  -translate-y-1/2 font-[700] text-[60px]'>더 안전한 길 우리와 함께</div>
    </div>
    </>
  )
}
