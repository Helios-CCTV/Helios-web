import React, { useState } from "react";

export default function DetectionHistoryNextButton() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 42; // 총 페이지 수 (더미 데이터)

  // 페이지 범위 계산 (현재 페이지 기준 앞뒤로 2페이지씩 표시)
  const getPageRange = () => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 실제 구현에서는 여기서 API 호출이나 데이터 페칭을 수행
      console.log(`페이지 ${page}로 이동`);
    }
  };

  return (
    <>
      {/* 페이지네이션 컨테이너 */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* 페이지 정보 표시 */}
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
            {/* 페이지네이션 버튼들 */}
            <div className="flex items-center gap-2">
              {/* 페이지 번호 버튼들 */}
              <div className="flex items-center gap-1">
                {/* 첫 페이지와 현재 페이지 범위 사이에 간격이 있을 때 */}
                {getPageRange()[0] > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-sm font-[500] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      1
                    </button>
                    {getPageRange()[0] > 2 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                  </>
                )}

                {/* 현재 페이지 범위의 페이지 번호들 */}
                {getPageRange().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-[600] transition-colors ${
                      page === currentPage
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* 마지막 페이지와 현재 페이지 범위 사이에 간격이 있을 때 */}
                {getPageRange()[getPageRange().length - 1] < totalPages && (
                  <>
                    {getPageRange()[getPageRange().length - 1] <
                      totalPages - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-sm font-[500] text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
