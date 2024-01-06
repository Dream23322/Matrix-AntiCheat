import { world, system, PlayerSpawnAfterEvent } from "@minecraft/server";
import { ActionFormData } from  "@minecraft/server-ui";
import { flag, c, isAdmin, kick } from "../../Assets/Util";
import lang from "../../Data/Languages/lang";

/**
 * @author RaMiGanerDev
 * @description anti Crashary (ARAS) bot or other bot from attacking the realm.
 * It works by making a verification for the player.
*/

const playerSpawn = ({ intialSpawn: spawn, player }: PlayerSpawnAfterEvent) => {
    if (isAdmin(player)) return
    player.removeTag("matrix:verified")
    // wait 0.1 seconds
    system.runTimeout(() => {
        if (spawn) {
            player.verifyTimer ??= Date.now()
            player.notVerified = true
            player.sendMessage(`§bMatrix §7> §cFor security reason, you cannot chat untill you finished verify process. Please wait until the verify ui be shown`);
        }
    }, 2)
};

const antiBot = () => {
    const players = world.getAllPlayers()
    const now = Date.now()
    for (const player of players) {
            if (!player.notVerified) continue
            if (now - player.verifyTimer >= config.antiBot.timer * 1000 * 60) {
                kick (player, "Matrix AntiCheat", "Expired Verification")
            }
            
            player.verifyClickSpeed = Date.now()

            try {
                const menu = (player) => {
                    if (!player.notVerified) return;
                    player.verifying = true
                    const codeNow = [0,0,0,0,0,0].map(() => Math.floor(Math.random() * 10)).join("")
                    new ModalFormData()
                    .title("Anti Bot")
                    .textField("You need to verify if you're not a bot\nYou have " + Math.floor((now - player.verifyTimer) / 1000) + " seconds left\nEnter the code " + codeNow + " below", "000000", undefined);
                    .show(player).then(({ formValues, canceled }) => {
                    if (!player.notVerified) return;

                    // stop bot from bypassing the ui
                    if (result.cancled || !formValues[0] || codeNow != formValues[0]) {
                        player.verifying = false
                        player.tryVerify ??= 0
                        player.tryVerify++

                        if (player.tryVerify > config.antiBot.maxTry) {
                            kick (player, "Matrix AntiCheat", "Verify Failed")
                            return
                        }
                        system.run(() => menu(player))
                        return
                    } else if (now - player.verifyClickSpeed <= config.antiARAS.clickSpeedThershold * 50 && result.selection == 0) {
                        flag(player, "Bot Attack", "A", config.antiBot.maxVL, config.antiBot.punishment, [lang(">Delay") + ":" + (Date.now() - clickSpeed.get(player.id)).toFixed(2)]);
                        return
                    }
                    player.sendMessage(`§bMatrix §7> §aYou have been verified successfully`)
                    player.notVerified = undefined
                    player.addTag("matrix:verified")
                    }
                                         if (!player.verifying) menu (player)
                    }
            } catch {
                player.verifying = undefined
            }
    }
}

const chatSend = ({ sender }: ChatSendAfterEvent) => {
    if (player.notVerified && player.verifying) {
        if (isAdmin(player)) return
        flag(player, "Bot Attack", "B", config.antiBot.maxVL, config.antiBot.punishment, undefined);
    }
}

let id: number

export default {
    enable () {
        world.antiBotEnabled = true
        const players = world.getAllPlayers()
        players.forEach(player => player.verified = true)
        id = system.runInterval(antiBot, 60)
        world.afterEvents.playerSpawn.subscribe(playerSpawn)
    },
    disable () {
        world.antiBotEnabled = undefined
        system.clearRun(id)
        world.afterEvents.playerSpawn.unsubscribe(playerSpawn)
    }
}