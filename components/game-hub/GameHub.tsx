'use client';

import React, { useState } from 'react';
import DinoGame from '@/components/dino-exam/DinoGame';
import DinoQuestGame from '@/components/dino-quest/DinoQuestGame';

export type ActiveGameType = 'hub' | 'dino-runner' | 'dino-quest';

export default function GameHub() {
  const [activeGame, setActiveGame] = useState<ActiveGameType>('hub');
  const [placeholderModal, setPlaceholderModal] = useState<{ title: string; desc: string } | null>(null);

  // If a game is active, render that game module directly
  if (activeGame === 'dino-runner') {
    return (
      <div className="w-full animate-fadeIn">
        <DinoGame onBackToHub={() => setActiveGame('hub')} />
      </div>
    );
  }

  if (activeGame === 'dino-quest') {
    return (
      <div className="w-full animate-fadeIn">
        <DinoQuestGame onBackToHub={() => setActiveGame('hub')} />
      </div>
    );
  }

  // GAME HUB SELECTION MENU
  return (
    <div className="w-full bg-neutral-950 border-4 border-neutral-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Hub Section */}
      <div className="pb-4 mb-5 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              ARCADE KHẢO THÍ
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono flex items-center gap-2">
            <span>GAME KHẢO THÍ</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-0.5">
            Khám phá kiến thức qua những trò chơi tương tác.
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-mono text-neutral-500">
            Hệ sinh thái EdTech • Hữu Tài Genz
          </span>
        </div>
      </div>

      {/* 4 Large Game Cards Grid: 2 Columns × 2 Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CARD 1: DINO EXAM RUNNER */}
        <div
          id="card-dino-runner"
          onClick={() => setActiveGame('dino-runner')}
          className="group relative rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-emerald-500/60 p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between"
        >
          {/* Card Top / Visual Banner */}
          <div className="mb-4">
            <div className="h-32 w-full rounded-xl bg-gradient-to-tr from-emerald-950/80 via-neutral-900 to-emerald-900/40 border border-emerald-500/30 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-emerald-400 transition-colors">
              {/* Mini Pixel Dinosaur Silhouette & Gates */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                  V2.1 • RUNNER
                </span>
                <span className="text-neutral-400 text-[10px]">40 NHẬN ĐỊNH</span>
              </div>

              <div className="flex items-center justify-center gap-4 my-auto">
                <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition-transform">
                  🦖
                </span>
                <div className="text-center font-mono">
                  <span className="text-[10px] text-emerald-400 font-bold block">[ ↑ NHẢY ] ĐÚNG</span>
                  <span className="text-[10px] text-rose-400 font-bold block">[ KHÔNG NHẢY ] SAI</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>⏱️ 7s Đọc Đề</span>
                <span>🏆 100 Điểm</span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors font-mono">
                DINO EXAM RUNNER
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
                SẴN SÀNG
              </span>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-4">
              40 nhận định Đúng/Sai. Chạy, nhảy và chinh phục Khảo thí.
            </p>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs font-mono shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>VÀO CHƠI NGAY</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* CARD 2: DINO QUEST: 4 CÁNH CỬA */}
        <div
          id="card-dino-quest"
          onClick={() => setActiveGame('dino-quest')}
          className="group relative rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 hover:border-amber-500/60 p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
        >
          {/* Card Top / Visual Banner */}
          <div className="mb-4">
            <div className="h-32 w-full rounded-xl bg-gradient-to-tr from-amber-950/80 via-neutral-900 to-amber-900/40 border border-amber-500/30 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px]">
                  V1.0 • ADVENTURE
                </span>
                <span className="text-neutral-400 text-[10px]">10 VÙNG ĐẤT</span>
              </div>

              {/* 4 Glowing Doors Illustration */}
              <div className="flex items-center justify-center gap-2.5 my-auto">
                <div className="flex items-center gap-1 text-center font-mono">
                  {['A', 'B', 'C', 'D'].map((d) => (
                    <div
                      key={d}
                      className="w-7 h-11 rounded-t-md bg-neutral-950 border border-amber-400/60 flex items-center justify-center text-[11px] font-bold text-amber-300 shadow-sm"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <span className="text-2xl filter drop-shadow group-hover:scale-110 transition-transform">
                  🦖
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                <span>🚪 Tứ Đại Cánh Cửa</span>
                <span>👑 100 Điểm</span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-base font-extrabold text-white group-hover:text-amber-400 transition-colors font-mono">
                DINO QUEST: 4 CÁNH CỬA
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold tracking-wider uppercase">
                SẴN SÀNG
              </span>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-4">
              10 vùng đất. 4 cánh cửa. Chỉ một lựa chọn đúng.
            </p>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs font-mono shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>VÀO THÁM HIỂM</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* CARD 3: DINO MATCH (Placeholder) */}
        <div
          id="card-dino-match"
          onClick={() =>
            setPlaceholderModal({
              title: 'DINO MATCH — GHÉP THUẬT NGỮ KHẢO THÍ',
              desc: 'Trò chơi trắc nghiệm ghép nối khái niệm và thuật ngữ khảo thí (CTT, IRT, Reliability, Validity) đang được thiết kế và kiểm thử. Dự kiến ra mắt trong phiên bản sắp tới!',
            })
          }
          className="group relative rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-4 sm:p-5 transition-all duration-300 hover:border-neutral-700 cursor-pointer flex flex-col justify-between opacity-85 hover:opacity-100"
        >
          <div className="mb-4">
            <div className="h-32 w-full rounded-xl bg-neutral-950/80 border border-neutral-800 p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[10px]">
                  PUZZLE MATCH
                </span>
                <span className="text-neutral-500 text-[10px]">SẮP RA MẮT</span>
              </div>

              <div className="flex items-center justify-center gap-3 my-auto">
                <span className="text-2xl opacity-60">🧩</span>
                <div className="text-center font-mono text-[11px] text-neutral-400">
                  <span>[ Thuật Ngữ ] ⟷ [ Định Nghĩa ]</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>🔗 Ghép Cặp Khảo Thí</span>
                <span>⏳ Sắp Hoàn Thiện</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-base font-extrabold text-neutral-300 font-mono">
                DINO MATCH
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-mono font-semibold tracking-wider uppercase">
                SẮP RA MẮT
              </span>
            </div>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
              Nối thuật ngữ và khái niệm khảo thí tương ứng.
            </p>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs font-mono transition-all flex items-center justify-center gap-1.5"
            >
              <span>CHI TIẾT DỰ ÁN</span>
            </button>
          </div>
        </div>

        {/* CARD 4: GAME THỨ TƯ (CAT RUNNER - Adaptive Exam) */}
        <div
          id="card-cat-runner"
          onClick={() =>
            setPlaceholderModal({
              title: 'CAT RUNNER — KHẢO THÍ THÍCH ỨNG',
              desc: 'Hệ thống mô phỏng kiểm tra thích ứng trên máy tính (Computerized Adaptive Testing - CAT) dựa trên mô hình IRT 3PL đang được đội ngũ nghiên cứu xây dựng. Hãy cùng đón chờ!',
            })
          }
          className="group relative rounded-2xl bg-neutral-900/60 border border-neutral-800/80 p-4 sm:p-5 transition-all duration-300 hover:border-neutral-700 cursor-pointer flex flex-col justify-between opacity-85 hover:opacity-100"
        >
          <div className="mb-4">
            <div className="h-32 w-full rounded-xl bg-neutral-950/80 border border-neutral-800 p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 text-[10px]">
                  CAT SIMULATOR
                </span>
                <span className="text-neutral-500 text-[10px]">SẮP RA MẮT</span>
              </div>

              <div className="flex items-center justify-center gap-3 my-auto">
                <span className="text-2xl opacity-60">📈</span>
                <div className="text-center font-mono text-[11px] text-neutral-400">
                  <span>θ Năng Lực ⟷ b Độ Khó</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>🎯 Thuật Toán IRT CAT</span>
                <span>⏳ Đang Nghiên Cứu</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-base font-extrabold text-neutral-300 font-mono">
                CAT RUNNER
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 text-[10px] font-mono font-semibold tracking-wider uppercase">
                SẮP RA MẮT
              </span>
            </div>

            <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
              Khảo thí thích ứng trên máy tính phân loại năng lực thí sinh.
            </p>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs font-mono transition-all flex items-center justify-center gap-1.5"
            >
              <span>CHI TIẾT DỰ ÁN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder Modal for Upcoming Games */}
      {placeholderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-center">
            <span className="text-4xl mb-3 inline-block">🚀</span>
            <span className="px-3 py-1 rounded-full bg-neutral-800 text-amber-300 border border-neutral-700 text-[11px] font-mono font-bold tracking-widest uppercase block w-fit mx-auto mb-3">
              DỰ ÁN ĐANG PHÁT TRIỂN
            </span>
            <h3 className="text-lg font-bold text-white mb-2 font-mono">
              {placeholderModal.title}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6 font-sans">
              {placeholderModal.desc}
            </p>
            <button
              type="button"
              onClick={() => setPlaceholderModal(null)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Đã Hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
