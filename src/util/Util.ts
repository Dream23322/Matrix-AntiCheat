import config from '../data/config.js';
import {
  Player,
  world,
  Vector3,
  GameMode } from '@minecraft/server';
import { ModuleClass, Console } from '../data/class.js';

const GOBAL_VL = new Map<string, number>();
const CLEAR_VL = new Map<string, string[]>();

export default class {
  static flag(player: Player, module: ModuleClass, information: string) {
    if (!(module instanceof ModuleClass)) return Console.warn('(flag system) Module type error');
    if (!(module instanceof Player)) return Console.warn(`(flag system) player is not Player type`);

    let flagVL: number = GOBAL_VL.get(`${player.id}+${module.name}`) ?? 0;
    flagVL += 1;
    GOBAL_VL.set(`${player.id}+${module.name}`, flagVL);
    if (!CLEAR_VL.get(player.id)!.includes(module.name)) {
      const clearvl: Array<string> = CLEAR_VL.get(player.id) ?? [];
      //@ts-expect-error
      CLEAR_VL.set(player.id, clearvl.push(module.name))
    };

    if (config.notify.flagMsg) {
      const showingInformation: string = information === "undefined" ? '' : ` §9[${information}]`;
      world.sendMessage(`§dNokararos §f> §e${player.name} §7failed §e${module.name}${showingInformation} §7VL=${flagVL}`);
    };
  };

  static flagClear (player: string) {
    const clearvl: Array<string> = CLEAR_VL.get(player) ?? [];
    if (clearvl.length <= 0) return false;
    clearvl.forEach(m => GOBAL_VL.delete(`${player}+${m}`));
    CLEAR_VL.delete(player);
    return true
  };

  static isAdmin (player: Player) {
    return player.getDynamicProperty('NAC:admin_data') === true ? true : false
  };

  static getGamemode (player: Player) {
    const gamemodes = {
      survival: 0,
      creative: 1,
      adventure: 2,
      spectator: 3
    };
    
    for (const gamemode in GameMode) {
      if ([...world.getPlayers({
        name: player.name,
      //@ts-expect-error
        gameMode: GameMode[gamemode]
      //@ts-expect-error
      })].length > 0) return Number(gamemodes[GameMode[gamemode]])
    };
    return 0
  };

  static getAngleWithRotation (player: Player, pos1: Vector3, pos2: Vector3) {
    let angle: number = Math.atan2((pos2.z - pos1.z), (pos2.x - pos1.x)) * 180 / Math.PI - player.getRotation().y - 90;
    if (angle <= -180) angle += 360;
    angle = Math.abs(angle);
    return angle
  };

  static getVector2Distance (pos1: Vector3, pos2: Vector3) {
    return (Math.sqrt(pos1.x - pos2.x) ** 2 + (pos2.z - pos2.z) ** 2)
  }
};