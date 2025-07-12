import React from 'react'


export default function Banner() {
  return (
    <div className='flex justify-between px-[11.8vw] py-[13px]'>
      <div className='flex'>
        <img className='size-[50px]' src="src/assets/logo.png" alt="logo" />
        <div className='font-[700] text-[30px] flex justify-center items-center'>Helios</div>
      </div>
      
      <div className='flex gap-[8vw] font-[700] text-[20px] text-neutral-500 justify-center items-center'>
        <div>cctv현황</div>
        <div>탐지기록</div>
        <div>신고하기</div>
      </div>
      
    </div>
  )
}
