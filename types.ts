export enum GameState {
  NOT_STARTED,
  IN_PROGRESS,
  GUESSING,
  GAME_OVER_WIN,
  GAME_OVER_LOSS,
  ERROR,
}

export type Guess = {
  name: string;
  description: string;
  sureness: number;
};

export type Question = {
  text: string;
  answers?: string[];
};