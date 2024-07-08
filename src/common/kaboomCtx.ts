import kaboom from "kaboom";
import { IKaboomSettings } from "./interfaces";
import { scale } from "./constants";

// Defining the base settings for our kaboom instance

const kaboomSettings: IKaboomSettings = {
  width: 256 * scale,
  height: 144 * scale,
  scale,
  letterbox: true,
  global: false,
};

export const k = kaboom({
  ...kaboomSettings,
});
