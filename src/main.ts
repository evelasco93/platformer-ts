import { GameObj } from "kaboom";
import { Animations } from "./common/animations";
import { Player } from "./entities";
import { ISpriteSpecs } from "./common/interfaces";
import { PlayerGameObj } from "./common/types";
import { k } from "./kaboomCtx";
import { createMap } from "./utils";

// basic settings for the sprite being used for the map
export const spriteSettings: ISpriteSpecs = {
  sliceX: 9,
  sliceY: 10,
  anims: {
    playerIdle: 0,
    playerInhaling: 1,
    playerFull: 2,
    playerInhaleFx: Animations.inhaleFx,
    shootingStar: 9,
    flame: Animations.flameFx,
    enemyIdle: 18,
    enemyWalk: Animations.enemyWalkFx,
    birdAnim: Animations.birdAnimFx,
  },
};

// Function to set up all needed assets for the game
async function gameSetup() {
  await k.loadSprite("assets", "./platformer-sprite.png", spriteSettings);
  k.loadSprite("level-1", "./level-1.png");

  const { mapLayout: level1Layout, spawnPoints: level1SpawnPoints } =
    await createMap(k, "level-1");

  k.scene("level-1", () => {
    k.setGravity(2100);
    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#f7d7db")),
      k.fixed(),
    ]);
    k.add(level1Layout);

    const player: GameObj = Player.createPlayer(
      k,
      level1SpawnPoints.player[0].x,
      level1SpawnPoints.player[0].y
    );


    Player.setControls(k, player as PlayerGameObj);
    k.add(player);
    k.camScale(k.vec2(0.7, 0.7));
    k.onUpdate(() => {
      if (player.pos.x < level1Layout.pos.x + 432)
        k.camPos(player.pos.x + 500, 800);
    });
  });

  k.go("level-1");
}

gameSetup();
