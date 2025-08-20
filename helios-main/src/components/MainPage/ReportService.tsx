export default function ReportService() {
  return (
    <>
      <div className="w-full h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-20 flex justify-center items-center">
        <div className="max-w-7xl mx-auto px-8 flex gap-20 items-center mt-10">
          {/* 좌측 제목 섹션 */}
          <div className="flex-shrink-0 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-full text-lg font-[700] mb-8 shadow-sm">
              사용자 신고 서비스
            </div>

            <div className="font-[900] text-4xl lg:text-5xl text-gray-800 leading-tight mb-6">
              <div>불편했던 도로</div>
              <div className="text-orange-600 mt-2">참여형 신고 서비스로</div>
              <div className="mt-2">해소하기</div>
            </div>

            <div className="text-lg text-gray-700 font-[700] leading-relaxed mb-4">
              시민 여러분의 적극적인 참여로{" "}
              <span className="block sm:inline">
                더 안전한 도로를 만들어가요
              </span>
            </div>
          </div>

          {/* 우측 기능 카드 섹션 */}
          <div className="flex-1 hidden md:flex">
            <div className="grid grid-cols-2 gap-8">
              {/* 상단 좌측 - 직접 신고하기 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative mb-6">
                  <img
                    className="w-24 h-28 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
                    src="/assets/mainPage/DangerSiren.png"
                    alt="Siren"
                  />
                </div>

                <div className="text-center">
                  <div className="font-[700] text-xl text-gray-800 mb-3">
                    직접 신고하기
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <div>사용자가 도로의 위험을 직접 신고해서</div>
                    <div className="text-red-600 font-[600]">
                      더 좋은 데이터를 제공해주세요
                    </div>
                  </div>
                </div>
              </div>

              {/* 상단 우측 - 파손 위치 알려주기 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative mb-6">
                  <img
                    className="w-32 h-28 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
                    src="/assets/mainPage/CloudUpload.png"
                    alt="CloudUpload"
                  />
                </div>

                <div className="text-center">
                  <div className="font-[700] text-xl text-gray-800 mb-3">
                    파손 위치 알려주기
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <div>정확한 데이터를 위해 파손의 위치와</div>
                    <div className="text-blue-600 font-[600]">
                      이미지를 같이 제공해주세요.
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 좌측 - 상세하게 작성하기 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative mb-6">
                  <img
                    className="w-32 h-28 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
                    src="/assets/mainPage/Document.png"
                    alt="Document"
                  />
                </div>

                <div className="text-center">
                  <div className="font-[700] text-xl text-gray-800 mb-3">
                    상세하게 작성하기
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <div>파손 도로의 위치와 시간, 파손 정도를</div>
                    <div className="text-green-600 font-[600]">
                      알려주면 더 빠르게 처리 할 수 있어요.
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 우측 - 신고 접수 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative mb-6">
                  <img
                    className="w-28 h-28 mx-auto object-contain group-hover:scale-110 transition-transform duration-300"
                    src="/assets/mainPage/CheckDocument.png"
                    alt="CheckDocument"
                  />
                </div>

                <div className="text-center">
                  <div className="font-[700] text-xl text-gray-800 mb-3">
                    신고 접수
                  </div>

                  <div className="text-sm text-gray-600 leading-relaxed">
                    <div>신고 내용을 확인 후 연락드릴게요.</div>
                    <div>접수된 내용을 자세히 검토한 후</div>
                    <div className="text-purple-600 font-[600]">
                      향후 진행에 대해 자세히 알려드릴게요.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
