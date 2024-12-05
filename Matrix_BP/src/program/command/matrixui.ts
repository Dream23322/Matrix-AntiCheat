import { Command, DirectPanel } from "../../matrixAPI";
import { rawtextTranslate } from "../../util/rawtext";

new Command()
	.setName("matrixui")
	.setAliases("ui", "openui", "uipanel", "panel", "openpanel")
	.setMinPermissionLevel(1)
	.setDescription(rawtextTranslate("command.matrixui.description"))
	.onExecute(async (player) => {
		player.sendMessage(rawtextTranslate("ui.closechat"));
		DirectPanel.open(player);
	})