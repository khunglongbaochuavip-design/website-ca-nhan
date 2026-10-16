'use client';

import React, { useState } from 'react';
import { DinoQuestCustomization } from '@/lib/dino-quest/types';
import { generateQuestCertificate } from '@/lib/dino-quest/certificate';

interface VictoryModalProps {
  score: number;
  customization: DinoQuestCustomization;
  onPlayAgain: () => void;
  onBackToHub: () => void;
}

export default function VictoryModal({
  score,
  customization,
  onPlayAgain,
  onBackToHub,
}: VictoryModalProps) {
  const [certDataUrl, setCertDataUrl] = useState<string | null>(null);
  const [showCertViewer, setShowCertViewer] = useState(false);

  const handleCreateCertificate = () => {
    const dataUrl = generateQuestCertificate(customization.name);
    setCertDataUrl(dataUrl);
    setShowCertViewer(true);
  };

  const handleDownload = () => {
    if (!certDataUrl) return;
    const a = document.createElement('a');
    a.href = certDataUrl;
    a.download = `Chung_Nhan_Dino_Quest_${customization.name.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-center">
        {/* Radiant glow */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="text-5xl sm:text-6xl mb-3 animate-bounce">
          🏆
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold tracking-widest uppercase inline-block mb-3">
          ★ THÁM HIỂM TOÀN NĂNG — ĐỈNH CAO KHẢO THÍ ★
        </span>

        <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
          CHÚC MỪNG CHIẾN THẮNG!
        </h3>

        <p className="text-sm text-neutral-300 max-w-md mx-auto mb-6 leading-relaxed">
          Bạn và <b className="text-amber-300">{customization.name}</b> đã xuất sắc vượt qua toàn bộ 10 Vùng đất Khảo thí, giải mã thành công Tứ đại cánh cửa và tiến vào Học viện Khảo thí tối cao!
        </p>

        {/* Score & Title Banner */}
        <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase block">Điểm tuyệt đối</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {score}/100
              </span>
            </div>
            <div>
              <span className="text-[11px] font-mono text-neutral-400 uppercase block">Số vòng vượt qua</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                10 / 10
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800">
            <span className="text-xs font-mono text-neutral-400 uppercase block mb-0.5">Danh hiệu vinh danh:</span>
            <span className="text-base sm:text-lg font-black text-yellow-300 tracking-wide">
              👑 NHÀ THÁM HIỂM TRI THỨC 👑
            </span>
          </div>
        </div>

        {/* Certificate Button */}
        <button
          type="button"
          onClick={handleCreateCertificate}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 mb-3"
        >
          <span>📜</span>
          <span>Xem &amp; Nhận Giấy Chứng Nhận</span>
        </button>

        {/* Secondary Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>Chơi Lại</span>
          </button>

          <button
            type="button"
            onClick={onBackToHub}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>←</span>
            <span>Game Khảo Thí</span>
          </button>
        </div>

        {/* Certificate Viewer Modal */}
        {showCertViewer && certDataUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-fadeIn">
            <div className="bg-neutral-900 border border-amber-400/50 rounded-3xl p-5 max-w-4xl w-full shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                <span className="text-sm font-mono font-bold text-amber-300">
                  📜 GIẤY CHỨNG NHẬN DINO QUEST
                </span>
                <button
                  type="button"
                  onClick={() => setShowCertViewer(false)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Certificate Image Preview */}
              <div className="rounded-xl overflow-hidden border border-neutral-800 shadow-inner mb-4 max-h-[65vh] flex items-center justify-center bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={certDataUrl}
                  alt="Giấy Chứng Nhận Dino Quest"
                  className="w-full h-auto max-h-[65vh] object-contain"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>💾</span>
                  <span>Tải Ảnh Chứng Nhận (.PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCertViewer(false)}
                  className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-sm transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
