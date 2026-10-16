'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import {
  QuestChoice,
  DinoQuestState,
  DinoQuestCustomization,
  WrongAnimal,
  DinoQuestWorld,
} from '@/lib/dino-quest/types';
import { DINO_QUEST_COLORS } from '@/lib/dino-quest/worlds';

interface DinoQuestCanvasProps {
  gameState: DinoQuestState;
  world: DinoQuestWorld;
  customization: DinoQuestCustomization;
  selectedChoice: QuestChoice | null;
  wrongAnimal: WrongAnimal | null;
  onDoorSelected: (choice: QuestChoice) => void;
  onAnimationFinished: () => void;
  interactive: boolean;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 420;

// Door coordinates (horizontal distribution)
const DOORS: { choice: QuestChoice; x: number; y: number; w: number; h: number }[] = [
  { choice: 'A', x: 100, y: 155, w: 100, h: 185 },
  { choice: 'B', x: 270, y: 155, w: 100, h: 185 },
  { choice: 'C', x: 440, y: 155, w: 100, h: 185 },
  { choice: 'D', x: 610, y: 155, w: 100, h: 185 },
];

export default function DinoQuestCanvas({
  gameState,
  world,
  customization,
  selectedChoice,
  wrongAnimal,
  onDoorSelected,
  onAnimationFinished,
  interactive,
}: DinoQuestCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation & Character State Refs
  const dinoRef = useRef({
    x: 400,
    y: 345,
    targetX: 400,
    state: 'idle' as 'idle' | 'walk' | 'enter' | 'stunned',
    facing: 1 as 1 | -1,
    stepCycle: 0,
    alpha: 1,
  });

  const doorOpenProgressRef = useRef<{ [key in QuestChoice]: number }>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  });

  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[]
  >([]);

  const hoveredDoorRef = useRef<QuestChoice | null>(null);
  const animTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get active dinosaur colors
  const skin =
    DINO_QUEST_COLORS.find((c) => c.id === customization.colorId) || DINO_QUEST_COLORS[0];

  // Initialize or reset character position when entering a new world or state
  useEffect(() => {
    if (gameState === 'READY' || gameState === 'WORLD_INTRO' || gameState === 'CHOOSING') {
      dinoRef.current = {
        x: 400,
        y: 345,
        targetX: 400,
        state: 'idle',
        facing: 1,
        stepCycle: 0,
        alpha: 1,
      };
      doorOpenProgressRef.current = { A: 0, B: 0, C: 0, D: 0 };
    }
  }, [gameState, world.id]);

  // Handle Action Sequence when player selects a door
  useEffect(() => {
    if (gameState === 'APPROACHING' && selectedChoice) {
      const targetDoor = DOORS.find((d) => d.choice === selectedChoice);
      if (targetDoor) {
        const destX = targetDoor.x + targetDoor.w / 2;
        dinoRef.current.targetX = destX;
        dinoRef.current.state = 'walk';
        dinoRef.current.facing = destX >= dinoRef.current.x ? 1 : -1;
      }
    }
  }, [gameState, selectedChoice]);

  // Spawn environmental particles
  useEffect(() => {
    const pts = [];
    for (let i = 0; i < 35; i++) {
      pts.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.2 - Math.random() * 0.6,
        size: 1.5 + Math.random() * 3,
        alpha: 0.2 + Math.random() * 0.6,
        color: world.theme.groundAccent,
      });
    }
    particlesRef.current = pts;
  }, [world.id]);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    };
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // 1. Draw Sky Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT * 0.75);
      skyGrad.addColorStop(0, world.theme.skyTop);
      skyGrad.addColorStop(1, world.theme.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 2. Distant Horizon / Mountains / Cityscape
      ctx.fillStyle = world.theme.mountainColor;
      ctx.beginPath();
      ctx.moveTo(0, 240);
      for (let x = 0; x <= CANVAS_WIDTH; x += 80) {
        const h = Math.sin((x + world.index * 60) * 0.015) * 40;
        ctx.lineTo(x, 210 + h);
      }
      ctx.lineTo(CANVAS_WIDTH, 270);
      ctx.lineTo(0, 270);
      ctx.closePath();
      ctx.fill();

      // 3. Ground / Floor with perspective path
      const groundGrad = ctx.createLinearGradient(0, 250, 0, CANVAS_HEIGHT);
      groundGrad.addColorStop(0, world.theme.groundColor);
      groundGrad.addColorStop(1, '#020617');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, 250, CANVAS_WIDTH, CANVAS_HEIGHT - 250);

      // Ground Accent Line & Stones
      ctx.strokeStyle = world.theme.groundAccent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 252);
      ctx.lineTo(CANVAS_WIDTH, 252);
      ctx.stroke();

      // Subtle pathway shadows beneath doors
      DOORS.forEach((d) => {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(d.x + d.w / 2, 345, 55, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update & Draw Ambient Environmental Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = CANVAS_HEIGHT;
        if (p.x < 0) p.x = CANVAS_WIDTH;
        if (p.x > CANVAS_WIDTH) p.x = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 5. Draw Four 2.5D Doors
      DOORS.forEach((door) => {
        const isHovered = hoveredDoorRef.current === door.choice && interactive;
        const isSelected = selectedChoice === door.choice;
        let openProg = doorOpenProgressRef.current[door.choice];

        // Animate door opening if selected and state allows
        if (isSelected && (gameState === 'DOOR_OPENING' || gameState === 'OUTCOME_CORRECT' || gameState === 'OUTCOME_WRONG')) {
          if (openProg < 1) {
            doorOpenProgressRef.current[door.choice] = Math.min(1, openProg + 0.05);
            openProg = doorOpenProgressRef.current[door.choice];
          }
        }

        // 5a. Door Frame & Shadow (3D extrusion)
        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(door.x - 8, door.y - 12, door.w + 16, door.h + 16);

        // Frame border
        ctx.strokeStyle = isHovered ? '#facc15' : isSelected ? world.theme.accentColor : world.theme.doorFrameColor;
        ctx.lineWidth = isHovered ? 4 : 3;
        ctx.strokeRect(door.x - 8, door.y - 12, door.w + 16, door.h + 16);

        // Frame header label badge [ A ], [ B ], [ C ], [ D ]
        ctx.fillStyle = isHovered ? '#facc15' : isSelected ? world.theme.accentColor : '#ffffff';
        ctx.beginPath();
        ctx.roundRect(door.x + door.w / 2 - 20, door.y - 32, 40, 24, 6);
        ctx.fill();

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(door.choice, door.x + door.w / 2, door.y - 20);

        // 5b. Inside Portal / Interior (Visible as door opens)
        ctx.fillStyle = '#000000';
        ctx.fillRect(door.x, door.y, door.w, door.h);

        if (isSelected && openProg > 0) {
          if (gameState === 'OUTCOME_CORRECT') {
            // Golden radiant portal glow
            const portalGrad = ctx.createRadialGradient(
              door.x + door.w / 2,
              door.y + door.h / 2,
              5,
              door.x + door.w / 2,
              door.y + door.h / 2,
              door.w * 0.9
            );
            portalGrad.addColorStop(0, '#fef08a');
            portalGrad.addColorStop(0.5, '#eab308');
            portalGrad.addColorStop(1, '#ca8a04');
            ctx.fillStyle = portalGrad;
            ctx.fillRect(door.x, door.y, door.w, door.h);

            // Shimmer beams
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
              ctx.beginPath();
              ctx.moveTo(door.x + Math.sin(Date.now() * 0.005 + i) * 30 + door.w / 2, door.y + door.h);
              ctx.lineTo(door.x + door.w / 2 + (i - 1.5) * 15, door.y + 10);
              ctx.stroke();
            }
          } else if (gameState === 'OUTCOME_WRONG' && wrongAnimal) {
            // Dark comic smoke background
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(door.x, door.y, door.w, door.h);

            // Draw the funny animal springing out of the doorway!
            const animalX = door.x + door.w / 2;
            const animalY = door.y + door.h / 2 + 10;
            drawWrongAnimal(ctx, animalX, animalY, wrongAnimal, openProg);
          }
        }

        // 5c. Swing Door Panel (2.5D perspective opening towards left)
        const closedW = door.w;
        const currentPanelW = closedW * (1 - openProg * 0.85);

        ctx.fillStyle = world.theme.doorPanelColor;
        ctx.fillRect(door.x, door.y, currentPanelW, door.h);

        ctx.strokeStyle = world.theme.doorFrameColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(door.x, door.y, currentPanelW, door.h);

        // Door panel rivets & center emblem if not fully open
        if (openProg < 0.7) {
          ctx.fillStyle = '#64748b';
          ctx.fillRect(door.x + 8, door.y + 15, 6, 6);
          ctx.fillRect(door.x + currentPanelW - 14, door.y + 15, 6, 6);
          ctx.fillRect(door.x + 8, door.y + door.h - 20, 6, 6);
          ctx.fillRect(door.x + currentPanelW - 14, door.y + door.h - 20, 6, 6);

          // Door Handle
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(door.x + currentPanelW - 12, door.y + door.h / 2, 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      // 6. Update & Draw T-Rex Character
      const d = dinoRef.current;

      // Handle walking movement
      if (d.state === 'walk') {
        const dx = d.targetX - d.x;
        if (Math.abs(dx) > 4) {
          d.x += Math.sign(dx) * 4.5;
          d.stepCycle += 0.25;
          d.facing = dx >= 0 ? 1 : -1;
        } else {
          // Reached the chosen door!
          d.x = d.targetX;
          d.state = gameState === 'OUTCOME_CORRECT' ? 'enter' : gameState === 'OUTCOME_WRONG' ? 'stunned' : 'idle';
          if (onAnimationFinished) {
            onAnimationFinished();
          }
        }
      }

      // Handle entering portal (fading into the door)
      if (gameState === 'OUTCOME_CORRECT' && d.state === 'enter') {
        d.alpha = Math.max(0, d.alpha - 0.03);
      }

      // Draw T-Rex
      ctx.save();
      ctx.globalAlpha = d.alpha;
      drawTRex(ctx, d.x, d.y, d.facing, skin, d.state, d.stepCycle, customization.name);
      ctx.restore();

      // 7. World Title Header Card if WORLD_INTRO
      if (gameState === 'WORLD_INTRO') {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(CANVAS_WIDTH / 2 - 220, 20, 440, 65);
        ctx.strokeStyle = world.theme.accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(CANVAS_WIDTH / 2 - 220, 20, 440, 65);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#fde047';
        ctx.fillText(`★ VÙNG ĐẤT ${world.index} / 10 ★`, CANVAS_WIDTH / 2, 38);

        ctx.font = 'bold 20px "Segoe UI", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(world.name.toUpperCase(), CANVAS_WIDTH / 2, 60);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, world, customization, selectedChoice, wrongAnimal, interactive, skin, onAnimationFinished]);

  // Click & Hover Event Handlers for Doors
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) {
      hoveredDoorRef.current = null;
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const hit = DOORS.find(
      (d) => mx >= d.x - 8 && mx <= d.x + d.w + 8 && my >= d.y - 20 && my <= d.y + d.h + 10
    );
    hoveredDoorRef.current = hit ? hit.choice : null;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const hit = DOORS.find(
      (d) => mx >= d.x - 8 && mx <= d.x + d.w + 8 && my >= d.y - 20 && my <= d.y + d.h + 10
    );
    if (hit) {
      onDoorSelected(hit.choice);
    }
  };

  return (
    <div className="relative w-full overflow-hidden flex justify-center items-center bg-black rounded-2xl border border-neutral-800">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          hoveredDoorRef.current = null;
        }}
        onClick={handleClick}
        className={`w-full max-w-[800px] h-auto aspect-[800/420] select-none block ${
          interactive ? 'cursor-pointer' : 'cursor-default'
        }`}
      />
    </div>
  );
}

// Draw Pixel/Cartoon T-Rex Character
function drawTRex(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 1 | -1,
  skin: { primary: string; dark: string; light: string },
  state: 'idle' | 'walk' | 'enter' | 'stunned',
  stepCycle: number,
  name: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  // Bobbing animation
  const bob = state === 'walk' ? Math.sin(stepCycle * 2) * 4 : Math.sin(Date.now() * 0.004) * 2;

  // Name tag above head
  ctx.save();
  ctx.scale(facing, 1); // unflip text
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.beginPath();
  ctx.roundRect(-45, -78 + bob, 90, 18, 5);
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name.slice(0, 12), 0, -69 + bob);

  // Stunned spinning stars if state is stunned
  if (state === 'stunned') {
    ctx.fillStyle = '#fde047';
    ctx.font = '14px sans-serif';
    const angle = Date.now() * 0.008;
    ctx.fillText('💫', Math.cos(angle) * 22, -88 + Math.sin(angle) * 8);
    ctx.fillText('⭐', Math.cos(angle + Math.PI) * 22, -88 + Math.sin(angle + Math.PI) * 8);
  }
  ctx.restore();

  // Dinosaur Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 5, 26, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs with running animation
  const leg1Offset = state === 'walk' ? Math.sin(stepCycle) * 12 : 0;
  const leg2Offset = state === 'walk' ? -Math.sin(stepCycle) * 12 : 0;

  // Back leg
  ctx.fillStyle = skin.dark;
  ctx.fillRect(-8 + leg2Offset, -15, 7, 18);
  ctx.fillRect(-6 + leg2Offset, 0, 10, 5);

  // Body
  ctx.fillStyle = skin.primary;
  ctx.beginPath();
  ctx.roundRect(-22, -45 + bob, 38, 35, 8);
  ctx.fill();

  // Belly light patch
  ctx.fillStyle = skin.light;
  ctx.beginPath();
  ctx.roundRect(-10, -35 + bob, 20, 22, 6);
  ctx.fill();

  // Tail
  ctx.fillStyle = skin.primary;
  ctx.beginPath();
  ctx.moveTo(-20, -35 + bob);
  ctx.lineTo(-40, -42 + bob);
  ctx.lineTo(-20, -22 + bob);
  ctx.closePath();
  ctx.fill();

  // Front leg
  ctx.fillStyle = skin.primary;
  ctx.fillRect(4 + leg1Offset, -15, 8, 20);
  ctx.fillRect(6 + leg1Offset, 2, 11, 5);

  // Head & Snout
  ctx.fillStyle = skin.primary;
  ctx.beginPath();
  ctx.roundRect(-4, -65 + bob, 34, 25, 6);
  ctx.fill();

  // Cute Eye
  if (state === 'stunned') {
    // Dizzy X eye
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, -58 + bob);
    ctx.lineTo(18, -52 + bob);
    ctx.moveTo(18, -58 + bob);
    ctx.lineTo(12, -52 + bob);
    ctx.stroke();
  } else {
    // Big cheerful eye
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(15, -55 + bob, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(16, -55 + bob, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Smile or O mouth
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(22, -46 + bob, 6, 3); // cute teeth

  // Tiny Arms
  ctx.fillStyle = skin.primary;
  ctx.fillRect(10, -32 + bob, 10, 5);
  ctx.fillRect(17, -29 + bob, 4, 4);

  ctx.restore();
}

// Draw Wrong Animal popping out of the door
function drawWrongAnimal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  animal: WrongAnimal,
  progress: number
) {
  ctx.save();
  ctx.translate(x, y);
  const scale = Math.min(1, progress * 1.3);
  ctx.scale(scale, scale);

  if (animal === 'crocodile') {
    // Cute Crocodile popping head out with snappy jaws
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(-30, -35, 60, 45, 12);
    ctx.fill();

    // Snout
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.roundRect(-38, -15, 76, 26, 8);
    ctx.fill();

    // White sharp funny teeth
    ctx.fillStyle = '#ffffff';
    for (let i = -30; i <= 25; i += 10) {
      ctx.beginPath();
      ctx.moveTo(i, -15);
      ctx.lineTo(i + 5, -8);
      ctx.lineTo(i + 10, -15);
      ctx.fill();
    }

    // Googly Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-14, -40, 8, 0, Math.PI * 2);
    ctx.arc(14, -40, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-13, -40, 4, 0, Math.PI * 2);
    ctx.arc(13, -40, 4, 0, Math.PI * 2);
    ctx.fill();

    // Speech bubble
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-35, -70, 70, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CÁ SẤU!', 0, -60);
  } else if (animal === 'hippo') {
    // Cute Hippo with big yawning mouth
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(-32, -40, 64, 55, 16);
    ctx.fill();

    // Cute Ears
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.arc(-24, -45, 7, 0, Math.PI * 2);
    ctx.arc(24, -45, 7, 0, Math.PI * 2);
    ctx.fill();

    // Huge funny round snout
    ctx.fillStyle = '#a78bfa';
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wide open mouth
    ctx.fillStyle = '#be185d';
    ctx.beginPath();
    ctx.ellipse(0, 5, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nostrils
    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.arc(-12, -3, 3, 0, Math.PI * 2);
    ctx.arc(12, -3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-15, -30, 5, 0, Math.PI * 2);
    ctx.arc(15, -30, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-15, -30, 2.5, 0, Math.PI * 2);
    ctx.arc(15, -30, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Speech bubble
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-35, -70, 70, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HÀ MÃ!', 0, -60);
  } else {
    // Ultra-chill Capybara with an orange on head
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(-28, -35, 56, 50, 14);
    ctx.fill();

    // Cute square nose
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.roundRect(-10, -5, 20, 15, 5);
    ctx.fill();

    // Relaxed sleepy eyes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-18, -15);
    ctx.lineTo(-8, -15);
    ctx.moveTo(8, -15);
    ctx.lineTo(18, -15);
    ctx.stroke();

    // Orange on head (Classic Capybara trademark)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, -44, 9, 0, Math.PI * 2);
    ctx.fill();

    // Green leaf on orange
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(3, -54, 4, 2, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Speech bubble
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(-42, -74, 84, 20, 6);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CAPYBARA!', 0, -64);
  }

  ctx.restore();
}
