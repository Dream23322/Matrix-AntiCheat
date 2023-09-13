import { world } from '@minecraft/server';
import config from '../../../data/config.js';
import { flag, uniqueId, punish } from '../../../unti/World.js';

const placement_d = () => {
  const EVENT = world.beforeEvents.playerPlaceBlock.subscribe(ev => {
    const player = ev.player;
    if(uniqueId(player)) return;
    const block = ev.block;
    if(block.typeId.endsWith('shulker_box')) {
      ev.cancel = true;
      flag(player, 'Placement/D', 0);
      punish(player, 'Placement/D', config.modules.placementD.punishment)
    }
  });
  if(!config.modules.placementD.state) {
    world.beforeEvents.playerPlaceBlock.unsubscribe(EVENT);
  };
};

export { placement_d }