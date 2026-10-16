'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DinoChoice, GameStateV2, DinosaurCustomization, DinoQuestionV2, AnswerCluster } from '@/lib/dino-exam/types';
import { COLOR_PALETTES, ENVIRONMENT_THEMES } from '@/lib/dino-exam/constants';

interface DinoCanvasProps {
  gameState: GameStateV2;
  customization: DinosaurCustomization;
  currentQuestion: DinoQuestionV2;
  currentQuestionIndex: number;
  onDecisionMade: (choice: DinoChoice) => void;
  onResolutionComplete: (success: boolean) => void;
  onJumpInput: () => void;
}

export default function DinoCanvas({
  gameState,
  customization,
  currentQuestion,
  currentQuestionIndex,
  onDecisionMade,
  onResolutionComplete,
  onJumpInput,
}: DinoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep game loop completely continuous without remounting or resetting offsets
  const animRef = useRef<number | null>(null);
  const stateRef = useRef({
    gameState,
    customization,
    currentQuestion,
    currentQuestionIndex,
    hasJumpBuffered: false,
    onDecisionMade,
    onResolutionComplete,
  });

  // Keep stateRef updated synchronously without re-triggering useEffect
  useEffect(() => {
    stateRef.current.gameState = gameState;
    stateRef.current.customization = customization;
    stateRef.current.currentQuestion = currentQuestion;
    stateRef.current.currentQuestionIndex = currentQuestionIndex;
    stateRef.current.onDecisionMade = onDecisionMade;
    stateRef.current.onResolutionComplete = onResolutionComplete;
  }, [gameState, customization, currentQuestion, currentQuestionIndex, onDecisionMade, onResolutionComplete]);

  // Handle external jump input (from Space, ArrowUp, or mobile touch)
  const triggerJump = () => {
    stateRef.current.hasJumpBuffered = true;
    onJumpInput();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // World & physics coordinates (840 x 420, 2:1 aspect ratio)
    const width = 840;
    const height = 420;
    const groundY = 330;
    const dinoX = 140;

    // Continuous World offsets (NEVER reset across all 40 questions)
    let groundOffset = 0;
    let mountainFarOffset = 0;
    let mountainNearOffset = 0;
    let cloudOffset = 0;

    // Dinosaur continuous physics state
    let dinoY = groundY;
    let dinoVy = 0;
    let isJumping = false;
    let runFrame = 0;
    let animTimer = 0;

    // Active Answer Cluster
    let activeCluster: AnswerCluster | null = null;
    let clusterSpawnedForIndex = -1;
    let clusterJumpTriggered = false;

    // Particle system
    const particles: { x: number; y: number; vx: number; vy: number; color: string; life: number }[] = [];

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.08); // Cap delta time against lag spikes
      lastTime = currentTime;

      const currentState = stateRef.current.gameState;
      const question = stateRef.current.currentQuestion;
      const qIndex = stateRef.current.currentQuestionIndex;
      const cust = stateRef.current.customization;

      // Palette lookup
      const palette = COLOR_PALETTES.find((p) => p.id === cust.paletteId) || COLOR_PALETTES[0];

      // Theme lookup: respects specific selection or auto-progresses every 8 questions (40/5 = 8)
      let theme = ENVIRONMENT_THEMES[0];
      if (cust.themeId && cust.themeId !== 'auto') {
        theme = ENVIRONMENT_THEMES.find((t) => t.id === cust.themeId) || ENVIRONMENT_THEMES[0];
      } else {
        const themeIndex = Math.min(Math.floor(qIndex / 8), ENVIRONMENT_THEMES.length - 1);
        theme = ENVIRONMENT_THEMES[themeIndex] || ENVIRONMENT_THEMES[0];
      }

      // Continuous world running speed
      const isWorldMoving =
        currentState === 'READING' ||
        currentState === 'APPROACHING' ||
        currentState === 'DECISION' ||
        currentState === 'RESOLUTION';

      const worldSpeed = 290; // px/sec

      if (isWorldMoving) {
        groundOffset = (groundOffset + worldSpeed * dt) % width;
        mountainNearOffset = (mountainNearOffset + worldSpeed * 0.45 * dt) % width;
        mountainFarOffset = (mountainFarOffset + worldSpeed * 0.2 * dt) % width;
        cloudOffset = (cloudOffset + 24 * dt) % width;
      }

      // Handle Jump Trigger & Jump Physics
      if (stateRef.current.hasJumpBuffered) {
        stateRef.current.hasJumpBuffered = false;
        clusterJumpTriggered = true;
        if (!isJumping && dinoY >= groundY - 2) {
          isJumping = true;
          dinoVy = -580; // High leap to reach JUMP_TARGET
        }
      }

      if (isJumping) {
        dinoY += dinoVy * dt;
        dinoVy += 1350 * dt; // Gravity
        if (dinoY >= groundY) {
          dinoY = groundY;
          dinoVy = 0;
          isJumping = false;
        }
      } else {
        dinoY = groundY;
      }

      // Dinosaur leg animation frames
      if (isWorldMoving && !isJumping) {
        animTimer += dt;
        if (animTimer > 0.08) {
          animTimer = 0;
          runFrame = (runFrame + 1) % 4;
        }
      }

      // ----------------------------------------------------
      // SPAWN & MOVE ANSWER TARGET CLUSTER (APPROACHING / DECISION / RESOLUTION)
      // ----------------------------------------------------
      if (currentState === 'APPROACHING' || currentState === 'DECISION' || currentState === 'RESOLUTION') {
        if (!activeCluster || clusterSpawnedForIndex !== qIndex) {
          clusterSpawnedForIndex = qIndex;
          clusterJumpTriggered = false;
          activeCluster = {
            x: width + 40,
            upperText: 'ĐÚNG',
            lowerText: 'SAI',
            correctChoice: question.correctChoice,
            upperHitbox: { y: groundY - 140, width: 160, height: 48 }, // JUMP Target: ĐÚNG
            lowerHitbox: { y: groundY - 50, width: 160, height: 48 },  // RUN Target: SAI
            decisionX: dinoX + 110,
            resolutionX: dinoX + 30,
            isDecided: false,
            chosenAction: null,
            resolved: false,
            isCorrect: null,
          };
        }

        if (activeCluster) {
          // Move target cluster with world
          activeCluster.x -= worldSpeed * dt;

          // 1. DECISION WINDOW CHECK:
          // When target cluster reaches decision checkpoint
          if (!activeCluster.isDecided && activeCluster.x <= activeCluster.decisionX) {
            activeCluster.isDecided = true;
            // If player triggered jump or is currently airborne -> JUMP; otherwise RUN
            const choice: DinoChoice = (isJumping || clusterJumpTriggered) ? 'JUMP' : 'RUN';
            activeCluster.chosenAction = choice;
            stateRef.current.onDecisionMade(choice);
          }

          // 2. RESOLUTION POINT CHECK:
          // When target cluster makes physical contact with T-Rex
          if (!activeCluster.resolved && activeCluster.x <= activeCluster.resolutionX) {
            activeCluster.resolved = true;
            const success = activeCluster.chosenAction === activeCluster.correctChoice;
            activeCluster.isCorrect = success;

            if (success) {
              // Sparkle particles for correct choice
              for (let i = 0; i < 20; i++) {
                particles.push({
                  x: dinoX + 30,
                  y: activeCluster.chosenAction === 'JUMP' ? groundY - 120 : groundY - 25,
                  vx: (Math.random() - 0.5) * 220,
                  vy: -Math.random() * 200 - 40,
                  color: '#fbbf24',
                  life: 0.7,
                });
              }
            } else {
              // Impact red particles for collision failure
              for (let i = 0; i < 25; i++) {
                particles.push({
                  x: dinoX + 30,
                  y: dinoY - 25,
                  vx: (Math.random() - 0.5) * 260,
                  vy: -Math.random() * 240 - 50,
                  color: '#ef4444',
                  life: 0.9,
                });
              }
            }

            stateRef.current.onResolutionComplete(success);
          }

          // Clear cluster once it scrolls off-screen to the left
          if (activeCluster.x < -260) {
            activeCluster = null;
          }
        }
      } else if (currentState === 'READING' || currentState === 'READY') {
        activeCluster = null;
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 450 * dt;
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // ----------------------------------------------------
      // DRAW CANVAS (Continuous 60fps)
      // ----------------------------------------------------
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;

      // 1. Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, theme.skyColor);
      skyGrad.addColorStop(1, theme.skyGradientEnd);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Far Clouds
      ctx.fillStyle = theme.cloudColor;
      for (let i = 0; i < 5; i++) {
        const cx = (width * 0.25 * i - cloudOffset * 0.5 + width * 2) % (width + 100) - 50;
        const cy = 35 + (i % 3) * 25;
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0, Math.PI * 2);
        ctx.arc(cx + 25, cy - 8, 32, 0, Math.PI * 2);
        ctx.arc(cx + 55, cy, 24, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Far Mountains (Parallax Layer 1)
      ctx.fillStyle = theme.mountainFarColor;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = -width; x <= width * 2; x += 160) {
        const sx = x - mountainFarOffset;
        ctx.lineTo(sx, groundY);
        ctx.lineTo(sx + 80, groundY - 110);
        ctx.lineTo(sx + 160, groundY);
      }
      ctx.fill();

      // 4. Near Hills / Landmarks (Parallax Layer 2)
      ctx.fillStyle = theme.mountainNearColor;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      for (let x = -width; x <= width * 2; x += 120) {
        const sx = x - mountainNearOffset;
        ctx.lineTo(sx, groundY);
        ctx.lineTo(sx + 60, groundY - 65);
        ctx.lineTo(sx + 120, groundY);
      }
      ctx.fill();

      // Thematic landmarks
      if (theme.accentElement === 'pyramid') {
        ctx.fillStyle = '#b45309';
        for (let x = 60; x < width * 2; x += 320) {
          const px = (x - mountainNearOffset + width * 2) % width;
          ctx.beginPath();
          ctx.moveTo(px - 35, groundY);
          ctx.lineTo(px, groundY - 50);
          ctx.lineTo(px + 35, groundY);
          ctx.fill();
        }
      } else if (theme.accentElement === 'snow_pines') {
        ctx.fillStyle = '#0369a1';
        for (let x = 40; x < width * 2; x += 220) {
          const px = (x - mountainNearOffset + width * 2) % width;
          ctx.beginPath();
          ctx.moveTo(px - 14, groundY);
          ctx.lineTo(px, groundY - 45);
          ctx.lineTo(px + 14, groundY);
          ctx.fill();
        }
      } else if (theme.accentElement === 'cyber_towers') {
        ctx.fillStyle = '#4338ca';
        for (let x = 50; x < width * 2; x += 200) {
          const px = (x - mountainNearOffset + width * 2) % width;
          ctx.fillRect(px, groundY - 60, 24, 60);
          ctx.fillStyle = '#818cf8';
          ctx.fillRect(px + 5, groundY - 55, 4, 6);
          ctx.fillRect(px + 15, groundY - 55, 4, 6);
          ctx.fillStyle = '#4338ca';
        }
      }

      // 5. Ground Surface & Grid Line
      ctx.fillStyle = theme.groundColor;
      ctx.fillRect(0, groundY, width, height - groundY);

      ctx.fillStyle = theme.groundSubColor;
      ctx.fillRect(0, groundY + 12, width, height - groundY - 12);

      // Moving Ground Track
      ctx.fillStyle = theme.gridLineColor;
      for (let x = -40; x < width + 40; x += 30) {
        const gx = (x - groundOffset + width * 2) % (width + 30) - 15;
        ctx.fillRect(gx, groundY + 4, 16, 3);
      }

      // 6. Draw Answer Targets In World (Upper: JUMP, Lower: RUN)
      if (activeCluster) {
        drawAnswerCluster(ctx, activeCluster, groundY);
      }

      // 7. Draw Dinosaur (Pixel Art Character)
      drawPixelDino(
        ctx,
        dinoX,
        dinoY,
        palette,
        isJumping,
        runFrame,
        currentState,
        cust.name
      );

      // 8. Draw Sparkle & Collision Particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      });

      // 9. World Biome Badge (Bottom Left)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.roundRect(14, height - 34, 190, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`🗺️ ${theme.name}`, 22, height - 18);

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []); // Run ONCE on mount, NEVER remount or reset offsets!

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-4 border-neutral-900 bg-neutral-950 shadow-2xl select-none">
      <canvas
        ref={canvasRef}
        width={840}
        height={420}
        onClick={triggerJump}
        className="w-full h-auto aspect-[2/1] block touch-manipulation cursor-pointer"
      />

      {/* Mobile Touch Jump Button Overlay */}
      <div className="absolute bottom-4 right-4 z-20 sm:hidden">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerJump();
          }}
          className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 active:scale-90 text-neutral-950 font-black text-sm shadow-xl border-2 border-white/40 flex items-center gap-1.5"
        >
          <span>⬆️</span>
          <span>NHẢY</span>
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------
// DRAW ANSWER TARGETS IN GAME WORLD (V2.1 CRISP TRUE / FALSE GATES)
// --------------------------------------------------------------------
function drawAnswerCluster(
  ctx: CanvasRenderingContext2D,
  cluster: AnswerCluster,
  groundY: number
) {
  const x = cluster.x;
  const boxW = 160;
  const boxH = 48;
  const upperY = cluster.upperHitbox.y;
  const lowerY = cluster.lowerHitbox.y;

  ctx.save();

  // Vertical track guide connecting the two targets
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(x + boxW / 2, upperY);
  ctx.lineTo(x + boxW / 2, lowerY + boxH);
  ctx.stroke();
  ctx.setLineDash([]);

  // ==========================================
  // --- UPPER TARGET: ĐÚNG (↑ NHẢY) ---
  // ==========================================
  let upperBg = 'rgba(15, 23, 42, 0.96)';
  let upperBorder = '#64748b'; // High-contrast neutral border (no clue before decision)
  let upperPillBg = 'rgba(2, 132, 199, 0.3)';
  let upperPillBorder = 'rgba(56, 189, 248, 0.7)';
  let upperPillText = '#38bdf8';

  if (cluster.resolved) {
    if (cluster.correctChoice === 'JUMP') {
      upperBorder = '#22c55e'; // Green
      upperBg = 'rgba(20, 83, 45, 0.98)';
      upperPillBg = 'rgba(34, 197, 94, 0.4)';
    } else if (cluster.chosenAction === 'JUMP') {
      upperBorder = '#ef4444'; // Red if chosen wrongly
      upperBg = 'rgba(127, 29, 29, 0.98)';
      upperPillBg = 'rgba(239, 68, 68, 0.4)';
    }
  } else if (cluster.chosenAction === 'JUMP') {
    upperBorder = '#fbbf24'; // Highlighted when locked
    upperBg = 'rgba(30, 41, 59, 0.98)';
  }

  // Draw Upper Box (ĐÚNG)
  ctx.fillStyle = upperBg;
  ctx.strokeStyle = upperBorder;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(x, upperY, boxW, boxH, 10);
  ctx.fill();
  ctx.stroke();

  // Upper Subtitle Pill: [↑ NHẢY]
  ctx.fillStyle = upperPillBg;
  ctx.strokeStyle = upperPillBorder;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 8, upperY + 8, 60, 32, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = upperPillText;
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('↑ NHẢY', x + 38, upperY + 28);

  // Upper Main Label: ĐÚNG
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ĐÚNG', x + 114, upperY + 32);

  // ==========================================
  // --- LOWER TARGET: SAI (KHÔNG NHẢY) ---
  // ==========================================
  let lowerBg = 'rgba(15, 23, 42, 0.96)';
  let lowerBorder = '#64748b'; // High-contrast neutral border (no clue before decision)
  let lowerPillBg = 'rgba(100, 116, 139, 0.3)';
  let lowerPillBorder = 'rgba(148, 163, 184, 0.6)';
  let lowerPillText = '#e2e8f0';

  if (cluster.resolved) {
    if (cluster.correctChoice === 'RUN') {
      lowerBorder = '#22c55e'; // Green
      lowerBg = 'rgba(20, 83, 45, 0.98)';
      lowerPillBg = 'rgba(34, 197, 94, 0.4)';
    } else if (cluster.chosenAction === 'RUN') {
      lowerBorder = '#ef4444'; // Red if chosen wrongly
      lowerBg = 'rgba(127, 29, 29, 0.98)';
      lowerPillBg = 'rgba(239, 68, 68, 0.4)';
    }
  } else if (cluster.chosenAction === 'RUN') {
    lowerBorder = '#fbbf24'; // Highlighted when locked
    lowerBg = 'rgba(30, 41, 59, 0.98)';
  }

  // Draw Lower Box (SAI)
  ctx.fillStyle = lowerBg;
  ctx.strokeStyle = lowerBorder;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(x, lowerY, boxW, boxH, 10);
  ctx.fill();
  ctx.stroke();

  // Lower Subtitle Pill: [KHÔNG NHẢY]
  ctx.fillStyle = lowerPillBg;
  ctx.strokeStyle = lowerPillBorder;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x + 8, lowerY + 8, 86, 32, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = lowerPillText;
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('KHÔNG NHẢY', x + 51, lowerY + 28);

  // Lower Main Label: SAI
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SAI', x + 127, lowerY + 32);

  ctx.restore();
}

