import React from 'react'



export default function RoadInsightPanel() {
  return (
    <>
      <div className='flex w-[24vw] h-[56vh] z-50 absolute mt-[124px] ml-[24px] bg-zinc-50 justify-center rounded-xl shadow-lg'>
        <div className='flex flex-col items-center w-full px-4'>
          <div className='relative flex items-center w-full h-[4.8vh] mt-[24px]'>
            <input
              className='w-full h-full bg-white border border-neutral-300 rounded-full pl-[16px] pr-[36px] placeholder:text-gray-400'
              placeholder='주소를 입력해주세요.'
            />
            <button className='absolute right-3 top-1/2 transform -translate-y-1/2' onClick={() => alert('검색 기능은 아직 구현되지 않았습니다.')}>
              <img className='w-[1.5vw] h-[1.5vw]' src="src/assets/livePage/glasses.png" alt="검색" />
            </button>
          </div>

          <div className='flex justify-between mt-4 w-full'>
            <div className='border rounded-full px-4 py-1 border-black'>위험</div>
            <div className='border rounded-full px-4 py-1 border-black'>주의</div>
            <div className='border rounded-full px-4 py-1 border-black'>안전</div>
          </div>

          <div className='bg-white border rounded-xl border-neutral-300 mt-6 p-4 w-full'>
            <div className='font-bold mb-4'>현재 파손도로 순위</div>
            <ul className='space-y-3'>
              <li>1. 영동고속도로 ..</li>
              <li>1. 영동고속도로 ..</li>
              <li>1. 영동고속도로 ..</li>
              <li>1. 영동고속도로 ..</li>
              <li>1. 영동고속도로 ..</li>
            </ul>
          </div>
        </div>
        
        
      </div>
      
    </>
  )
}