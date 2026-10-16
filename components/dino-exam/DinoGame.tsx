'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStateV2, DinoChoice, DinosaurCustomization } from '@/lib/dino-exam/types';
import { DINO_QUESTIONS, TOTAL_QUESTIONS, POINTS_PER_QUESTION, MAX_SCORE } from '@/lib/dino-exam/questions';
import { READING_DURATION_MS } from '@/lib/dino-exam/constants';
import { soundManager } from '@/lib/dino-exam/audio';
import DinoCanvas from './DinoCanvas';
import InGameQuestionBanner from './InGameQuestionBanner';
import GameOverModal from './GameOverModal';
import VictoryModal from './VictoryModal';
import CustomizerModal from './CustomizerModal';

export default function DinoGame({ onBackToHub }: { onBackToHub?: () => void } = {}) {
  // Game states
  const [gameState, setGameState] = useState<GameStateV2>('READY');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [readingTimeLeft, setReadingTimeLeft] = useState(7);
  const [selectedChoice, setSelectedChoice] = useState<DinoChoice | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmOn, setIsBgmOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Customization state
  const [customization, setCustomization] = useState<DinosaurCustomization>({
    name: 'Dino Tài',
    paletteId: 'emerald',
    themeId: 'auto',
  });
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Refs for timers & container
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const readingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const readingStartRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);
  const totalPauseDurationRef = useRef<number>(0);

  const currentQuestion = DINO_QUESTIONS[currentQuestionIndex] || DINO_QUESTIONS[0];

  // Clear all running timers
  const clearTimers = useCallback(() => {
    if (readingIntervalRef.current) {
      clearInterval(readingIntervalRef.current);
      readingIntervalRef.current = null;
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  }, []);

  // Start question cycle: 7-second reading countdown with continuous runner
  const startQuestion = useCallback((qIndex: number) => {
    clearTimers();
    setSelectedChoice(null);
    setCurrentQuestionIndex(qIndex);
    setReadingTimeLeft(7);
    setGameState('READING');

    readingStartRef.current = Date.now();
    pausedAtRef.current = null;
    totalPauseDurationRef.current = 0;
    const duration = READING_DURATION_MS;

    readingIntervalRef.current = setInterval(() => {
      if (document.hidden) return; // Freeze countdown while tab is hidden

      const now = Date.now();
      const effectiveElapsed = now - readingStartRef.current - totalPauseDurationRef.current;
      const remaining = Math.max(0, (duration - effectiveElapsed) / 1000);
      setReadingTimeLeft(remaining);

      if (remaining <= 0) {
        if (readingIntervalRef.current) {
          clearInterval(readingIntervalRef.current);
          readingIntervalRef.current = null;
        }
        // 7s completed: Target cluster begins approaching from right edge
        setGameState('APPROACHING');
      }
    }, 100);
  }, [clearTimers]);

  // Handle tab visibility change (pause timer and resume cleanly)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pausedAtRef.current = Date.now();
      } else {
        if (pausedAtRef.current !== null) {
          totalPauseDurationRef.current += Date.now() - pausedAtRef.current;
          pausedAtRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Standard Fullscreen API listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Fullscreen toggle handler
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (gameContainerRef.current?.requestFullscreen) {
          await gameContainerRef.current.requestFullscreen();
        } else if ((gameContainerRef.current as any)?.webkitRequestFullscreen) {
          await (gameContainerRef.current as any).webkitRequestFullscreen();
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

  // Start fresh game (all 40 questions)
  const startGame = () => {
    setScore(0);
    if (isBgmOn) {
      soundManager.startBgm();
    }
    startQuestion(0);
  };

  // Called when T-Rex passes decision line (dinoX + 110)
  const handleDecisionMade = useCallback((choice: DinoChoice) => {
    setSelectedChoice(choice);
    setGameState('DECISION');
  }, []);

  const qIndexRef = useRef(0);
  qIndexRef.current = currentQuestionIndex;

  // Called when T-Rex makes physical contact with target cluster at resolution point
  const handleResolutionComplete = useCallback((success: boolean) => {
    setGameState('RESOLUTION');

    if (success) {
      // Correct!
      setScore((prev) => prev + POINTS_PER_QUESTION);
      soundManager.playCorrect();

      transitionTimeoutRef.current = setTimeout(() => {
        const nextIdx = qIndexRef.current + 1;
        if (nextIdx >= TOTAL_QUESTIONS) {
          // All 40 questions cleared! Victory!
          soundManager.playVictory();
          setGameState('VICTORY');
        } else {
          // Advance smoothly to next question without interrupting runner
          startQuestion(nextIdx);
        }
      }, 1000);
    } else {
      // Wrong choice collision! Game Over!
      soundManager.playHit();
      transitionTimeoutRef.current = setTimeout(() => {
        setGameState('GAME_OVER');
      }, 500);
    }
  }, [startQuestion]);

  // Jump input audio sound
  const handleJumpInput = useCallback(() => {
    soundManager.playJump();
  }, []);

  // Teardown sound & timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
      soundManager.stopBgm();
    };
  }, [clearTimers]);

  // Audio toggles
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBgm = () => {
    if (isBgmOn) {
      soundManager.stopBgm();
      setIsBgmOn(false);
    } else {
      soundManager.startBgm();
      setIsBgmOn(true);
    }
  };

  return (
    <div
      ref={gameContainerRef}
      className={`w-full bg-neutral-950 border-4 border-neutral-800 rounded-3xl p-3 sm:p-5 shadow-2xl relative select-none transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none border-none p-4 sm:p-6 flex flex-col justify-between overflow-hidden bg-neutral-950'
          : ''
      }`}
    >
      {/* Top Console Bezel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-neutral-800/80">
        {/* Title & Brand */}
        <div className="flex items-center gap-2.5">
          {onBackToHub && (
            <button
              type="button"
              onClick={() => {
                if (gameState !== 'READY' && gameState !== 'GAME_OVER' && gameState !== 'VICTORY') {
                  const leave = window.confirm(
                    'Bạn có chắc muốn trở về Game Khảo thí? Lượt chơi hiện tại sẽ kết thúc.'
                  );
                  if (!leave) return;
                }
                clearTimers();
                soundManager.stopBgm();
                onBackToHub();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-neutral-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer mr-1"
            >
              <span>←</span>
              <span>Game Khảo thí</span>
            </button>
          )}
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
          <h2 className="text-base sm:text-lg font-black tracking-wider uppercase font-mono text-white flex items-center gap-2">
            <span>DINO EXAM RUNNER</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              v2.1
            </span>
          </h2>
        </div>

        {/* Console Controls (Fullscreen, Mute, BGM, Customizer) */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Fullscreen Toggle Button */}
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
            <span className="hidden sm:inline">
              {isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            </span>
          </button>

          {/* Mute Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span className="hidden sm:inline">{isMuted ? 'Bật SFX' : 'Tắt SFX'}</span>
          </button>

          {/* BGM Toggle */}
          <button
            type="button"
            onClick={handleToggleBgm}
            title="Bật/Tắt nhạc nền 8-bit"
            className={`px-2.5 py-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
              isBgmOn
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
          >
            <span>🎶</span>
            <span className="hidden sm:inline">BGM</span>
          </button>

          {/* Customize Dinosaur Button */}
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

      {/* Progress & Stats Bar (Active when playing) */}
      {gameState !== 'READY' && (
        <div className="flex items-center justify-between text-xs font-mono py-2 px-3 mb-3 bg-neutral-900/80 rounded-xl border border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Khủng Long:</span>
            <span className="font-bold text-amber-300 truncate max-w-[120px]">
              {customization.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-neutral-400">Câu: </span>
              <span className="font-bold text-white">
                {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}
              </span>
            </div>
            <div>
              <span className="text-neutral-400">Điểm: </span>
              <span className="font-black text-emerald-400 text-sm">
                {score.toFixed(1).replace(/\.0$/, '')}/{MAX_SCORE}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Screen Container with In-Game HUD Overlay */}
      <div
        className={`relative rounded-2xl overflow-hidden shadow-inner ${
          isFullscreen ? 'flex-1 flex items-center justify-center max-h-[84vh]' : ''
        }`}
      >
        <DinoCanvas
          gameState={gameState}
          customization={customization}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          onDecisionMade={handleDecisionMade}
          onResolutionComplete={handleResolutionComplete}
          onJumpInput={handleJumpInput}
        />

        {/* IN-GAME QUESTION BANNER (Rendered directly inside the upper canvas viewport) */}
        {gameState !== 'READY' && gameState !== 'GAME_OVER' && gameState !== 'VICTORY' && (
          <InGameQuestionBanner
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={TOTAL_QUESTIONS}
            gameState={gameState}
            readingTimeLeft={readingTimeLeft}
          />
        )}

        {/* READY / START SCREEN OVERLAY */}
        {gameState === 'READY' && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center text-white">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold tracking-widest uppercase mb-3 animate-pulse">
              🎮 ĐUA LIÊN TỤC V2.1 – 40 NHẬN ĐỊNH ĐÚNG / SAI
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-sans text-white mb-2">
              DINO EXAM RUNNER
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mb-6 leading-relaxed">
              40 nhận định Khảo thí &amp; Đo lường Giáo dục – Quyết định ĐÚNG (Nhảy) hoặc SAI (Không nhảy) – Vượt chướng ngại vật &amp; Nhận Giấy Chứng Nhận!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
              <button
                type="button"
                onClick={startGame}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-base shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                <span>Bắt Đầu Chơi Ngay</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCustomizer(true)}
                className="w-full py-3 px-5 rounded-2xl bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-semibold text-sm transition-all cursor-pointer"
              >
                🎨 Đổi Màu / Tên
              </button>
            </div>

            <div className="mt-5 text-[11px] font-mono text-neutral-300 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-700 max-w-md">
              💡 <span className="text-amber-400 font-bold">Space / ↑ / Click / Nút Nhảy</span>: Chọn <span className="text-sky-300 font-bold">ĐÚNG</span> (Nhảy cổng trên) • <span className="text-emerald-400 font-bold">Không nhấn phím</span>: Chọn <span className="text-emerald-300 font-bold">SAI</span> (Chạy cổng dưới)
            </div>
          </div>
        )}
      </div>

      {/* MODAL: GAME OVER (Fixed overlay) */}
      {gameState === 'GAME_OVER' && (
        <GameOverModal
          question={currentQuestion}
          chosenAction={selectedChoice}
          score={score}
          questionIndex={currentQuestionIndex}
          totalQuestions={TOTAL_QUESTIONS}
          onRetry={startGame}
        />
      )}

      {/* MODAL: VICTORY (Fixed overlay) */}
      {gameState === 'VICTORY' && (
        <VictoryModal
          score={score}
          totalQuestions={TOTAL_QUESTIONS}
          customization={customization}
          onPlayAgain={startGame}
        />
      )}

      {/* MODAL: CUSTOMIZER */}
      {showCustomizer && (
        <CustomizerModal
          customization={customization}
          onSave={(newCust) => {
            setCustomization(newCust);
            setShowCustomizer(false);
          }}
          onClose={() => setShowCustomizer(false)}
        />
      )}
    </div>
  );
}
