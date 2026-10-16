'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QuestChoice,
  DinoQuestState,
  DinoQuestCustomization,
  WrongAnimal,
} from '@/lib/dino-quest/types';
import { DINO_QUEST_QUESTIONS, TOTAL_WORLDS, POINTS_PER_WORLD } from '@/lib/dino-quest/questions';
import { DINO_QUEST_WORLDS } from '@/lib/dino-quest/worlds';
import { questSoundManager } from '@/lib/dino-quest/audio';
import DinoQuestCanvas from './DinoQuestCanvas';
import QuestionBanner from './QuestionBanner';
import DoorOptionsBar from './DoorOptionsBar';
import GameOverModal from './GameOverModal';
import VictoryModal from './VictoryModal';
import CustomizerModal from './CustomizerModal';

interface DinoQuestGameProps {
  onBackToHub: () => void;
}

const WRONG_ANIMALS: WrongAnimal[] = ['crocodile', 'hippo', 'capybara'];

export default function DinoQuestGame({ onBackToHub }: DinoQuestGameProps) {
  // Game states
  const [gameState, setGameState] = useState<DinoQuestState>('READY');
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0); // 0 to 9
  const [score, setScore] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<QuestChoice | null>(null);
  const [wrongAnimal, setWrongAnimal] = useState<WrongAnimal | null>(null);

  // Audio & Fullscreen states
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Customization
  const [customization, setCustomization] = useState<DinoQuestCustomization>({
    name: 'Dino Tài',
    colorId: 'emerald',
  });
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Container ref for Fullscreen
  const containerRef = useRef<HTMLDivElement | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentWorld = DINO_QUEST_WORLDS[currentWorldIndex] || DINO_QUEST_WORLDS[0];
  const currentQuestion = DINO_QUEST_QUESTIONS[currentWorldIndex] || DINO_QUEST_QUESTIONS[0];

  // Clear timers
  const clearTimers = useCallback(() => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      questSoundManager.stopAmbientBgm();
    };
  }, [clearTimers]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any)?.webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  };

  const handleToggleMute = () => {
    const muted = questSoundManager.toggleMute();
    setIsMuted(muted);
  };

  // Start fresh game from World 1
  const startAdventure = () => {
    clearTimers();
    setScore(0);
    setCurrentWorldIndex(0);
    setSelectedChoice(null);
    setWrongAnimal(null);
    setGameState('WORLD_INTRO');
    questSoundManager.startAmbientBgm();

    // Intro title card duration: 1.5 seconds
    transitionTimerRef.current = setTimeout(() => {
      setGameState('CHOOSING');
    }, 1500);
  };

  // Called when player chooses a door (via Click or Key)
  const handleSelectDoor = (choice: QuestChoice) => {
    if (gameState !== 'CHOOSING') return;

    setSelectedChoice(choice);
    setGameState('APPROACHING');
    questSoundManager.playStep();

    const isCorrect = choice === currentQuestion.correctOption;

    if (!isCorrect) {
      // Pick random surprise animal
      const randAnimal = WRONG_ANIMALS[Math.floor(Math.random() * WRONG_ANIMALS.length)];
      setWrongAnimal(randAnimal);
    }
  };

  // Called when T-Rex finishes walking to the door on Canvas
  const handleWalkFinished = useCallback(() => {
    if (gameState === 'APPROACHING') {
      setGameState('DOOR_OPENING');
      questSoundManager.playDoorOpen();

      const isCorrect = selectedChoice === currentQuestion.correctOption;

      transitionTimerRef.current = setTimeout(() => {
        if (isCorrect) {
          // CORRECT OUTCOME
          setGameState('OUTCOME_CORRECT');
          questSoundManager.playCorrect();
          setScore((prev) => prev + POINTS_PER_WORLD);

          transitionTimerRef.current = setTimeout(() => {
            if (currentWorldIndex + 1 >= TOTAL_WORLDS) {
              // VICTORY!
              setGameState('VICTORY');
              questSoundManager.playVictory();
            } else {
              // Advance to next world
              setCurrentWorldIndex((prev) => prev + 1);
              setSelectedChoice(null);
              setWrongAnimal(null);
              setGameState('WORLD_INTRO');

              transitionTimerRef.current = setTimeout(() => {
                setGameState('CHOOSING');
              }, 1500);
            }
          }, 1200);
        } else {
          // WRONG OUTCOME
          setGameState('OUTCOME_WRONG');
          if (wrongAnimal) {
            questSoundManager.playAnimalSound(wrongAnimal);
          }
          questSoundManager.playStunned();

          transitionTimerRef.current = setTimeout(() => {
            setGameState('GAME_OVER');
          }, 1800);
        }
      }, 600);
    }
  }, [gameState, selectedChoice, currentQuestion, currentWorldIndex, wrongAnimal]);

  // Handle Keyboard shortcuts (1-4, A-D, F, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();

      if (key === 'F') {
        e.preventDefault();
        handleToggleFullscreen();
        return;
      }

      if (key === 'M') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (gameState === 'CHOOSING') {
        if (key === '1' || key === 'A') {
          e.preventDefault();
          handleSelectDoor('A');
        } else if (key === '2' || key === 'B') {
          e.preventDefault();
          handleSelectDoor('B');
        } else if (key === '3' || key === 'C') {
          e.preventDefault();
          handleSelectDoor('C');
        } else if (key === '4' || key === 'D') {
          e.preventDefault();
          handleSelectDoor('D');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Safe back to Game Hub with confirmation if in progress
  const handleSafeBackToHub = () => {
    if (gameState !== 'READY' && gameState !== 'GAME_OVER' && gameState !== 'VICTORY') {
      const confirmLeave = window.confirm(
        'Bạn có chắc muốn trở về Game Khảo thí? Lượt chơi hiện tại sẽ kết thúc.'
      );
      if (!confirmLeave) return;
    }
    clearTimers();
    questSoundManager.stopAmbientBgm();
    onBackToHub();
  };

  return (
    <div
      ref={containerRef}
      className={`w-full bg-neutral-950 border-4 border-neutral-800 rounded-3xl p-3 sm:p-5 shadow-2xl relative select-none transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none p-4 sm:p-6 flex flex-col justify-between overflow-y-auto bg-neutral-950'
          : ''
      }`}
    >
      {/* Top Console Bezel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-neutral-800/80">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSafeBackToHub}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>←</span>
            <span>Game Khảo thí</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-sm" />
            <h2 className="text-sm sm:text-base font-black tracking-wider uppercase font-mono text-white flex items-center gap-2">
              <span>DINO QUEST</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                v1.0
              </span>
            </h2>
          </div>
        </div>

        {/* Right: Controls (Fullscreen, Mute, Customizer) */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Mở toàn màn hình'}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isFullscreen
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500'
            }`}
          >
            <span className="text-sm">{isFullscreen ? '🗗' : '⛶'}</span>
            <span className="hidden sm:inline">Toàn màn hình</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
              isMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span className="hidden sm:inline">{isMuted ? 'Bật SFX' : 'Tắt SFX'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCustomizer(true)}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>🎨</span>
            <span className="hidden sm:inline">Tùy biến</span>
          </button>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="relative rounded-2xl overflow-hidden shadow-inner flex flex-col items-center">
        {/* START OVERLAY (When state is READY) */}
        {gameState === 'READY' ? (
          <div className="w-full py-10 px-6 sm:px-10 rounded-2xl bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 border border-neutral-800 text-center flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold tracking-widest uppercase mb-3 animate-pulse">
              🏛️ FOUR DOORS ADVENTURE • 10 VÙNG ĐẤT
            </span>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans text-white mb-2">
              DINO QUEST — BÍ ẨN TỨ ĐẠI CÁNH CỬA
            </h3>

            <p className="text-sm text-neutral-300 max-w-lg mb-6 leading-relaxed font-sans">
              « 10 vùng đất – 10 thử thách – 4 cánh cửa – 1 hành trình chinh phục. »
              <br />
              Đưa chú khủng long T-Rex giải mã bí ẩn khảo thí qua từng cánh cửa để tiến vào Học viện Khảo thí tối cao!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs mb-6">
              <button
                type="button"
                onClick={startAdventure}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-base shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>Bắt Đầu Thám Hiểm</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCustomizer(true)}
                className="w-full py-3 px-5 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-semibold text-sm transition-all cursor-pointer"
              >
                🎨 Đổi Màu / Tên
              </button>
            </div>

            {/* Instruction rules */}
            <div className="text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-4 py-2.5 rounded-xl border border-neutral-800 max-w-md text-left space-y-1">
              <div>🚪 <b className="text-amber-400">Quy tắc:</b> Mỗi vùng đất có 4 cánh cửa A, B, C, D gắn 4 phương án.</div>
              <div>✨ <b className="text-emerald-400">Chọn Đúng:</b> Cửa mở ra luồng sáng portal, tiến vào vùng đất tiếp theo (+10 điểm).</div>
              <div>⚠️ <b className="text-red-400">Chọn Sai:</b> Cá sấu, Hà mã hoặc Capybara sẽ xuất hiện gây bất ngờ!</div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Question Banner (Sticky top) */}
            <QuestionBanner
              question={currentQuestion}
              world={currentWorld}
              score={score}
            />

            {/* Canvas Viewport */}
            <DinoQuestCanvas
              gameState={gameState}
              world={currentWorld}
              customization={customization}
              selectedChoice={selectedChoice}
              wrongAnimal={wrongAnimal}
              onDoorSelected={handleSelectDoor}
              onAnimationFinished={handleWalkFinished}
              interactive={gameState === 'CHOOSING'}
            />

            {/* Door Options Selection Cards */}
            <DoorOptionsBar
              question={currentQuestion}
              selectedChoice={selectedChoice}
              onSelect={handleSelectDoor}
              disabled={gameState !== 'CHOOSING'}
            />
          </div>
        )}
      </div>

      {/* MODAL: GAME OVER */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          question={currentQuestion}
          world={currentWorld}
          chosenOption={selectedChoice}
          wrongAnimal={wrongAnimal}
          score={score}
          onRetry={startAdventure}
          onBackToHub={handleSafeBackToHub}
        />
      )}

      {/* MODAL: VICTORY */}
      {gameState === 'VICTORY' && (
        <VictoryModal
          score={score}
          customization={customization}
          onPlayAgain={startAdventure}
          onBackToHub={handleSafeBackToHub}
        />
      )}

      {/* MODAL: CUSTOMIZER */}
      {showCustomizer && (
        <CustomizerModal
          customization={customization}
          onSave={(newCustom) => setCustomization(newCustom)}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}
