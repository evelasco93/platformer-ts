import { IAnimFrameSpecs } from "./interfaces";

export class Animations {
  static inhaleFx: IAnimFrameSpecs = {
    from: 3,
    to: 8,
    speed: 15,
    loop: true,
  };

  static flameFx: IAnimFrameSpecs = {
    from: 36,
    to: 37,
    speed: 4,
    loop: true,
  };

  static enemyWalkFx: IAnimFrameSpecs = {
    from: 18,
    to: 19,
    speed: 4,
    loop: true,
  };

  static birdAnimFx: IAnimFrameSpecs = {
    from: 27,
    to: 28,
    speed: 4,
    loop: true,
  };
}
