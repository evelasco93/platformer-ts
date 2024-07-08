import { Animations } from "./common/animations";
import { ISpriteSpecs } from "./common/interfaces";
import { k } from "./kaboomCtx";
import { createMap } from "./utils";

// Function to import the sprites for the game
async function gameSetup() {
  const spriteSettings: ISpriteSpecs = {
    sliceX: 9,
    sliceY: 10,
    anims: {
      playerbIdle: 0,
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
    k.add(level1Layout)
  });

  k.go("level-1");
}

gameSetup();
