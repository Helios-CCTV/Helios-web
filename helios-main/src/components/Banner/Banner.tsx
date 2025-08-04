import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Banner() {
  const navigate = useNavigate();

  return (
    <>
      <div className='fixed top-0 left-0 w-full h-[60px] z-50 flex bg-white justify-between px-[11.8vw] py-[0.3vh] shadow-md border-b border-gray-300'>
        <div className='flex'>
          <img className='size-[50px]' src="src/assets/logo.png" alt="logo" />
          <div className='font-[700] text-[20px] flex justify-center items-center'>Helios</div>
        </div>
        
        <div className='flex gap-[8vw] font-[600] text-[15px] text-neutral-500 justify-center items-center'>
          <button onClick={() => navigate('/MapPage')}>cctv현황</button>
          <button>탐지기록</button>
          <button>신고하기</button>
        </div>

        
      </div>

    </>
  )
}
