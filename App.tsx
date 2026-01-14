
import React, { useState, useCallback } from 'react';
import { VideoStyle, Resolution, Urgency, ProductionParams, EstimationResult } from './types';
import { INITIAL_PARAMS, CURRENCY_SYMBOL } from './constants';
import { estimateProductionCost } from './services/geminiService';
import LoadingOverlay from './components/LoadingOverlay';
import CostChart from './components/CostChart';

function App() {
  const [params, setParams] = useState<ProductionParams>(INITIAL_PARAMS);
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const estimation = await estimateProductionCost(params);
      setResult(estimation);
    } catch (err) {
      console.error(err);
      setError('견적을 불러오는 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  return (
    <div className="min-h-screen pb-20">
      {loading && <LoadingOverlay />}
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              VisionaryAI
            </h1>
          </div>
          <div className="hidden md:block text-sm text-slate-500 font-medium">
            AI 기반 영상 제작 원가 계산기 v1.0
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Controls */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              제작 파라미터 설정
            </h2>

            <div className="space-y-5">
              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">제작 스타일</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={params.style}
                  onChange={(e) => setParams({...params, style: e.target.value as VideoStyle})}
                >
                  {Object.values(VideoStyle).map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              {/* Length Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">영상 길이 (초)</label>
                  <span className="text-sm font-bold text-blue-600">{params.lengthSeconds}s</span>
                </div>
                <input 
                  type="range" min="5" max="300" step="5"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={params.lengthSeconds}
                  onChange={(e) => setParams({...params, lengthSeconds: parseInt(e.target.value)})}
                />
              </div>

              {/* Complexity Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">제작 복잡도</label>
                  <span className="text-sm font-bold text-blue-600">Level {params.complexity}</span>
                </div>
                <input 
                  type="range" min="1" max="5" step="1"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={params.complexity}
                  onChange={(e) => setParams({...params, complexity: parseInt(e.target.value)})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">해상도</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={params.resolution}
                    onChange={(e) => setParams({...params, resolution: e.target.value as Resolution})}
                  >
                    {Object.values(Resolution).map(res => (
                      <option key={res} value={res}>{res}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">긴급도</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={params.urgency}
                    onChange={(e) => setParams({...params, urgency: e.target.value as Urgency})}
                  >
                    {Object.values(Urgency).map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={params.useAiTools}
                    onChange={(e) => setParams({...params, useAiTools: e.target.checked})}
                  />
                  <span className="text-sm text-slate-700 font-medium group-hover:text-blue-600 transition-colors">AI 제작 도구 활용 (비용 절감)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={params.hasScript}
                    onChange={(e) => setParams({...params, hasScript: e.target.checked})}
                  />
                  <span className="text-sm text-slate-700 font-medium group-hover:text-blue-600 transition-colors">이미 시나리오가 있음</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    checked={params.hasVoiceover}
                    onChange={(e) => setParams({...params, hasVoiceover: e.target.checked})}
                  />
                  <span className="text-sm text-slate-700 font-medium group-hover:text-blue-600 transition-colors">나레이션(성우) 포함</span>
                </label>
              </div>

              <button 
                onClick={handleCalculate}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                견적 산출하기
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        <section className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Total Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100 font-medium mb-1">총 예상 제작 원가</p>
                    <h3 className="text-4xl font-bold tracking-tight">
                      {formatCurrency(result.totalCost)}
                    </h3>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold border border-white/10">
                    약 {result.timelineDays}일 소요
                  </div>
                </div>
                
                <div className="mt-8 flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <div className="bg-emerald-400 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-900" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm">
                    AI 활용으로 약 <span className="font-bold">{formatCurrency(result.aiSavings)}</span> 수준의 비용이 절감되었습니다.
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">비용 구성비</h4>
                  <CostChart data={result.breakdown} />
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
                  <h4 className="text-sm font-semibold text-slate-800 mb-4 uppercase tracking-wider">항목별 상세 내역</h4>
                  <div className="space-y-4 flex-grow">
                    {result.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start border-b border-slate-50 pb-2">
                        <div className="max-w-[70%]">
                          <p className="text-sm font-semibold text-slate-700">{item.category}</p>
                          <p className="text-xs text-slate-500 leading-tight mt-1">{item.description}</p>
                        </div>
                        <span className="text-sm font-bold text-slate-800">{formatCurrency(item.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI 분석 리포트
                </h4>
                <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {result.analysis}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
              <div className="bg-slate-200/50 p-4 rounded-full mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">시작하려면 파라미터를 입력하세요</h3>
              <p className="text-slate-500 max-w-xs mx-auto">
                영상 스타일, 길이, 제작 요구사항을 설정하고 '견적 산출하기' 버튼을 눌러주세요.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer / CTA */}
      <footer className="mt-12 py-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
            Powered by Gemini 3 Flash & React
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
