import React from 'react'

export default function ViewStatus() {
  return (
  // CCTV 현황을 볼 수 있습니다.
  <div className='w-full h-screen pt-[15vh] text-[35px] flex flex-col gap-[15vh] justify-center items-center'>
      <div className='flex gap-[10vw] justify-center items-center'>
        <div className='font-[700] text-[35px] flex flex-col'>
          <div>
            <div>전국의 CCTV를 쉽고 빠르게</div>
            <div>찾아볼 수 있게</div>
          </div>
          
          
          <div className='pt-[1vh] text-[20px] font-[600] flex flex-col'>
            <div>보기 어려웠던 기존의 CCTV 제공 사이트보다 쉽고 빠르게</div>
            <div>볼 수 있는 서비스를 제공해요</div>
          </div>

        </div>

        <img className='w-[270px] h-[200px]' src="src/assets/mainPage/mainPageMapImage.png" alt="map" />
      </div>


      <div className='flex gap-[10vw] justify-center items-center'>
        <img className='w-[270px] h-[200px]' src="src/assets/mainPage/mainPageDangerImage.png" alt="danger" />
        <div className='font-[700] text-[35px] flex flex-col'>
          <div>
            <div>파손된 도로를 AI가 찾아</div>
            <div>알려줘요.</div>
          </div>
          
          <div className='pt-[1vh] text-[20px] font-[600] flex flex-col'>
            <div>전국의 도로를 AI가 분석해 파손 유형과 파손 위치를 분석 해요.</div>
            <div>분석한 결과는 사용자가 볼 수 있게 시각적으로 표현합니다.</div>
          </div>
        </div>
      </div>
    </div>
  )
}