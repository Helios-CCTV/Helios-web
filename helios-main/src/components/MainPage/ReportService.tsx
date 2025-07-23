 import React from 'react'
 
 
export default function ReportService() {
   return (
     <>
     <div className='w-full h-screen text-[35px] font-[700] flex pt-[10vh] justify-center pb-[10vh] items-center gap-[10vw]'>
        

        {/* 제목 섹션 */}
        <div>
          <div className='text-blue-400 font-[700] text-[25px]'>사용자 신고 서비스</div>
          <div className='text-[35px] pt-[2vh]'>불편했던 도로</div>
          <div className='text-[35px] pt-[2vh]'>참여형 신고 서비스로</div>
          <div className='text-[35px] pt-[2vh]'>해소하기</div>
        </div>
        
        {/* 섹션 모음 */}
        <div className='flex font-[700] text-[20px] flex-col justify-center items-center gap-[10vh]'>
          
          {/* 상단 섹션 */}
          <div className='flex justify-between items-center gap-[5.8vw]'>  
            {/* 신고 섹션 */}
            <div className='flex flex-col items-start gap-0'>
              <img className='p-0 m-0 w-[100px] h-[120px]' src="src/assets/mainPage/DangerSiren.png" alt="Siren" />

              <div>직접 신고하기</div>
              
              <div className='text-[15px] text-gray-500'>
                <div>사용자가 도로의 위험을 직접 신고해서</div>
                <div>더 좋은 데이터를 제공해주세요</div>  
              </div>
            </div>


            {/* 파손 위치 섹션 */}
            <div>
              <img className='p-0 m-0 w-[160px] h-[120px]' src="src/assets/mainPage/CloudUpload.png" alt="CloudUpload" />


              <div>파손 위치 알려주기</div>

              <div className='text-[15px] text-gray-500'>
                <div>정확한 데이터를 위해 파손의 위치와</div>
                <div>이미지를 같이 제공해주세요.</div>
              </div>
            </div>
          </div>
          
          {/* 하단 섹션 */}
          <div className='flex gap-[5vw] justify-between items-end'>
            
            {/* 상세 섹션 */}
            <div>
              <img className='p-0 m-0 w-[160px] h-[120px]' src="src/assets/mainPage/Document.png" alt="Document" />

              <div>상세하게 작성하기</div>

              <div className='text-[15px] text-gray-500'>
                <div>파손 도로의 위치와 시간, 파손 정도를</div>
                <div>알려주세요. 정확할수록 더 빠르게 처리</div>
                <div>할 수 있어요.</div>
              </div>

            </div>

            {/* 신고 접수 섹션 */}
            <div>
              <img className='p-0 m-0 w-[120px] h-[120px]' src="src/assets/mainPage/CheckDocument.png" alt="CheckDocument" />

              <div>신고 접수</div>


              <div className='text-[15px] text-gray-500'>
                <div>신고 내용을 확인 후 연락드릴게요.</div>
                <div>접수된 내용과 확인 결과, 향후 진행에</div>
                <div>대해 자세히 알려드릴게요.</div>
              </div>
            </div>
            </div>

        </div>
     </div>
     </>
   )
 }