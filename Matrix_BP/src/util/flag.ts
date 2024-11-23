import { Player, world } from "@minecraft/server";
import { Module } from "../matrixAPI";
import { rawtextTranslate } from "./rawtext";
import { freeze, mute, softBan, strengthenKick, tempKick } from "../program/system/moderation";
export function setupFlagFunction () {
	Player.prototype.flag = function (detected: Module) {
		const punishment = detected.modulePunishment;
		if (!punishment || this.isAdmin()) return;
		world.sendMessage(rawtextTranslate("util.flag.alert", this.name, detected.getToggleId()!, punishment));
		switch (punishment) {
			case "kick":
				strengthenKick(this);
				break;
			case "tempKick":
				tempKick(this);
				break;
			case "freeze":
				freeze(this, -1);
				break;
			case "mute":
				mute(this, -1);
				break;
			case "softBan":
				softBan(this, -1);
				break;
			case "ban":
				softBan(this, Module.config.flag.banDuration);
				break;
		}
	}
}