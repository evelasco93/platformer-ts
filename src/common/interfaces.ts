// common interfaces

// basic settings for kaboom
export interface IKaboomSettings {
  width: number;
  height: number;
  scale: number;
  letterbox: boolean;
  global: boolean;
}

// Specifies which parts of the sprite to use for the animations
export interface IAnimFrameSpecs {
  from: number;
  to: number;
  speed: number;
  loop: boolean;
}

export interface SpriteAnim {
  [key: string]: number | IAnimFrameSpecs;
}

export interface ISpriteSpecs {
  sliceX: number;
  sliceY: number;
  anims: SpriteAnim;
}

export interface ISpawnPoints {
  [key: string]: { x: number; y: number }[];
}
