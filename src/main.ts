import { GameObj } from "kaboom";
import { Animations } from "./common/animations";
import { Player } from "./utils/player";
import { ISpriteSpecs } from "./common/interfaces";
import { PlayerGameObj } from "./common/types";
import { k } from "./common/kaboomCtx";
import { createMap } from "./utils/createmap";
import { Enemy } from "./utils/enemy";
import { globalGameState } from "./common/state";

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
  k.loadSprite("level-2", "./level-2.png");

  const { mapLayout: level1Layout, spawnPoints: level1SpawnPoints } =
    await createMap(k, "level-1");

  const { mapLayout: level2Layout, spawnPoints: level2SpawnPoints } =
    await createMap(k, "level-2");

  k.scene("level-1", () => {
    globalGameState.setCurrentScene("level-1");
    globalGameState.setNextScene("level-2");
    k.setGravity(2100);
    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#CCE2CB")),
      k.fixed(),
    ]);
    k.add(level1Layout);

    const player: GameObj = Player.createPlayer(
      k,
      level1SpawnPoints.player[0].x,
      level1SpawnPoints.player[0].y
    );

    Player.setPlayerControls(k, player as PlayerGameObj);
    k.add(player);
    k.camScale(k.vec2(0.7, 0.7));
    k.onUpdate(() => {
      if (player.pos.x < level1Layout.pos.x + 432)
        k.camPos(player.pos.x + 500, 800);
    });

    for (const flame of level1SpawnPoints.flame) {
      Enemy.makeFlameEnemy(k, flame.x, flame.y);
    }

    for (const guy of level1SpawnPoints.enemy) {
      Enemy.makeGuyEnemy(k, guy.x, guy.y);
    }

    for (const bird of level1SpawnPoints.bird) {
      const speeds = [100, 200, 300];
      k.loop(10, () => {
        Enemy.makeBirdEnemy(
          k,
          bird.x,
          bird.y,
          speeds[Math.floor(Math.random() * speeds.length)]
        );
      });
    }
  });

  k.scene("level-2", () => {
    globalGameState.setCurrentScene("level-2");
    globalGameState.setNextScene("level-1");
    k.setGravity(2100);
    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#CCE2CB")),
      k.fixed(),
    ]);
    k.add(level2Layout);

    const player: GameObj = Player.createPlayer(
      k,
      level2SpawnPoints.player[0].x,
      level2SpawnPoints.player[0].y
    );

    Player.setPlayerControls(k, player as PlayerGameObj);
    k.add(player);
    k.camScale(k.vec2(0.7, 0.7));
    k.onUpdate(() => {
      if (player.pos.x < level2Layout.pos.x + 2100)
        k.camPos(player.pos.x + 500, 800);
    });

    for (const flame of level2SpawnPoints.flame) {
      Enemy.makeFlameEnemy(k, flame.x, flame.y);
    }

    for (const guy of level2SpawnPoints.enemy) {
      Enemy.makeGuyEnemy(k, guy.x, guy.y);
    }

    for (const bird of level2SpawnPoints.bird) {
      const speeds = [100, 200, 300];
      k.loop(10, () => {
        Enemy.makeBirdEnemy(
          k,
          bird.x,
          bird.y,
          speeds[Math.floor(Math.random() * speeds.length)]
        );
      });
    }
  });

  k.scene("end", () => {}); //TODO: Implement ending scene

  k.go("level-1");
}

gameSetup();
