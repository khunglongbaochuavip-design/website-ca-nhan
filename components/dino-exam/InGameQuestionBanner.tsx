'use client';

import React from 'react';
import { DinoQuestionV2, GameStateV2 } from '@/lib/dino-exam/types';

interface InGameQuestionBannerProps {
  question: DinoQuestionV2;
  questionIndex: number;
  totalQuestions: number;
  gameState: GameStateV2;
  readingTimeLeft: number; // in seconds (7s -> 0s)
}

export default function InGameQuestionBanner({
  question,
  questionIndex,
  totalQuestions,
  gameState,
  readingTimeLeft,
}: InGameQuestionBannerProps) {
  const isReading = gameState === 'READING';
  const isApproaching = gameState === 'APPROACHING' || gameState === 'DECISION';
  const isResolution = gameState === 'RESOLUTION';

  return (
    <div className="absolute top-2.5 left-2.5 right-2.5 z-10 bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 rounded-2xl p-2.5 sm:p-3.5 text-white shadow-xl transition-all select-none">
      {/* Top Header: Domain, Question Counter & Status */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
            {question.domain}
          </span>
          <span className="text-neutral-400 text-xs font-mono">
            Câu {questionIndex + 1}/{totalQuestions}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono font-bold uppercase">
            Nhận định ĐÚNG / SAI
          </span>
        </div>

        {/* Status indicator */}
        {isReading && (
          <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full text-xs font-mono text-amber-300 animate-pulse">
            <span>⏳ Đọc đề:</span>
            <span className="font-bold text-amber-400">{Math.ceil(readingTimeLeft)}s</span>
          </div>
        )}

        {isApproaching && (
          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-300 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>⚡ NHẢY = ĐÚNG (↑)  •  KHÔNG NHẢY = SAI</span>
          </div>
        )}

        {isResolution && (
          <div className="flex items-center gap-1.5 bg-sky-500/20 border border-sky-500/40 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-sky-300">
            <span>🎯 Đang chấm điểm...</span>
          </div>
        )}
      </div>

      {/* 7s Countdown Progress Bar */}
      {isReading && (
        <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100 ease-linear"
            style={{ width: `${Math.max(0, Math.min(100, (readingTimeLeft / 7) * 100))}%` }}
          />
        </div>
      )}

      {/* Question Statement */}
      <div className="min-h-[38px] flex items-center">
        <h3 className="text-xs sm:text-sm md:text-base font-bold font-sans text-neutral-100 leading-snug">
          {question.statement || question.stem}
        </h3>
      </div>
    </div>
  );
}
