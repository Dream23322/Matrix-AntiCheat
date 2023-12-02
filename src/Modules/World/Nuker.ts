import {
    Block,
    GameMode,
    Player,
    PlayerBreakBlockBeforeEvent,
    PlayerLeaveAfterEvent,
    system,
    world
} from "@minecraft/server";
import { flag, isAdmin, c } from "../../Assets/Util";
import { MinecraftBlockTypes } from "../../node_modules/@minecraft/vanilla-data/lib/index";
import fastBrokenBlocks from "../../Data/FastBrokenBlocks";
import lang from "../../Data/Languages/lang";

const blockBreakData = new Map<string, number[]>();

/**
 * @author jasonlaubb
 * @description This checks if a player is using Nuker in Minecraft Bedrock.
 * it detects if a player breaks more than 5 blocks in a tick.
 */

async function AntiNuker (player: Player, block: Block) {
    if (player.hasTag("matrix:break-disabled")) {
        return;
    }
    const config = c()
    
    const timeNow = Date.now();

    //get the block break count in the 1 tick
    let blockBreakCount: number[] = blockBreakData.get(player.id)?.filter(time => timeNow - time < 50) ?? [];

    //if the block not the fast broken block, push the block right now
    if (!fastBrokenBlocks.includes(block.typeId as MinecraftBlockTypes)) {
        blockBreakCount.push(timeNow);
    };

    blockBreakData.set(player.id, blockBreakCount);

    //if block break is in 1 tick is higher than the limit, flag them
    if (blockBreakCount.length > config.antiNuker.maxBreakPerTick) {
        player.addTag("matrix:break-disabled");
        block.dimension.getEntities({ location: block.location, maxDistance: 2, minDistance: 0, type: "minecraft:item" }).forEach((item) => item.kill() )
        block.setPermutation(block.permutation.clone())

        //prevent the player from breaking blocks for 3 seconds
        system.runTimeout(() => player.removeTag("matrix:break-disabled"), config.antiNuker.timeout);
        player.runCommand('gamemode @s ' + GameMode.adventure)
        blockBreakData.delete(player.id);
        flag(player, "Nuker", "A", config.antiNuker.maxVL, config.antiNuker.punishment, [lang(">Block") + ":" + block.typeId]);
        return
    }


}

const antiNuker = (event: PlayerBreakBlockBeforeEvent) => {
    const { player, block } = event;
    if (isAdmin (player)) return;

    AntiNuker (player, block)
};

const playerLeave = (({ playerId }: PlayerLeaveAfterEvent) => {
    blockBreakData.delete(playerId);
})

export default {
    enable () {
        world.beforeEvents.playerBreakBlock.subscribe(antiNuker)
        world.afterEvents.playerLeave.subscribe(playerLeave)
    },
    disable () {
        blockBreakData.clear()
        world.beforeEvents.playerBreakBlock.unsubscribe(antiNuker)
        world.afterEvents.playerLeave.unsubscribe(playerLeave)
    }
}