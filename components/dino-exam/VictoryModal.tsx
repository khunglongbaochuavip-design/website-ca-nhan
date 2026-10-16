'use client';

import React, { useState } from 'react';
import { DinosaurCustomization } from '@/lib/dino-exam/types';
import { generateCertificateCanvas, downloadCertificate } from '@/lib/dino-exam/certificate';

interface VictoryModalProps {
  score: number;
  totalQuestions: number;
  customization: DinosaurCustomization;
  onPlayAgain: () => void;
}

export default function VictoryModal({
  score,
  totalQuestions,
  customization,
  onPlayAgain,
}: VictoryModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const canvas = generateCertificateCanvas({
        playerName: customization.name || 'Dino Chiến Thần',
        score,
        totalQuestions,
      });
      downloadCertificate(canvas, customization.name);
    } catch (e) {
      console.error('Error generating certificate:', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-900 border-2 border-amber-500/80 rounded-3xl p-5 sm:p-7 text-white shadow-2xl text-center relative">
        {/* Golden Celebration Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-40 bg-amber-500/30 blur-3xl pointer-events-none rounded-full" />

        {/* Trophy icon */}
        <div className="w-20 h-20 mx-auto mb-4 bg-amber-500/20 border-2 border-amber-400/60 rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-amber-500/20 animate-bounce">
          🏆
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
          CHINH PHỤC TOÀN DIỆN
        </span>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-serif">
          XUẤT SẮC CHIẾN THẮNG!
        </h2>

        <p className="text-sm text-neutral-300 mb-6 max-w-sm mx-auto leading-relaxed">
          Chúc mừng <span className="font-bold text-amber-300">“{customization.name}”</span> đã hoàn thành xuất sắc toàn bộ {totalQuestions}/{totalQuestions} câu hỏi Khảo thí &amp; Đo lường Giáo dục!
        </p>

        {/* 100/100 Score Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 to-neutral-900 border border-amber-500/40 mb-6">
          <div className="text-xs uppercase font-mono tracking-wider text-amber-400 mb-1">
            Tổng Điểm Đạt Được
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight">
            {score} / 100
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            {totalQuestions}/{totalQuestions} Câu Trả Lời Chính Xác Tuyệt Đối
          </div>
        </div>

        {/* Certificate CTA Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-bold text-base shadow-xl shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📜</span>
            <span>{isDownloading ? 'Đang tạo Giấy Chứng Nhận...' : 'Tải Giấy Chứng Nhận Hoàn Thành Trò Chơi (PNG)'}</span>
          </button>

          <p className="text-[11px] text-neutral-400 italic">
            Giấy chứng nhận hoàn thành trò chơi — không phải chứng chỉ chuyên môn
          </p>

          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full py-3 px-6 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm transition-all cursor-pointer"
          >
            🔄 Chơi Lại Từ Đầu
          </button>
        </div>
      </div>
    </div>
  );
}
