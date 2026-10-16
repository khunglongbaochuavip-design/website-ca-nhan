'use client';

import React from 'react';
import { DinoQuestQuestion, DinoQuestWorld } from '@/lib/dino-quest/types';

interface QuestionBannerProps {
  question: DinoQuestQuestion;
  world: DinoQuestWorld;
  score: number;
}

export default function QuestionBanner({ question, world, score }: QuestionBannerProps) {
  return (
    <div className="w-full bg-neutral-900/95 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 shadow-xl mb-3">
      {/* Top Header metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-neutral-800/80 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider text-[11px]">
            🌍 Màn {world.index}/10: {world.name}
          </span>
          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold text-[10px]">
            {question.domain}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Điểm hiện tại:</span>
          <span className="font-black text-emerald-400 text-sm">
            {score}/100
          </span>
        </div>
      </div>

      {/* Main Question Stem */}
      <p className="text-sm sm:text-base text-neutral-100 font-medium leading-relaxed font-sans">
        <span className="text-amber-400 font-bold mr-1.5 font-mono">Câu {world.index}:</span>
        {question.stem}
      </p>
    </div>
  );
}