function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number
) {
  let display = text;
  if (ctx.measureText(display).width > maxWidth) {
    while (display.length > 3 && ctx.measureText(display + '…').width > maxWidth) {
      display = display.slice(0, -1);
    }
    display += '…';
  }
  ctx.fillText(display, x, y);
}

// --------------------------------------------------------------------
// PIXEL ART DINOSAUR RENDERER
// --------------------------------------------------------------------
function drawPixelDino(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  palette: (typeof COLOR_PALETTES)[0],
  isJumping: boolean,
  runFrame: number,
  gameState: GameStateV2,
  dinoName: string
) {
  ctx.save();

  // Floating Name Tag above head
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  const nameWidth = Math.max(70, dinoName.length * 8 + 16);
  ctx.beginPath();
  ctx.roundRect(x - 10, y - 72, nameWidth, 18, 6);
  ctx.fill();

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(dinoName.slice(0, 18) || 'Dino', x - 10 + nameWidth / 2, y - 59);

  const dy = y - 56;

  // Tail
  ctx.fillStyle = palette.secondary;
  ctx.fillRect(x - 22, dy + 26, 10, 8);
  ctx.fillRect(x - 30, dy + 22, 10, 6);
  ctx.fillRect(x - 36, dy + 18, 8, 4);

  // Main Torso
  ctx.fillStyle = palette.primary;
  ctx.fillRect(x - 14, dy + 16, 28, 26);

  // Belly
  ctx.fillStyle = palette.belly;
  ctx.fillRect(x - 2, dy + 24, 14, 16);

  // Neck & Head
  ctx.fillStyle = palette.primary;
  ctx.fillRect(x + 2, dy + 4, 18, 16);
  ctx.fillRect(x + 8, dy - 6, 26, 20);
  ctx.fillRect(x + 22, dy + 2, 16, 12);

  // Small Arm
  ctx.fillStyle = palette.accent;
  ctx.fillRect(x + 12, dy + 24, 8, 4);
  ctx.fillRect(x + 18, dy + 26, 4, 5);

  // Eye
  ctx.fillStyle = palette.eye;
  ctx.fillRect(x + 18, dy - 2, 6, 6);

  if (gameState === 'GAME_OVER') {
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 18, dy - 2);
    ctx.lineTo(x + 24, dy + 4);
    ctx.moveTo(x + 24, dy - 2);
    ctx.lineTo(x + 18, dy + 4);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 21, dy, 3, 3);
  }

  // Legs
  ctx.fillStyle = palette.accent;
  if (isJumping) {
    ctx.fillRect(x - 8, dy + 40, 8, 8);
    ctx.fillRect(x + 4, dy + 40, 8, 8);
  } else {
    if (runFrame === 0 || runFrame === 2) {
      ctx.fillRect(x - 6, dy + 42, 6, 14);
      ctx.fillRect(x + 6, dy + 42, 6, 14);
    } else if (runFrame === 1) {
      ctx.fillRect(x - 8, dy + 42, 6, 10);
      ctx.fillRect(x + 8, dy + 42, 6, 14);
    } else {
      ctx.fillRect(x - 8, dy + 42, 6, 14);
      ctx.fillRect(x + 8, dy + 42, 6, 10);
    }
  }

  // Victory Graduation Cap
  if (gameState === 'VICTORY') {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x + 18, y - 76);
    ctx.lineTo(x + 36, y - 68);
    ctx.lineTo(x + 18, y - 60);
    ctx.lineTo(x, y - 68);
    ctx.fill();
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + 14, y - 64, 10, 5);
  }

  ctx.restore();
}
