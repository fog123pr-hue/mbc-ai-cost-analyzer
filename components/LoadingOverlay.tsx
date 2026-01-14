
import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold text-slate-800">AI가 견적을 분석 중입니다...</h2>
      <p className="text-slate-500 mt-2">시장 데이터와 제작 파라미터를 대조하고 있습니다.</p>
    </div>
  );
};

export default LoadingOverlay;
