//@ts-check
import {
  world,
  system
} from "@minecraft/server"
import {
  HELP_LIST,
  password,
  prefix,
  UiItemPrefix,
  allowClearingPassword
} from "../config"
import {
  moderateAction
} from "../Moderation/moderation"
import {
  getUIItem
} from "../ui/getItem"

const commandHandler = (input) => {
  const regex = /(["'])(.*?)\1|\S+/g
  const matches = input.match(regex)
  const command = matches.shift().slice(prefix.length)
  const args = matches.map(arg => arg.replace(/^[@"]/g, '').replace(/"$/, ''))
  return [command, ...args]
}

const Real = (input, user, allowAdmin, canSelf) => {
  let target
  try {
    target = world.getPlayers({
      name: input
    })[0]
    if (target.id === user.id && canSelf !== true) throw "same target"
    if (allowAdmin !== true && target.hasTag('MatrixOP')) throw "target is admin"
  } catch {
    target = undefined
  }
  return target
}

class Error {
  user;
  constructor(user) {
    this.user = user
  }
  Target() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cTarget should be valid for this command!`))
  }
  None(regax) {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cthis command doesnt exist >> §g${regax} §c<<`))
  }
  NoOp() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cSorry but you don't have permisson to use this command.`))
  }
  Unexpact() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cA unknown error happened.`))
  }
  NotTurner() {
    system.run(() => this.user.sendMessage(`§e[§cMatrix§e] §cOnly allow §genable §cand §gdisable§c here.`))
  }
}

function Commands(player, message) {
  const regax = [...commandHandler(message)]

  switch (regax[0]) {
    //Op and deop
    case "op": {
      if (!player.hasTag("MatrixOP") {
        if (world.getDynamicProperty("password") ?? password === regax[1]) {
          system.run(() => {
            player.addTag('MatrixOP')
            player.setDynamicProperty("isAdmin", true)
            world.sendMessage(`§e[§cMatrix§e] §b${player.name} §ais opped Matrix`)
          })
        } else {
          system.run(() => {
            player.sendMessage(`§e[§cMatrix§e] §cIncorrect password`)
          })
        }
      } else {
        const target = Real(regax[1], player, false, false)
        if (target === undefined) return new Error(player).Target()
        system.run(() => {
          target.addTag("MatrixOP")
          target.setDynamicProperty("isAdmin", true)
          world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ais opped Matrix\n§gBy:§c${player.name}`)
        })
      }
      break
    }
    case "setPassword": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const passwordNow = world.getDynamicProperty("password") ?? password
      if (regax[1] !== passwordNow) return system.run(() => player.sendMessage(`§e[§cMatrix§e] §cIncorrect password`))
      if (regax[2] === undefined || regax[2].length <= 3) return system.run(() => player.sendMessage(`§e[§cMatrix§e] §cYour password too short! At least 4 charter!`))

      system.run(() => {
        world.setDynamicProperty("password", regax[2])
        world.sendMessage(`§e[§cMatrix§e] §bPassword has been changed!\n§cBy:§g${player.name}`)
        player.sendMessage(`§e[§cMatrix§e] §cPassword has been changed to >>§g ${regax[2]} §c<<`)
      }
    }
    case "clearPassword": {
      if (allowClearingPassword !== true) return system.run(() => player.sendMessage(`§e[§cMatrix§e] §cThis command is disabled.\nPlease edit config file and set "allowClearingPassword" to true`)
      if (regax[1] === password) {
        system.run(() => {
          world.sendMessage(`§e[§cMatrix§e] §bPassword has been cleared!\n§cBy:§g${player.name}`)
          world.setDynamicProperty("password", undefined)
        })
      } else {
        system.run(() => {
          player.sendMessage(`§e[§cMatrix§e] §cIncorrect password`)
        })
      }
    }
    case "deop": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true, true)
      if (target === undefined) return new Error(player).Target()
      system.run(() => {
        target.removeTag('MatrixOP')
        target.setDynamicProperty("isAdmin", undefined)
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §chis op has been removed\n§gBy§8:§b${player.name}`)
      })
      break
    }
    //Mod command
    case "ban": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).ban(regax[2]))
      break
    }
    case "unban": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (regax[1] === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).unban())
      break
    }
    case "mute": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).mute(regax[2]))
      break
    }
    case "unmute": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).unmute())
      break
    }
    case "freeze": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).freeze(regax[2]))
      break
    }
    case "unfreeze": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).unfreeze())
      break
    }
    case "kick": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()
      system.run(() => new moderateAction(target, player).ban(regax[2]))
      break
    }
    case "inventoryCheck": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()

      system.run(() => new moderateAction(target, player).seeInv())
      break
    }
    case "itemCheck": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player)
      if (target === undefined) return new Error(player).Target()

      system.run(() => new moderateAction(target, player).seachInv())
      break
    }
    case "rank": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()
      if (regax[2] === undefined) return player.sendMessage(`§e[§cMatrix§e] §cRank should be valid`)

      target.getTags().filter(t => t.startsWith('rank:')).forEach(f => player.removeTag(f))
      target.addTag(`rank:${regax[2]}`)
      world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahis rank has been changed\n§gBy§8:§b${player.name}\n§gRank§8:§r${regax[2]}`)
      break
    }

    //Other command
    case "runCommand": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => {
        try {
          player.runCommand(regax[1])
          player.sendMessage(`§e[§cMatrix§e] §ccommand run sucessfully`)
        } catch (e) {
          player.sendMessage(`§e[§cMatrix§e] §ccommand runned with error ${e}`)
        }
      })
      break
    }
    case "ui": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => {
        getUIItem(player, UiItemPrefix)
      })
      break
    }
    case "notify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been put for get cheats notification\n§gBy§8:§b${player.name}`)
        target.addTag('notify')
      })
      break
    }
    case "unnotify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been removed from get cheats notification\n§gBy§8:§b${player.name}`)
        target.removeTag('notify')
      })
      break
    }
    case "xray_notify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been put for get xray notification\n§gBy§8:§b${player.name}`)
        target.addTag('notifyXray')
      })
      break
    }
    case "xray_unnotify": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      const target = Real(regax[1], player, true)
      if (target === undefined) return new Error(player).Target()

      system.run(() => {
        world.sendMessage(`§e[§cMatrix§e] §b${target.name} §ahas been put for get xray notification\n§gBy§8:§b${player.name}`)
        target.removeTag('notifyXray')
      })
      break
    }
    case "help": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => player.sendMessage(HELP_LIST))
    }
    case "toggles": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      system.run(() => player.sendMessage(`§c§lToggles§8:§r\n§ganti speed toggle §8(§cantiSpeed§8)\n§ganti reach toggle§8 (§cantiReach§8<§greach_type§8>§8) §greach types§8:\n§gbreak§8:§cB\n§gplace§8:§cP\n§gAttack§8:§cA\n§ganti nuker toggle§8 (§cantiNuker§8)\n§ganti speed mine toggle§8 (§cantiSpeedMine§8)\n§ganti xray toggle §8(§cantiXray§8)\n§ganti scaffold toggle §8(§cantiScaffold)\n§ganti auto clicker toggle §8(§cantiAuto§8<§cAuto clicker type§8>)§g\nauto clicker types§8:\n§gAuto clicker attack§8:§cA\n§gAuto clicker place§8:§cP\n§ganti crasher toggle §8(§cantiCrasher§8)\n§ganti fly toggle §8(§cantiFly§8)\n§gabadpacket toggle §8(§cantiBadpacket§8)\n§gainvalidSprint toggle §8(§cantiInvalidSprint§8)`))
      break
    }

    //Toggle command
    case "antiXray": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti xray has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:xray", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti xray has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:xray", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiNuker": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti nuker has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:nuker", undefined)
            
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti nuker has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:nuker", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiAutoA": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:auto", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto clicker has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:auto", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiKillaura": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti Killaura has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:killaura", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti Killaura has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:killaura", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiReachA": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachA has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:reachA", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachA has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:reachA", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiReachB": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachB has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:reachB", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reachA has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:reachB", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiReachP": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reach place has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:reachP", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti reach place has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:reachP", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiScaffold": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti scaffold has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:scaffold", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti scaffoldA has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:scaffold", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiAutoP": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:autoP", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:autoP", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiSpeedMine": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti speed mine has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:speedMine", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti speed mine has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:speedMine", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiSpeed": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti speed has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:speed", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti auto place has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:speed", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiCrasher": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti crasher has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:crasher", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti crasher has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:crasher", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiFly": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti fly has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:fly", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti fly has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:fly", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiBadpacket": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti badpacket has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:badpacket", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti badpacket has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:badpacket", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "antiInvalidSprint": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti InvalidSprint has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:invalidsprint", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti InvalidSprint has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:invalidsprint", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    case "chatRanks": {
      if (!player.hasTag('MatrixOP')) return new Error(player).NoOp()
      switch (regax[1]) {
        case "enable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti chat ranks has enabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:chatrank", undefined)
          })
          break
        }
        case "disable": {
          system.run(() => {
            world.sendMessage(`§e[§cMatrix§e] §aanti chat ranks has disabled§r\n§gBy§8:§b${player.name} `)
            world.setDynamicProperty("toggle:chatrank", true)
          })
          break
        }
        default:
          new Error(player).NotTurner()
      }
      break
    }
    default: {
      new Error(player).None(regax[0])
    }
  }
}

export {
  Commands
}
