'use client';

import React from 'react';
import { QuestChoice, DinoQuestQuestion } from '@/lib/dino-quest/types';

interface DoorOptionsBarProps {
  question: DinoQuestQuestion;
  selectedChoice: QuestChoice | null;
  onSelect: (choice: QuestChoice) => void;
  disabled: boolean;
}

const CHOICES: { key: QuestChoice; label: string; numKey: string }[] = [
  { key: 'A', label: 'Cửa A', numKey: '1' },
  { key: 'B', label: 'Cửa B', numKey: '2' },
  { key: 'C', label: 'Cửa C', numKey: '3' },
  { key: 'D', label: 'Cửa D', numKey: '4' },
];

export default function DoorOptionsBar({
  question,
  selectedChoice,
  onSelect,
  disabled,
}: DoorOptionsBarProps) {
  return (
    <div className="w-full mt-3">
      {/* Header prompt instruction */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2 px-1">
        <span>Chọn 1 trong 4 cánh cửa để tiến vào vùng đất tiếp theo:</span>
        <span className="hidden sm:inline text-neutral-500">
          Phím tắt: <b className="text-amber-400">1, 2, 3, 4</b> hoặc <b className="text-amber-400">A, B, C, D</b>
        </span>
      </div>

      {/* 4 Cards Grid - Synchronized with the 4 Canvas Doors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {CHOICES.map(({ key, label, numKey }) => {
          const isSelected = selectedChoice === key;
          const optionText = question.options[key];

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(key)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group ${
                isSelected
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'bg-neutral-900/90 border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800/90'
              } ${disabled ? 'opacity-80 cursor-default' : 'cursor-pointer hover:scale-[1.01]'}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black font-mono shadow-sm ${
                    isSelected
                      ? 'bg-amber-400 text-black'
                      : 'bg-neutral-800 text-amber-300 group-hover:bg-amber-400 group-hover:text-black transition-colors'
                  }`}
                >
                  {key}
                </span>

                <span className="text-[11px] font-mono text-neutral-500 group-hover:text-neutral-400">
                  Phím [{numKey}]
                </span>
              </div>

              <p className="text-xs sm:text-[13px] leading-snug line-clamp-4 font-sans font-medium text-neutral-200">
                {optionText}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
