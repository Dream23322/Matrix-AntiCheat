import * as Minecraft from "@minecraft/server"
import {
  system,
  ItemStack,
  world,
  ItemEnchantsComponent,
  Vector,
  Container,
  Player,
  Enchantment
} from "@minecraft/server"

const world = Minecraft.world

world.afterEvents.playerSpawn.subscribe((event) => {
  let player = event.player
  try {
    const tags = player.getTags();
    const oldReason = (tags.filter(tag => tag.startsWith("Reason:"))[0] ?? "nothing").replace("Reason:","")
    const oldBy = (tags.filter(tag => tag.startsWith("By:"))[0] ?? "nothing").replace("By:","")
    
    const unban = world.scoreboard.getObjective(player.name.toLowerCase()).displayName
    if (unban == player.name.toLowerCase()) {
      player.removeTag("ban")
      player.removeTag(`Reason:${oldReason}`)
      player.removeTag(`By:${oldBy}`)
      world.scoreboard.removeObjective(player.name.toLowerCase())
      world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ahas been unbanned!`)
    }
  } catch { }
  player.addTag(`skip_check`)
  world.scoreboard.getObjective('skip_check').setScore(player, 100);
  world.scoreboard.getObjective('cps2').setScore(player, 0);
  world.scoreboard.getObjective('tryAutoClicker').setScore(player, 0);
})

function moderation (player) {
  const banTimer = world.scoreboard.getObjective("bantimer").getScore(player.scoreboardIdentity)
  //const cps = world.scoreboard.getObjective("trueCps").getScore(player.scoreboardIdentity)
  const tags = player.getTags()
  const reason = (tags.filter(tag => tag.startsWith("Reason:"))[0] ?? "nothing").replace("Reason:","")
  const by = (tags.filter(tag => tag.startsWith("By:"))[0] ?? "nothing").replace("By:","")
  
  if (player.hasTag("freeze")) {
    const freezePos = {
      x: world.scoreboard.getObjective("freezeX").getScore(player.scoreboardIdentity),
      y: world.scoreboard.getObjective("freezeZ").getScore(player.scoreboardIdentity),
      z: world.scoreboard.getObjective("freezeY").getScore(player.scoreboardIdentity)
    }
    
    player.teleport(freezePos)
  }
  if (banTimer == 0 && player.hasTag("ban")) {
    world.scoreboard.getObjective('bantimer').setScore(player, 40);
    player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are banned!\n§r§8 >> §gReason§8:§c${reason}\n§8 >> §gBy§8:§c${by}`)
  }
}

export class moderateAction {
  player;
  playerName;
  admin;

  constructor (player, admin) {
    this.admin = admin ?? undefined
    if (typeof player !== "object") {
      this.player = world.getPlayers({ name: player })[0]
      this.playerName = player
      //RaMi only use name sometime..
    } else {
      this.player = player
      this.playerName = player.name
    }
  }

  ban (reason) {
    const player = this.player
    const admin = this.admin
    world.sendMessage(`§e[§cMatrix§e] §b${target.name} §chas been banned from server\n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.addTag("ban")
    player.addTag(`Reason:${reason ?? 'no reason specific'}§r`)
    player.addTag(`By:${admin.name ?? 'System'}§r`)
    world.scoreboard.getObjective('bantimer').setScore(player, 40)
    player.runCommand(`kick "${target}" .\n§8 >> §c§lYou are banned!\n§r§8 >> §gReason§8:§c${reason}\n§8 >> §gBy§8:§c${admin.name}`)
  }

  kick (reason) {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${target.name} §chas been kicked from server\n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.runCommand(`kick "${player.name}" .\n§8 >> §c§lYou are kicked!\n§r§8 >> §gReason§8:§c${reason ?? 'no reason specific'}\n§8 >> §gBy§8:§c${admin.name ?? 'System'}`)
  }

  freeze (reason, pos) {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been frozen \n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.addTag('freeze')
    world.scoreboard.getObjective('freezeX').setScore(player, Math.floor(pos.x))
    world.scoreboard.getObjective('freezeY').setScore(player, Math.floor(pos.y))
    world.scoreboard.getObjective('freezeZ').setScore(player, Math.floor(pos.z))
  }

  mute (reason) {
    const player = this.player
    const admin = this.admin
    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §chas been muted \n§gBy§8:§b${admin.name ?? 'System'}\n§gReason§8:§c${reason ?? 'no reason specific'}`)
    player.addTag('mute')
  }

  unban () {
    const player = this.playerName
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player} §ais currently unbanned\n§gBy§8:§b${admin.name}`)
    try {
      world.scoreboard.addObjective(player.toLowerCase(), player.toLowerCase())
    } catch { }
  }

  unmute () {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ais currently unmuted!\n§gBy§8:§b${admin.name ?? 'System'}`)
    player.removeTag('mute')
  }
  
  unfreeze () {
    const player = this.player
    const admin = this.admin

    world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ahas been unfreeze\n§gBy§8:§b${admin.name}`)
    player.removeTag('freeze')
  }
}

export { moderation }