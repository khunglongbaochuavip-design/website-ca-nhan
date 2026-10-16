// Type definitions for Dino Quest — Bí Ẩn Tứ Đại Cánh Cửa (v1.0)

export type QuestChoice = 'A' | 'B' | 'C' | 'D';

export type WrongAnimal = 'crocodile' | 'hippo' | 'capybara';

export type DinoQuestState =
  | 'READY'            // Start screen / world overview
  | 'WORLD_INTRO'      // Short camera zoom / world title card
  | 'CHOOSING'         // T-Rex idle, player can choose door A, B, C, D
  | 'APPROACHING'      // T-Rex walking towards the chosen door
  | 'DOOR_OPENING'     // Door hinges open with 2.5D perspective
  | 'OUTCOME_CORRECT'  // Golden portal glow, T-Rex steps inside
  | 'OUTCOME_WRONG'    // Animal pops out, T-Rex stunned reaction
  | 'GAME_OVER'        // Modal showing result, explanation, retry
  | 'VICTORY';         // Final victory celebration at Grand Academy

export interface DinoQuestQuestion {
  id: string;
  worldId: string;
  domain: string;
  stem: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: QuestChoice;
  explanation: string;
}

export interface DinoQuestWorld {
  id: string;
  index: number; // 1 to 10
  name: string;
  subtitle: string;
  description: string;
  theme: {
    skyTop: string;
    skyBottom: string;
    mountainColor: string;
    groundColor: string;
    groundAccent: string;
    doorFrameColor: string;
    doorPanelColor: string;
    accentColor: string;
    particleType: 'grass' | 'binary' | 'sand' | 'ember' | 'snow' | 'firefly' | 'crystal' | 'neon' | 'torch' | 'gold_dust';
  };
}

export interface DinoQuestCustomization {
  name: string;
  colorId: string; // 'emerald' | 'ruby' | 'sapphire' | 'amber' | 'amethyst' | 'cyan'
}

export interface DinoQuestScoreState {
  currentWorldIndex: number; // 0 to 9
  score: number;             // 0 to 100
  selectedOption: QuestChoice | null;
  wrongAnimal: WrongAnimal | null;
}
