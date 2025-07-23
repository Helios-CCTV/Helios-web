import React from 'react'

export default function DetectionResult() {
  return (
    <>
    <div className='w-full h-screen text-[35px] flex flex-col justify-center items-center'>
        <div className='text-blue-400 font-[700] text-[25px] pt-[8vh]'>탐지 기록 보기</div>
        


        <div className='flex flex-col gap-[5vh] justify-center items-center'>
        
            <div className='font-[700] text-[35px] flex flex-col justify-center items-center'>
                AI가 탐지한 결과를 모아봤어요.
            </div>

            <div className='flex justify-center items-center gap-[5vw]'>
                <div className='font-[700] text-[15px] text-gray-600 '>
                    <div>현재 도로가</div>
                    <div>얼마나 위험한지</div>
                    <div>판단해요.</div>
                </div>
                
                <img className='w-[550px] h-[400px]' src="src/assets/mainPage/DetectionResultImage.png" alt="map" />
            
                <div className='font-[700] text-[15px] text-gray-600 h-[35vh]'>
                    <div>도로 속 위험을 AI가</div>
                    <div>찾아서 알려줘요</div>
                </div>
            </div>
            



            <div className='font-[700] text-[25px] flex flex-col justify-center items-center'>
                <div>처음 사용하는 사용자도 이해할 수 있게,</div>
                <div>쉽고 빠르게 탐지 결과를 확인해봐요.</div>
            </div>
            
        </div>
        

    </div>

    </>
  )
}