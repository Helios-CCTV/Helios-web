import React, { useState } from "react";

export default function DetectionHistoryNextButton() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 42; // 총 페이지 수 (더미 데이터)
  const totalItems = 2303; // 총 아이템 수
  const itemsPerPage = 20; // 페이지당 아이템 수

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
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* 현재 페이지 정보 */}
            <div className="text-sm text-gray-600">
              <span className="font-[600] text-gray-800">
                {((currentPage - 1) * itemsPerPage + 1).toLocaleString()}
              </span>
              {" - "}
              <span className="font-[600] text-gray-800">
                {Math.min(
                  currentPage * itemsPerPage,
                  totalItems
                ).toLocaleString()}
              </span>
              <span> / </span>
              <span className="font-[600] text-gray-800">
                {totalItems.toLocaleString()}
              </span>
              <span>개 결과</span>
            </div>

            {/* 페이지네이션 버튼들 */}
            <div className="flex items-center gap-2">
              {/* 처음 페이지로 버튼 */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-[500] text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>⏮️</span>
                <span className="hidden sm:inline">처음</span>
              </button>

              {/* 이전 페이지 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-[500] text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>◀️</span>
                <span className="hidden sm:inline">이전</span>
              </button>

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

              {/* 다음 페이지 버튼 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-[500] text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">다음</span>
                <span>▶️</span>
              </button>

              {/* 마지막 페이지로 버튼 */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-[500] text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="hidden sm:inline">마지막</span>
                <span>⏭️</span>
              </button>
            </div>

            {/* 페이지 점프 기능 */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">페이지 이동:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                  }
                }}
                className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">/ {totalPages}</span>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
}
