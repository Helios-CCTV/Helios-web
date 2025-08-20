import React, { useState } from "react";

export default function ReportPageContent() {
  const [formData, setFormData] = useState({
    damageType: "",
    location: "",
    description: "",
    severity: "",
    contactName: "",
    contactPhone: "",
    photos: [],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("신고가 접수되었습니다. 빠른 시일 내에 처리하겠습니다.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 배너 영역 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-800 py-16 mt-15">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">도로 파손 신고</h1>
          <p className="text-xl opacity-90">
            안전한 도로를 위해 파손된 도로를 신고해 주세요
          </p>
        </div>
      </div>

      {/* 신고 폼 영역 */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* 폼 헤더 */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">신고 정보 입력</h2>
            <p className="text-gray-600 mt-2">
              정확한 정보를 입력해 주시면 빠른 처리가 가능합니다
            </p>
          </div>

          {/* 폼 내용 */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* 파손 유형 선택 */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                파손 유형 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "포트홀",
                  "균열",
                  "침하",
                  "함몰",
                  "시공균열",
                  "거북등",
                  "쇼빙",
                  "기타",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleInputChange("damageType", type)}
                    className={`p-4 rounded-xl border-2 transition-all font-medium ${
                      formData.damageType === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 위치 정보 */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                발생 위치 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="예: 강남구 테헤란로 123번길 앞"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-600 font-medium"
                  onClick={() => alert("지도에서 위치 선택 기능")}
                >
                  📍
                </button>
              </div>
            </div>

            {/* 심각도 선택 */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                심각도 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    value: "low",
                    label: "경미",
                    color: "green",
                    desc: "작은 균열, 표면 손상",
                  },
                  {
                    value: "medium",
                    label: "보통",
                    color: "yellow",
                    desc: "피해가 발생할 수 있는 크기",
                  },
                  {
                    value: "high",
                    label: "심각",
                    color: "red",
                    desc: "사고가 발생할 수 있는 크기",
                  },
                ].map((severity) => (
                  <button
                    key={severity.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("severity", severity.value)
                    }
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.severity === severity.value
                        ? `border-${severity.color}-500 bg-${severity.color}-50`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      {severity.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {severity.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                상세 설명
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="파손 상황을 자세히 설명해 주세요 (선택사항)"
                rows={4}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* 사진 업로드 */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                사진 첨부
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <div className="text-4xl mb-4">📷</div>
                <p className="text-gray-600 mb-2">
                  사진을 드래그하거나 클릭해서 업로드
                </p>
                <p className="text-sm text-gray-500">
                  최대 5장까지 업로드 가능 (JPG, PNG)
                </p>
                <button
                  type="button"
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => alert("사진 업로드 기능")}
                >
                  사진 선택
                </button>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                연락처 정보 (선택)
              </h3>
              <p className="text-sm text-gray-600">
                처리 결과를 알려드리기 위한 연락처입니다
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                  placeholder="이름"
                  className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    handleInputChange("contactPhone", e.target.value)
                  }
                  placeholder="연락처"
                  className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={
                  !formData.damageType ||
                  !formData.location ||
                  !formData.severity
                }
                className="w-full py-4 bg-blue-500 text-white text-lg font-semibold rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                신고 접수하기
              </button>
              <p className="text-sm text-gray-500 text-center mt-3">
                신고 접수 후 24시간 이내에 검토 결과를 알려드립니다
              </p>
            </div>
          </form>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">빠른 처리</h3>
            <p className="text-sm text-gray-600">
              신고 접수 후 검토 및 처리를 진행합니다.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-2">개인정보 보호</h3>
            <p className="text-sm text-gray-600">
              입력하신 개인정보는 신고 처리 목적으로만 사용됩니다
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-800 mb-2">실시간 알림</h3>
            <p className="text-sm text-gray-600">
              처리 진행 상황을 문자나 앱 알림으로 실시간 확인 가능합니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
