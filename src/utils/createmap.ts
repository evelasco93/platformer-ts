import { KaboomCtx } from "kaboom";
import { scale } from "../common/constants";
import { ISpawnPoints } from "../common/interfaces";

export async function createMap(k: KaboomCtx, name: string) {
  const mapData = await (await fetch(`./${name}.json`)).json();
  const mapLayout = k.make([k.sprite(name), k.scale(scale), k.pos(0)]);
  const spawnPoints: ISpawnPoints = {};

  for (const layer of mapData.layers) {
    if (layer.name === "colliders") {
      for (const collider of layer.objects) {
        mapLayout.add([
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            collisionIgnore: ["platform", "exit"],
          }),
          collider.name !== "exit" ? k.body({ isStatic: true }) : null,
          k.pos(collider.x, collider.y),
          collider.name !== "exit" ? "platform" : "exit",
        ]);
      }
      continue;
    }
    if (layer.name === "spawns") {
      for (const spawnPoint of layer.objects) {
        if (spawnPoints[spawnPoint.name]) {
          spawnPoints[spawnPoint.name].push({
            x: spawnPoint.x,
            y: spawnPoint.y,
          });
          continue;
        }
        spawnPoints[spawnPoint.name] = [{ x: spawnPoint.x, y: spawnPoint.y }];
      }
    }
  }

  return { mapLayout, spawnPoints };
}
