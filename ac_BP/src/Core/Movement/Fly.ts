import { GameMode, Vector3, Dimension, Player, world, PlayerBreakBlockAfterEvent, PlayerPlaceBlockAfterEvent } from "@minecraft/server";
import { bypassMovementCheck, isSpawning } from "../../Assets/Util";
import { MinecraftEffectTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import { configi, registerModule } from "../Modules";
import { MatrixUsedTags } from "../../Data/EnumData";
import { isSpikeLagging } from "../../Assets/Public";
import flag from "../../Assets/flag";

interface FlyData {
    previousLocations: Vector3;
    velocityLog: number;
    lastHighVelocity: number;
    flyFlags: number;
    lastFlag: number;
    lastFlag2: number;
    lastVelLog: number;
    lastVelocity: number;
    previousVelocity: number;
    previousHighVelocity: number;
    velocityDiffList: number[];
    lastAverge?: number;
    onGroundLoc: Vector3;
    lastTouchWater: number;
    lastMoveBlock: number;
    highestY?: number;
    untill: {
        gliding: boolean;
        explode: boolean;
    };
}
interface IncludeStairDataInput {
    location: Vector3;
    dimension: Dimension;
}

/**
 * @author RaMiGamerDev
 * @description Code rewrite by jasonlaubb
 * A efficient vertical movement check based on bds prediction
 */

const flyData = new Map<string, FlyData>();
const includeStair = ({ location: { x: px, y: py, z: pz }, dimension }: IncludeStairDataInput) => {
    try {
        return [dimension.getBlock({ x: Math.floor(px), y: Math.floor(py), z: Math.floor(pz) })?.typeId, dimension.getBlock({ x: Math.floor(px), y: Math.floor(py) - 1, z: Math.floor(pz) })?.typeId].includes("stair");
    } catch {
        return false;
    }
};
function antiFly(player: Player, now: number, config: configi) {
    const data = flyData.get(player.id);
    if (!data) {
        flyData.set(player.id, {
            previousLocations: player.location,
            velocityLog: 0,
            lastVelLog: 0,
            lastHighVelocity: 0,
            previousHighVelocity: 0,
            previousVelocity: undefined!,
            lastFlag: now,
            lastFlag2: now,
            flyFlags: 0,
            lastVelocity: 0,
            velocityDiffList: [],
            onGroundLoc: player.location,
            lastTouchWater: 0,
            lastMoveBlock: 0,
            untill: {
                gliding: false,
                explode: false,
            },
        });
        return;
    }
    const { y: velocity, x, z } = player.getVelocity();
    const xz = Math.hypot(x, z);
    if (velocity <= config.antiFly.highVelocity && velocity >= 0) {
        data.previousLocations = player.location;
        data.velocityLog = 0;
    }
    if (velocity == 0 && xz == 0 && player.isOnGround) {
        data.onGroundLoc = player.location;
    }
    if (player.isInWater) {
        data.lastTouchWater = now;
    }
    if (!player.isOnGround) {
        data.highestY ??= player.location.y;
        if (player.location.y > data.highestY) data.highestY = player.location.y;
    } else {
        delete data.highestY;
    }
    if (data.untill.gliding) {
        if (player.isOnGround && !player.isGliding) data.untill.gliding = false;
    } else if (player.isGliding) {
        data.untill.gliding = true;
    }
    if (data.untill.explode) {
        player.lastExplosionTime ??= 0;
        if (now - player.lastExplosionTime > 500 && player.isOnGround) data.untill.explode = false;
    } else if (now - player.lastExplosionTime < 500) {
        data.untill.gliding = true;
    }
    const jumpBoost = player.getEffect(MinecraftEffectTypes.JumpBoost);
    const levitation = player.getEffect(MinecraftEffectTypes.Levitation);
    const instair = includeStair(player);
    const skip1 = !(player.lastExplosionTime && now - player.lastExplosionTime < 5500) && !(player.threwTridentAt && now - player.threwTridentAt < 5000) && !player.hasTag(MatrixUsedTags.knockBack);
    //const skip2 = !player.isFlying && !player.isGliding;
    //const skip3 = !(jumpBoost && jumpBoost?.amplifier > 2) && !(levitation && levitation?.amplifier > 2);
    if (bypassMovementCheck(player) || (jumpBoost && jumpBoost.amplifier > 2) || (levitation && levitation.amplifier > 2)) {
        flyData.set(player.id, data);
        return;
    }
    //const flyMovement = data.velocityLog > 1 && velocity <= 0;
    //const clientFly = data.velocityLog > 0 && player?.lastVelLog == data.velocityLog;
    /*
    if (!player.isOnGround && clientFly && flyMovement && skip1 && skip2 && skip3 && velocity != 1 && !instair) {
        const lastflag = data.lastFlag;
        player.teleport(data.previousLocations);
        if (lastflag && now - lastflag <= 5000 && now - lastflag >= 500) flag(player, "Fly", "A", config.antiFly.maxVL, config.antiFly.punishment, ["velocityY" + ":" + data.lastHighVelocity.toFixed(2)]);
        data.velocityLog = 0;
        data.previousVelocity = undefined!;
        data.lastFlag = now;
    }*/
    data.lastVelLog = data.velocityLog;
    if (data.velocityLog == 1 && !instair && velocity <= 0.2) {
        const lastflag = data.lastFlag2;
        data.flyFlags++;
        const notSL = !isSpikeLagging(player);
        if ((data.lastVelocity >= -0.95 && data.lastVelocity <= -0.1) || (data.lastVelocity <= 0.42 && data.lastVelocity >= -0.03)) {
            if (notSL && (xz > 0 || player.lastXZLogged > 0) && (data.lastHighVelocity >= 7 || (data.flyFlags >= 2 && now - lastflag >= 450 && now - lastflag <= 1000))) {
                flag(player, config.antiFly.modules, "B");
                player.teleport(data.previousLocations);
                data.flyFlags++;
            } else if (data.flyFlags >= 2) data.flyFlags = 0;
            if (notSL && player.location.y - data.previousLocations.y >= config.antiFly.maxGroundPrviousVelocity && data.lastHighVelocity >= 0.7 && !isSpawning(player)) {
                if (now - lastflag <= 2000) flag(player, config.antiFly.modules, "E");
                player.teleport(data.previousLocations);
            }
        }
        if (data.lastHighVelocity >= config.antiFly.maxGroundPrviousVelocity && (player.isOnGround || player.isClimbing)) {
            if (now - lastflag <= 5000) flag(player, config.antiFly.modules, "C");
            player.teleport(data.previousLocations);
        }
        if (data.lastHighVelocity > config.antiFly.maxHighVelocity) {
            flag(player, config.antiFly.modules, "D");
            player.teleport(data.previousLocations);
        }
        data.lastFlag2 = now;
    }
    if (velocity > config.antiFly.highVelocity && skip1) {
        data.velocityLog += 1;
        data.lastHighVelocity = velocity;
    } else if (velocity <= config.antiFly.highVelocity || (velocity == 0 && player.isOnGround) || !skip1) {
        data.velocityLog = 0;
        data.lastVelocity = velocity;
    }
    const fallingDifferent = data.highestY ? data.highestY - player.location.y : 0;
    const badFalling = fallingDifferent < config.antiFly.bypassFallDis && player.isFalling && velocity < config.antiFly.maxFallTerminal;
    const illegalFall = velocity < config.antiFly.illegalFallTerminal;
    if (!player.isOnGround && (badFalling || illegalFall)) {
    }
    data.velocityDiffList.push(velocity - data.lastVelocity);
    if (data.velocityDiffList.length > 10) data.velocityDiffList.shift();
    flyData.set(player.id, data);
}

async function systemEvent(config: configi, player: Player) {
    const data = flyData.get(player.id);
    if (!data || data.velocityDiffList.length < 10) return;
    const average = data.velocityDiffList.reduce((a, b) => a + b, 0) / data.velocityDiffList.length;
    const now = Date.now();
    if (average > 0.7 && now - data.lastMoveBlock > 3500 && average == data.lastAverge && average != 0.1 && !player.isFlying && !player.isOnGround && now - data.lastTouchWater > 1500 && !data.untill.explode && !data.untill.gliding) {
        player.teleport(data.onGroundLoc);
        flag(player, config.antiFly.modules, "A");
    }
    data.lastAverge = average;
    flyData.set(player.id, data);
}

async function playerChangeBlockTrigger(_config: configi, event: PlayerPlaceBlockAfterEvent | PlayerBreakBlockAfterEvent) {
    const player = event.player;
    const data = flyData.get(player.id);
    if (!data) return;
    const block = event.block;
    if (block?.isValid()) {
        data.lastMoveBlock = Date.now();
        flyData.set(player.id, data);
    }
}

registerModule(
    "antiFly",
    false,
    [flyData],
    {
        tickInterval: 1,
        tickOption: { excludeGameModes: [GameMode.creative, GameMode.spectator] },
        intick: async (config, player) => {
            antiFly(player, Date.now(), config);
        },
    },
    {
        tickInterval: 5,
        intick: systemEvent,
        tickOption: { excludeGameModes: [GameMode.creative, GameMode.spectator] },
    },
    {
        worldSignal: world.afterEvents.playerPlaceBlock,
        then: playerChangeBlockTrigger,
    },
    {
        worldSignal: world.afterEvents.playerBreakBlock,
        then: playerChangeBlockTrigger,
    }
);
