export type DinoChoice = 'JUMP' | 'RUN';

export interface DinoQuestionV2 {
  id: string;
  domain: string;
  statement: string;
  stem?: string; // Compatibility alias with statement
  correctAnswer: boolean; // true = JUMP, false = RUN
  correctChoice: DinoChoice;
  explanation: string;
}

// Backward-compatible alias for existing imports
export type DinoQuestion = DinoQuestionV2;

export type GameStateV2 =
  | 'READY'
  | 'CUSTOMIZING'
  | 'READING'
  | 'APPROACHING'
  | 'DECISION'
  | 'RESOLUTION'
  | 'GAME_OVER'
  | 'VICTORY'
  | 'PAUSED';

export type GameState = GameStateV2;

export interface DinosaurCustomization {
  name: string;
  paletteId: string;
  themeId: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  belly: string;
  eye: string;
  accent: string;
}

export interface EnvironmentTheme {
  id: string;
  name: string;
  subtitle: string;
  skyColor: string;
  skyGradientEnd: string;
  groundColor: string;
  groundSubColor: string;
  gridLineColor: string;
  mountainFarColor: string;
  mountainNearColor: string;
  cloudColor: string;
  accentElement: string;
}

// Answer target cluster moving in game world
export interface AnswerCluster {
  x: number; // World X position
  upperText: string; // JUMP option text
  lowerText: string; // RUN option text
  correctChoice: DinoChoice;
  upperHitbox: { y: number; width: number; height: number };
  lowerHitbox: { y: number; width: number; height: number };
  decisionX: number; // Threshold X where decision is locked
  resolutionX: number; // Point where resolution is evaluated
  isDecided: boolean;
  chosenAction: DinoChoice | null;
  resolved: boolean;
  isCorrect: boolean | null;
}
