import { GameObj, KaboomCtx } from "kaboom";
import { scale } from "../common/constants";
import { PlayerGameObj } from "../common/types";
import { globalGameState } from "../common/state";

// creating Player class to make it cleaner
export class Player {
  // function to create a new player entity
  static createPlayer(k: KaboomCtx, posX: number, posY: number): GameObj {
    const player: GameObj = k.make([
      k.sprite("assets", { anim: "playerIdle" }),
      k.area({ shape: new k.Rect(k.vec2(4, 5.9), 8, 10) }),
      k.body(),
      k.pos(posX * scale, posY * scale),
      k.scale(scale),
      k.doubleJump(10),
      k.health(3),
      k.opacity(1),
      {
        speed: 300,
        direction: "right",
        isInhaling: false,
        isFull: false,
      },
      "player",
    ]);
    // collider function for enemies
    player.onCollide("enemy", async (enemy: GameObj) => {
      if (player.isInhaling && enemy.isInhalable) {
        player.isInhaling = false;
        k.destroy(enemy);
        player.isFull = true;
        return;
      }

      if (player.hp() === 0) {
        k.destroy(player);
        k.go(globalGameState.currentScene);
        return;
      }

      player.hurt();
      await k.tween(
        player.opacity,
        0,
        0.05,
        (val) => (player.opacity = val),
        k.easings.linear
      );

      await k.tween(
        player.opacity,
        1,
        0.05,
        (val) => (player.opacity = val),
        k.easings.linear
      );
    });
    // collider function for the exit door
    player.onCollide("exit", () => {
      k.go("level-2");
    });
    // inhaling mechanic
    const inhaleEffect: GameObj = k.add([
      k.sprite("assets", { anim: "playerInhaleFx" }),
      k.pos(),
      k.scale(scale),
      k.opacity(0),
      "inhaleEffect",
    ]);
    // hitbox for inhale
    const inhaleZone: GameObj = player.add([
      k.area({ shape: new k.Rect(k.vec2(0), 20, 4) }),
      k.pos(),
      "inhaleZone",
    ]);
    // defning the inhale position value if players is facing left or right
    inhaleZone.onUpdate(() => {
      if (player.direction === "left") {
        inhaleZone.pos = k.vec2(-14, 8);
        inhaleEffect.pos = k.vec2(player.pos.x - 60, player.pos.y + 0);
        inhaleEffect.flipX = true;
        return;
      }
      inhaleZone.pos = k.vec2(14, 8);
      inhaleEffect.pos = k.vec2(player.pos.x + 60, player.pos.y + 0);
      inhaleEffect.flipX = false;
    });
    // resets the player if he falls off the platforms into the bottom of the map
    player.onUpdate(() => {
      if (player.pos.y > 2000) {
        k.go("level-1");
      }
    });

    return player;
  }

  static setPlayerControls(k: KaboomCtx, player: PlayerGameObj) {
    const inhaleEffectRef = k.get("inhaleEffect")[0];
    k.onKeyDown((key) => {
      switch (key) {
        case "a":
          player.direction = "left";
          player.flipX = true;
          player.move(-player.speed, 0);
          break;
        case "d":
          player.direction = "right";
          player.flipX = false;
          player.move(player.speed, 0);
          break;
        case "k":
          if (player.isFull) {
            player.play("playerFull");
            inhaleEffectRef.opacity = 0;
            break;
          }
          player.isInhaling = true;
          player.play("playerInhaling");
          inhaleEffectRef.opacity = 1;
          break;
        default:
      }
    });
    k.onKeyPress((key) => {
      if (key === "j") {
        player.doubleJump();
      }
    });
    k.onKeyRelease((key) => {
      if (key === "k") {
        if (player.isFull) {
          player.play("playerInhaling");
          const shootingStar: GameObj = k.add([
            k.sprite("assets", {
              anim: "shootingStar",
              flipX: player.direction === "right",
            }),
            k.area({ shape: new k.Rect(k.vec2(5, 4), 6, 6) }),
            k.pos(
              player.direction === "left"
                ? player.pos.x - 80
                : player.pos.x + 80,
              player.pos.y + 5
            ),
            k.scale(scale),
            player.direction === "left"
              ? k.move(k.LEFT, 800)
              : k.move(k.RIGHT, 800),
            "shootingStar",
          ]);
          shootingStar.onCollide("platform", () => k.destroy(shootingStar));
          player.isFull = false;
          k.wait(1, () => player.play("playerIdle"));
          return;
        }
        inhaleEffectRef.opacity = 0;
        player.isInhaling = false;
        player.play("playerIdle");
      }
    });
  }
}
