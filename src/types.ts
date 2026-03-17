export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
}

export interface Player {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  roomsCleared: number;
  shieldActive: boolean;
}

export interface Monster {
  name: string;
  hp: number;
  maxHp: number;
  image: string;
  level: number;
}

export type GameState = 'HOME' | 'DUNGEON' | 'BATTLE' | 'RESULT' | 'GAMEOVER';
