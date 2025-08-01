import React from 'react'



export default function RoadInsightPanel() {
  return (
    <>
      <div className='flex w-[315px] h-full z-50 absolute mt-[7vh] bg-zinc-50 justify-center overflow-hidden'>
        <div className='flex flex-col items-center w-full px-4'>
          <div className='relative flex items-center w-full h-[4.8vh] mt-[24px]'>
            <input
              className='w-full h-full bg-white border border-neutral-300 rounded-full pl-[16px] pr-[36px] placeholder:text-gray-400'
              placeholder='주소를 입력해주세요.'
            />
            <button className='absolute right-3 top-1/2 transform -translate-y-1/2' onClick={() => alert('검색 기능은 아직 구현되지 않았습니다.')}>
              <img className='w-[14px] h-[17px]' src="src/assets/livePage/glasses.png" alt="검색" />
            </button>
          </div>

          <div className='flex gap-[25px] mt-4 w-full justify-center'>
            <div className='flex flex-row items-center justify-center w-auto h-[35px] px-[16px] py-[6px] border rounded-full gap-[6px] border-black'>
              <img className='w-[15px] h-[15px]' src="src/assets/livePage/danger.png" alt="위험" />
              <div className='font-[700] text-[12px]'>
                위험
              </div>
            </div>

            <div className='flex flex-row items-center justify-center w-auto h-[35px] px-[16px] py-[6px] border rounded-full gap-[6px] border-black'>
              <img className='w-[15px] h-[15px]' src="src/assets/livePage/warning.png" alt="주의" />
              <div className='font-[700] text-[12px]'>
                주의
              </div>
            </div>

            <div className='flex flex-row items-center justify-center w-auto h-[35px] px-[16px] py-[6px] border rounded-full gap-[6px] border-black'>
              <img className='w-[15px] h-[15px]' src="src/assets/livePage/normal.png" alt="안전" />
              <div className='font-[700] text-[12px]'>
                안전
              </div>
            </div>

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