'use client';

import React, { useState } from 'react';
import { DinoQuestCustomization } from '@/lib/dino-quest/types';
import { DINO_QUEST_COLORS } from '@/lib/dino-quest/worlds';

interface CustomizerModalProps {
  customization: DinoQuestCustomization;
  onSave: (customization: DinoQuestCustomization) => void;
  onClose: () => void;
}

export default function CustomizerModal({
  customization,
  onSave,
  onClose,
}: CustomizerModalProps) {
  const [name, setName] = useState(customization.name);
  const [colorId, setColorId] = useState(customization.colorId);

  const handleSave = () => {
    onSave({
      name: name.trim() || 'Dino Tài',
      colorId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h3 className="text-lg font-bold text-white font-sans">
              Tùy Biến Khủng Long T-Rex
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Name input */}
        <div className="mb-5">
          <label className="block text-xs font-mono text-neutral-400 uppercase mb-2">
            Tên nhân vật (Hiển thị trong game):
          </label>
          <input
            type="text"
            maxLength={16}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dino Tài"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Color picker (6 colors) */}
        <div className="mb-6">
          <label className="block text-xs font-mono text-neutral-400 uppercase mb-3">
            Chọn màu sắc T-Rex:
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {DINO_QUEST_COLORS.map((col) => {
              const isSelected = colorId === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setColorId(col.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-neutral-800 shadow-md scale-105'
                      : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center"
                    style={{ backgroundColor: col.primary }}
                  >
                    {isSelected && <span className="text-black text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-[11px] font-sans text-neutral-300 font-medium">
                    {col.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm transition-all cursor-pointer"
          >
            Lưu Thay Đổi
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-sm transition-all cursor-pointer"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
