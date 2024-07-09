import { GameObj, KaboomCtx } from "kaboom";
import { scale } from "../common/constants";

export class Enemy {
  static makeFlameEnemy(k: KaboomCtx, posX: number, posY: number): GameObj {
    const flame = k.add([
      k.sprite("assets", { anim: "flame" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(4, 6), 8, 10),
        collisionIgnore: ["enemy"],
      }),
      k.body(),
      k.state("idle", ["idle", "jump"]),
      { isInhalable: false },
      "enemy",
    ]);

    Enemy.makeInhalable(k, flame);

    flame.onStateEnter("idle", async () => {
      await k.wait(1);
      flame.enterState("jump");
    });

    flame.onStateEnter("jump", async () => {
      flame.jump(1000);
    });

    flame.onStateUpdate("jump", async () => {
      if (flame.isGrounded()) {
        flame.enterState("idle");
      }
    });

    return flame;
  }

  static makeGuyEnemy(k: KaboomCtx, posX: number, posY: number): GameObj {
    const guy = k.add([
      k.sprite("assets", { anim: "enemyWalk" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(2, 3.9), 12, 12),
        collisionIgnore: ["enemy"],
      }),
      k.body(),
      k.state("idle", ["idle", "left", "right", "jump"]),
      { isInhalable: false, speed: 100 },
      "enemy",
    ]);

    Enemy.makeInhalable(k, guy);

    guy.onStateEnter("idle", async () => {
      await k.wait(1);
      guy.enterState("left");
    });

    guy.onStateEnter("left", async () => {
      guy.flipX = false;
      await k.wait(2);
      guy.enterState("right");
    });

    guy.onStateUpdate("left", () => {
      guy.move(-guy.speed, 0);
    });

    guy.onStateEnter("right", async () => {
      guy.flipX = true;
      await k.wait(2);
      guy.enterState("left");
    });

    guy.onStateUpdate("right", () => {
      guy.move(guy.speed, 0);
    });

    return guy;
  }

  static makeBirdEnemy(
    k: KaboomCtx,
    posX: number,
    posY: number,
    speed: number
  ): GameObj {
    const bird = k.add([
      k.sprite("assets", { anim: "birdAnim" }),
      k.scale(scale),
      k.pos(posX * scale, posY * scale),
      k.area({
        shape: new k.Rect(k.vec2(4, 6), 8, 10),
        collisionIgnore: ["enemy"],
      }),
      k.body({isStatic: true}),
      k.move(k.LEFT, speed),
      k.offscreen({ destroy: true, distance: 400 }),
      { isInhalable: false },
      "enemy",
    ]);

    Enemy.makeInhalable(k, bird);

    return bird;
  }

  private static makeInhalable(k: KaboomCtx, enemy: GameObj) {
    enemy.onCollide("inhaleZone", () => {
      enemy.isInhalable = true;
    });

    enemy.onCollideEnd("inhaleZone", () => {
      enemy.isInhalable = false;
    });

    enemy.onCollide("shootingStar", (shootingStar: GameObj) => {
      k.destroy(enemy);
      k.destroy(shootingStar);
    });

    const playerRef = k.get("player")[0];
    enemy.onUpdate(() => {
      if (playerRef.isInhaling && enemy.isInhalable) {
        if (playerRef.direction === "right") {
          enemy.move(-800, 0);
          return;
        }
        enemy.move(800, 0);
      }
    });
  }
}
