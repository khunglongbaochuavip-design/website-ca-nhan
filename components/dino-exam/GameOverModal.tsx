'use client';

import React from 'react';
import { DinoQuestionV2, DinoChoice } from '@/lib/dino-exam/types';

interface GameOverModalProps {
  question: DinoQuestionV2;
  chosenAction: DinoChoice | null;
  score: number;
  questionIndex: number;
  totalQuestions: number;
  onRetry: () => void;
}

export default function GameOverModal({
  question,
  chosenAction,
  score,
  questionIndex,
  totalQuestions,
  onRetry,
}: GameOverModalProps) {
  const chosenText = chosenAction === 'JUMP' ? 'ĐÚNG (Nhảy ↑)' : chosenAction === 'RUN' ? 'SAI (Không nhảy →)' : 'Chưa kịp thao tác';
  const correctText = question.correctChoice === 'JUMP' ? 'ĐÚNG (Nhảy ↑)' : 'SAI (Không nhảy →)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-900 border-2 border-red-500/60 rounded-3xl p-5 sm:p-7 text-white shadow-2xl text-center relative">
        {/* Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-32 bg-red-600/30 blur-3xl pointer-events-none rounded-full" />

        {/* Dinosaur crash icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
          💥
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 font-sans">
          VẤP NGÃ TRÊN ĐƯỜNG ĐUA!
        </h2>

        <p className="text-sm text-neutral-400 mb-6">
          Bạn đã dừng bước tại câu <span className="font-bold text-neutral-200">{questionIndex + 1}/{totalQuestions}</span>. Hãy đọc giải thích bên dưới để rút kinh nghiệm!
        </p>

        {/* Score achieved badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-mono mb-6">
          <span className="text-neutral-400">Điểm số đạt được:</span>
          <span className="font-bold text-amber-400 text-base">{score.toFixed(1).replace(/\.0$/, '')} / 100 Điểm</span>
        </div>

        {/* Question Review Card */}
        <div className="bg-neutral-950/90 rounded-2xl p-4 sm:p-5 border border-neutral-800 text-left mb-6 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                {question.domain}
              </span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded">
                Nhận định
              </span>
            </div>
            <p className="font-semibold text-neutral-100 text-sm leading-snug">
              {question.statement || question.stem}
            </p>
          </div>

          <div className="text-xs space-y-2 pt-2 border-t border-neutral-800">
            <div className="flex items-start gap-2 text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-900/40">
              <span className="font-bold shrink-0">❌ Bạn đã chọn:</span>
              <span className="font-mono font-bold">{chosenText}</span>
            </div>
            <div className="flex items-start gap-2 text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/40">
              <span className="font-bold shrink-0">✅ Đáp án chính xác:</span>
              <span className="font-mono font-bold">{correctText}</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-400">💡 Giải thích chuyên môn: </span>
            {question.explanation}
          </div>
        </div>

        {/* Retry Button */}
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-base shadow-lg shadow-red-900/40 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          🔄 Thử Lại Ngay (Chinh Phục Lại)
        </button>
      </div>
    </div>
  );
}
