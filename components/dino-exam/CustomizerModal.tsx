'use client';

import React, { useState } from 'react';
import { DinosaurCustomization } from '@/lib/dino-exam/types';
import { COLOR_PALETTES, ENVIRONMENT_THEMES } from '@/lib/dino-exam/constants';

interface CustomizerModalProps {
  customization: DinosaurCustomization;
  onSave: (customization: DinosaurCustomization) => void;
  onClose: () => void;
}

export default function CustomizerModal({
  customization,
  onSave,
  onClose,
}: CustomizerModalProps) {
  const [name, setName] = useState(customization.name || 'Dino Tài');
  const [selectedPaletteId, setSelectedPaletteId] = useState(customization.paletteId);
  const [selectedThemeId, setSelectedThemeId] = useState(customization.themeId || 'auto');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...customization,
      name: name.trim().slice(0, 18) || 'Dino Tân Binh',
      paletteId: selectedPaletteId,
      themeId: selectedThemeId,
    });
  };

  const currentPalette =
    COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-neutral-900 border-2 border-neutral-700 rounded-3xl p-5 sm:p-6 text-white shadow-2xl relative">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-bold font-sans text-white">Tùy Biến Chú Khủng Long</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Đặt tên &amp; chọn màu sắc yêu thích</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dinosaur Name Input */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Tên Khủng Long (Tối đa 18 ký tự)
            </label>
            <input
              type="text"
              maxLength={18}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Dino Tài, Khảo Thí Pro..."
              className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-white font-mono text-sm outline-none transition-all"
            />
            <div className="text-right text-[11px] text-neutral-500 mt-1 font-mono">
              {name.length}/18 ký tự
            </div>
          </div>

          {/* Color Palettes Grid (6 Palettes) */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-2.5">
              Chọn Màu Sắc (6 Bảng Màu Pixel)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {COLOR_PALETTES.map((p) => {
                const isSelected = p.id === selectedPaletteId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPaletteId(p.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-neutral-800 shadow-md ring-2 ring-amber-400/20'
                        : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-800/60'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg shadow-inner border border-white/20 shrink-0"
                      style={{ backgroundColor: p.primary }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-neutral-200 truncate">
                        {p.name.split(' (')[0]}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        {p.primary}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map / Environment Theme Selector */}
          <div>
            <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Bản Đồ Thử Thách
            </label>
            <select
              value={selectedThemeId}
              onChange={(e) => setSelectedThemeId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-sans text-xs focus:border-amber-400 outline-none cursor-pointer"
            >
              <option value="auto">🔄 Tự Động Chuyển Cảnh (5 Bản đồ qua 20 câu)</option>
              {ENVIRONMENT_THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  🗺️ {t.name} ({t.subtitle})
                </option>
              ))}
            </select>
          </div>

          {/* Live Mini Preview Box */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="text-xs text-neutral-400">
              <span>Xem trước: </span>
              <span className="font-bold text-amber-300 font-mono">{name || 'Dino'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: currentPalette.primary }} />
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: currentPalette.secondary }} />
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: currentPalette.belly }} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-sm transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              Lưu &amp; Tiếp Tục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
