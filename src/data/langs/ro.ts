/** @author selder578 */
export default {
    "-help.helpCDlist": "Listă comenzi:",
    "-help.help": "help - Arată acest mesaj pentru ajutor",
    "-help.toggles": "toggles - Arată toate modulele",
    "-help.toggle": "toggle <module> <enable/disable> - Modifică un modul",
    "-help.op": "op <player> - Dă permisiune de administrator unui jucător",
    "-help.deop": "deop <player> - Elimină permisiunea de administrator a unui jucător",
    "-help.passwords": "passwords <oldPassword> <newPassword> - Schimbă parola",
    "-help.flagmode": "flagmode <all/tag/bypass/admin> - Schimbă modul de notificare",
    "-help.rank": "rank <set/add/remove> <player> <rank> - Schimbă porecla unui jucător",
    "-help.rankclear": "rankclear <player> - Șterge toate poreclele unui jucător",
    "-help.defaultrank": "defaultrank <rank> - Schimbă porecla normală",
    "-help.showallrank": "showallrank <true/false> - Arată toate poreclele în chat",
    "-help.ban": "ban <player> <reason> <timeRegax/forever> - Interzice accesul unui jucător",
    "-help.unban": "unban <player> - Readuce accesul unui jucător",
    "-help.unbanremove": "unbanremove <player> - Șterge un jucător din lista readucerii accesului",
    "-help.unbanlist": "unbanlist - Arată toți jucătorii din lista readucerii accesului",
    "-help.freeze": "freeze <player> - Îngeața un jucător",
    "-help.unfreeze": "unfreeze <player> - Dezgheață un jucator",
    "-help.vanish": "vanish - Fă-te să dispari sau să fii invisibil",
    "-help.unvanish": "unvanish - Nu mai fii dispărut sau invisibil",
    "-help.invcopy": "invcopy <player> - Copiază inventarul unui jucător",
    "-help.invsee": "invsee <player> - Vezi inventarul unui jucător",
    "-help.echestwipe": "echestwipe <player> - Golește ender chest-ul unui jucător",
    "-help.lockdowncode": "lockdowncode <get/set/random> <set: code>/[random: length] - Fă un cod sau parolă pentru închiderea serverului",
    "-help.lockdown": "lockdown <code> - Închide server-ul cu un cod sau parolă",
    "-help.unlock": "unlock <code> - Deschide serverul folosind codul creat",
    "-help.adminchat": "adminchat - Schimbă între conversația cu administratori si cea publică",
    "-help.lang": "lang <language> - Schimbă limba",
    "-help.langlist": "langlist - arată toate limbile",

    "-about.line1": "Matrix este un sistem anticheat pentru bedrock edition bazat pe @minecraft API",
    "-about.version": "Version",
    "-about.author": "Author",

    "-toggles.toggle": "Toggle",
    "-toggles.module": "module",
    "-toggles.toggleList": "Toggle list:",
    "-toggles.unknownModule": "Modul necunoscut, încearcă %atoggles",
    "-toggles.toggleChange": "%a modulul a fost %bd",
    "-toggles.unknownAction": "Acțiune necunoscută, vă rugăm folosiți doar enable/disable",
    "-toggles.already": "Acest modul este %ad deja",

    "-op.hasbeen": "Lui %a I-a fost oferit administrator de către %b",
    "-op.please": "Vă rugăm introduce-ți parola",
    "-op.now": "Acum ești administrator",
    "-op.wrong": "Parolă greșită",
    "-op.wait": "Vă rugăm %a așteptați căteva secunde înainte de a incerca din nou",

    "-deop.lockdown": "Acest server este închis",
    "-deop.notadmin": "%a nu mai este administrator",
    "-deop.hasbeen": "Lui %a i-a fost luat rolul de administrator de către %b",

    "-passwords.oldnew": "Vă rugăm introduceți parola veche și cea nouă",
    "-passwords.wrong": "Parolă greșită",
    "-passwords.changed": "Parola a fost schimbată",

    "-flagmode.unknown": "Acțiune necunoscută, vă rugăm să folosiți doar all/bypass/admin/tag/none",
    "-flagmode.changed": "Modul de notificare a fost schimbat la %a",

    "-rank.unknownAction": "Acțiune necunoscută, vă rugăm folosiți doar set/add/remove",
    "-rank.enter": "Introdu porecla",
    "-rank.hasset": "Porecla lui %a a fost schimbată cu %b",
    "-rank.hasadd": "Porecla lui %a a fost adăugată %b",
    "-rank.already": "%a are deja %b §r§crank",
    "-rank.hasremove": "Porecla lui %a a fost ștearsă",
    "-rank.norank": "%a Nu are o poreclă %b §r§c rank",
    "-rank.empty": "%a Nu are nicio poreclă",

    "-rankclear.has": "Poreclele lui %a au fost șterse",
    "-rankclear.empty": "%a Nu are nicio poreclă",

    "-defaultrank.enter": "Introduceți o poreclă",
    "-defaultrank.has": "Porecla normală a fost schimbată cu %a",

    "-showallrank.unknown": "Acțiune necunoscută, vă rugăm folosiți true/false",
    "-showallrank.has": "Arată toate poreclele a fost schimbat cu %a",

    "-ban.self": "Nu îți poți interzice accesul",
    "-ban.admin": "Nu poți interzice accesul unui administrator",
    "-ban.reason": "Introduceți un motiv",
    "-ban.time": "Folosiți o perioda de timp, de exemplu: 1d20h30m40s",
    "-ban.has": "Lui %a ii s-a interzis accesul de către %b",

    "-unban.self": "Nu îți poți readuce accesul ție însuși",
    "-unban.notban": "Lui %a nu îi este interzis accesul",
    "-unban.add": "%a a intrat în lista de readucere a accesului",

    "-unbanremove.not": "%a nu este în lista de readucere a accesului",
    "-unbanremove.yes": "%a a fost scos din lista de readucere a accesului",

    "-unbanlist.none": "Nu există niciun jucător în această listă",
    "-unbanlist.list": "Unban list",

    "-freeze.self": "Nu te poți îngheța",
    "-freeze.admin": "Nu poți îngheța un administrator",
    "-freeze.has": "%a a fost înghețat de %b",
    "-freeze.already": "%a este deja înghețat",

    "-unfreeze.self": "Nu te poți îngheța",
    "-unfreeze.not": "%a Nu este înghețat",
    "-unfreeze.has": "%a a fost dezghețat de %b",
    "-unfreeze.admin": "Nu poți dezgheța un administrator",

    "-mute.self": "Nu îți poți interzice accesul de a vorbi",
    "-mute.admin": "Nu poți interzice accesul unui administrator de a vorbi",
    "-mute.has": "Lui %a i-a fost interzis accesul de a vorbi de către %b",
    "-mute.already": "Lui %a îi este deja interzis accesul de a vorbi",

    "-unmute.self": "Nu iți poți readuce accesul de a vorbi ție insuși",
    "-unmute.not": "Lui %a nu ii s-a luat accesul de a vorbi",
    "-unmute.has": "Lui %a ii s-a dat accesul de a vorbi de către %b",
    "-unmute.admin": "Nu poți readuce accesul de a vorbi unui administrator",

    "-vanish.has": "Acum ești invisibil",  
    "-vanish.out": "Nu mai ești invisibil",

    "-invcopy.self": "Nu îți poți copia inventarul",
    "-invcopy.not": "Inventarul lui %a a fost copiat",

    "-invsee.self": "Nu iți poți vedea inventarul",
    "-invsee.of": "Inventarul lui %a",

    "-echestwipe.self": "Nu iți poți curăța propriul ender chest",
    "-echestwipe.admin": "Nu poți curăța ender chestul unui administrator",
    "-echestwipe.has": "Ender chestul lui %a a fost curățat de către %b",

    "-lockdowncode.unknown": "Vă rugăm introduceți acțiunea pe care o doriți",
    "-lockdowncode.get": "cod: %a",
    "-lockdowncode.enter": "Introduceți codul",
    "-lockdowncode.set": "Codul de inchidere a serverului a fost schimbat cu %a",
    "-lockdowncode.number": "Lungimea codului trebuie sa fie un număr",
    "-lockdowncode.length": "Vă rugăm introduceți lungimea codului dintre 1 și 128",
    "-lockdowncode.random": "Codul a fost schimbat la ghici cu - %a",
    "-lockdowncode.unknownAction": "Acțiune necunoscută, va rugăm folosiți get/set/random",

    "-lockdown.enter": "Introduceți codul",
    "-lockdown.wrong": "Codul este greșit",
    "-lockdown.already": "Serverul a fost închis de %a",
    "-lockdown.has": "Acest server este acum închis",

    "-unlock.not": "Serverul nu a fost inchis",
    "-unlock.has": "Serverul a fost deschis de %a",

    "-adminchat.has": "Acum ești in canalul administratorilor",
    "-adminchat.out": "Acum ești in canalul public",

    "-lang.enter": "Vă rugăm introduceți o limbă",
    "-lang.unknown": "Limbă necunoscută, încercați %alanglist",
    "-lang.has": "Limbă a fost schimbată cu %a",

    "-langlist.list": "Language list:",

    ".CommandSystem.no_permission": "Nu ai permisiunea să folosești această comandă",
    ".CommandSystem.unknown_command": "Comandă necunoscută. Scrie \"help\" Pentru ajutor.",
    ".CommandSystem.command_disabled": "Această comandă este oprită",
    ".CommandSystem.command_disabled_reason": "Nu ești administrator să folosești această comandă",
    ".CommandSystem.no_permisson": "Nu ai destule permisiuni să folosești această comandă",
    ".CommandSystem.no_player": "Specificați un jucător",
    ".CommandSystem.unknown_player": "Jucător necunoscut",
    ".CommandSystem.unknown": "Comandă necunoscută, încearcă %ahelp",
    ".CommandSystem.about": "Scrie -about să vezi mai multe informații",

    ".Util.kicked": "Ai fost dat afară",
    ".Util.reason": "Motiv",
    ".Util.noreason": "Niciun motiv scris",
    ".Util.unknown": "Neștiut",
    ".Util.has_failed": "Nu a reușit",
    ".Util.formkick": "%a a fost dat afară automat",
    ".Util.formban": "Lui %a ii s-a interzis accesul automat",

    ".banHandler.banned": "Ți-a fost interzis accesul!",
    ".banHandler.format": "§c§lȚi-a fost interzis accesul!\n§r§7Timp rămas:§c %a\n§7Motiv: §c%b§r\n§7De: §c%c",

    ".AdminChat.adminchat": "Canalul administratorilor",

    ".ChatHandler.muted": "Ți-a fost interzis accesul de a vorbi!",

    ".dimensionLock.stop": "Nu ai permisiunea de a merge în alte dimensiuni!",

    ".Spam.slowdown": "Trimite mesaje mai incet!",
    ".Spam.repeated": "Nu poți trimite aceleași mesaje din nou!",
    ".Spam.kicked": "§c%a§g Ai fost dat afară deoarece ai trimis mesaje prea repede!",
    ".Spam.filter": "Mesajul tău conține un cuvănt filtrat!",
    ".Spam.long": "Mesajul tău este prea lung!",
    ".Spam.blacklist": "Mesaj interzis, atenție!",
    ".Spam.kickedBlacklist": "§c%a§g A fost dat afară deoarece a spun un cuvânt interzis",

    ">distance": "Distanță",
    ">yReach": "yReach",
    ">HitLength": "Mărimea lovirii",
    ">Angle": "Unghi",
    ">Click Per Second": "Clickuri pe secundă",
    ">RotSpeed": "RotViteză",
    ">RotSpeedX": "RotVitezăX",
    ">RotSpeedY": "RotVitezăY",
    ">Type": "Tip",
    ">Pos": "Pos",
    ">PosDeff": "PosDeff",
    ">AttackTime": "TimpDeAtac",
    ">UsingItem": "ObiectFolosit",
    ">Moving": "Mișcănduse",
    ">Container": "Container",
    ">velocityY": "velocitateY",
    ">velocityXZ": "velocitateXZ",
    ">playerSpeed": "vitezăJucător",
    ">Mph": "Mph",
    ">Reach": "Reach",
    ">Mode": "Mode",
    ">Break": "Break",
    ">Place": "Place",
    ">GameMode": "GameMode",
    ">illegalLength": "lungimeilegală",
    ">illegalRegax": "RegaxIlegal",
    ">Length": "Lungime",
    ">Block": "Block",
    ">RotationX": "RotațieX",
    ">RotationY": "RotațieY",
    ">relative": "relativ",
    ">Delay": "Delay",
    ">typeId": "typeId",
    ">nameLength": "lungimeNume",
    ">CentreDis": "CentruDis",
    ">ItemType": "tipObiect",
    ">ItemNameLength": "LungimeNumeObiect",
    ">ItemLore": "ItemLore",
    ">EnchantLevel": "EnchantLevel",
    ">EnchantConflict": "EnchantConflict",
    ">ItemEnchantAble": "ItemEnchantAble",
    ">ItemEnchantRepeat": "ItemEnchantRepeat",
    ">ItemAmount": "SumăObiecte",
    ">ItemTag": "NumeObiect",
    ">Amount": "Total",
    ">Ratio": "Ratio",
    ">Limit": "Limită",
    ">BlockPerSecond": "BPS",
    // Version 3.0.0 or upper version
    ".Util.unfair": "Unfair advantage of %a",
    ".Util.by": "(Immediate behavioral defense)",
    ".Util.operator": "By",
    ".Bot.by": "(Bot defensive action)",
    ".Spam.by": "(Anti spam automatic action)",
    ".Spam.spamming": "Spamming chat",
    ".Spam.blacklisted": "Blacklisted message",
    ".Bot.waitUI": "For security reason, you cannot chat untill you finished verify process. Please wait until the verify ui be shown",
    ".Bot.expired": "Expired verification",
    ".Bot.ui": "§a[This server is protected by Matrix AntiCheat]\n§gYou need to verify if you're not a bot §7(%a/%b)§g\nYou have §e%c§gseconds left\nEnter the code §e§l%d§r§g below",
    ".Bot.title": "Anti Bot Verification",
    ".Bot.failed": "Verification failed",
    ".Bot.ok": "You have been verified successfully",
    ".Border.reached": "You cannot access that location, you have reached the world border.",
    ".Border.outside": "You cannot access a location which is outside the world border.",
    ".Border.interact": "You cannot interact with a block or entity which is outside the world border.",
    "-borderSize.enter": "Please enter a border size.",
    "-borderSize.notANum": "Not a number!",
    "-borderSize.between": "Border size should between 100 to 1M!",
    "-borderSize.ok": "Sucessfully changed world border size to %a",
    "-help.borderSize": "borderSize <size/default> - Change the world border size",
    ".UI.exit": "Exit",
    ".UI.i": "Admin GUI",
    ".UI.i.a": "Moderate Players",
    ".UI.i.b": "Settings",
}