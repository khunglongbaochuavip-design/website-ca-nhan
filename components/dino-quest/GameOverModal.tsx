'use client';

import React from 'react';
import { DinoQuestQuestion, QuestChoice, WrongAnimal, DinoQuestWorld } from '@/lib/dino-quest/types';

interface GameOverModalProps {
  question: DinoQuestQuestion;
  world: DinoQuestWorld;
  chosenOption: QuestChoice | null;
  wrongAnimal: WrongAnimal | null;
  score: number;
  onRetry: () => void;
  onBackToHub: () => void;
}

const ANIMAL_NAMES: { [key in WrongAnimal]: { name: string; emoji: string; desc: string } } = {
  crocodile: {
    name: 'Cá Sấu Tinh Nghịch',
    emoji: '🐊',
    desc: 'Một chú cá sấu nhảy xổ ra từ cánh cửa và cắn yêu vào đuôi T-Rex!',
  },
  hippo: {
    name: 'Hà Mã Ngáp Ngủ',
    emoji: '🦛',
    desc: 'Chú hà mã to béo há miệng ngáp một cái khiến T-Rex giật mình ngã ngửa!',
  },
  capybara: {
    name: 'Capybara Điềm Tĩnh',
    emoji: '🍊',
    desc: 'Capybara đội quả cam trên đầu, bình thản giơ biển "Sai rồi bạn ơi!" làm T-Rex đứng hình!',
  },
};

export default function GameOverModal({
  question,
  world,
  chosenOption,
  wrongAnimal,
  score,
  onRetry,
  onBackToHub,
}: GameOverModalProps) {
  const animalInfo = wrongAnimal ? ANIMAL_NAMES[wrongAnimal] : ANIMAL_NAMES.crocodile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border-2 border-red-500/50 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col justify-between">
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="overflow-y-auto pr-1">
          {/* Top Banner */}
          <div className="text-center pb-4 mb-4 border-b border-neutral-800">
            <span className="text-4xl sm:text-5xl mb-2 inline-block animate-bounce">
              {animalInfo.emoji}
            </span>
            <span className="block px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold tracking-widest uppercase w-fit mx-auto mb-2">
              BÍ ẨN CÁNH CỬA — KẾT THÚC HÀNH TRÌNH
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Cánh Cửa Không Chính Xác!
            </h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
              {animalInfo.desc}
            </p>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 text-center">
              <span className="text-[11px] font-mono text-neutral-400 uppercase block">Vùng đất dừng chân</span>
              <span className="text-lg font-bold text-amber-300 font-mono">
                {world.index}/10 ({world.name})
              </span>
            </div>
            <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 text-center">
              <span className="text-[11px] font-mono text-neutral-400 uppercase block">Điểm số tích lũy</span>
              <span className="text-lg font-black text-emerald-400 font-mono">
                {score}/100
              </span>
            </div>
          </div>

          {/* Question & Choices Review */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs space-y-3 mb-4 font-sans">
            <div>
              <span className="font-mono text-[11px] text-amber-400 font-bold block mb-1">
                CÂU HỎI MÀN {world.index} ({question.domain}):
              </span>
              <p className="text-neutral-200 leading-relaxed font-medium">
                {question.stem}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-800/80">
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30">
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">
                  Lựa chọn của bạn: Cửa {chosenOption || '?'}
                </span>
                <p className="text-neutral-300 text-[11px] mt-0.5 line-clamp-2">
                  {chosenOption ? question.options[chosenOption] : 'Chưa chọn'}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                  Cửa đúng: Cửa {question.correctOption}
                </span>
                <p className="text-neutral-300 text-[11px] mt-0.5 line-clamp-2">
                  {question.options[question.correctOption]}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-[11px] font-mono text-sky-400 font-bold uppercase block mb-1">
                💡 GIẢI THÍCH KHOA HỌC:
              </span>
              <p className="text-neutral-300 text-xs leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-neutral-800">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>Chinh Phục Lại Từ Đầu</span>
          </button>

          <button
            type="button"
            onClick={onBackToHub}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>Game Khảo Thí</span>
          </button>
        </div>
      </div>
    </div>
  );
}
