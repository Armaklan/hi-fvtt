/* -------------------------------------------- */
// Import Modules
import { BoLActorSheet } from "./actor/actor-sheet.js"
import { BoLActor } from "./actor/actor.js"
import { BoLVehicleSheet } from "./actor/vehicle-sheet.js"
import { BoLItemSheet } from "./item/item-sheet.js"
import { BoLItem } from "./item/item.js"
import { BoLTokenHud } from "./system/bol-action-hud.js"
import { BoLAdventureGenerator } from "./system/bol-adventure-generator.js"
import { BoLCharacterSummary } from "./system/bol-character-summary.js"
import { BoLCombatManager } from "./system/bol-combat.js"
import { BoLCommands } from "./system/bol-commands.js"
import { BoLHotbar } from "./system/bol-hotbar.js"
import { BoLUtility } from "./system/bol-utility.js"
import { HI } from "./system/config.js"
import { registerHandlebarsHelpers } from "./system/helpers.js"
import registerHooks from "./system/hooks.js"
import { Macros } from "./system/macros.js"
import { preloadHandlebarsTemplates } from "./system/templates.js"

/* -------------------------------------------- */
Hooks.once('init', async function () {

  game.hi = {
    BoLActor,
    BoLItem,
    BoLHotbar,
    macros: Macros,
    config: HI
  };

  // Game socket 
  game.socket.on("system.hi-fvtt", sockmsg => {
    BoLUtility.onSocketMessage(sockmsg);
  })


  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "2d6+@attributes.savvy.value",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = BoLActor;
  CONFIG.Item.documentClass = BoLItem;
  CONFIG.Combat.documentClass = BoLCombatManager;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("hi-fvtt", BoLActorSheet, { types: ["character", "encounter"], makeDefault: true })
  Actors.registerSheet("hi-fvtt", BoLVehicleSheet, { types: ["vehicle"], makeDefault: true })

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("hi-fvtt", BoLItemSheet, { makeDefault: true });

  // Inot useful stuff
  BoLUtility.init()
  BoLTokenHud.init()
  BoLHotbar.init()
  BoLCommands.init()
  BoLAdventureGenerator.init()

  // Preload Handlebars Templates
  await preloadHandlebarsTemplates();

  // Register Handlebars helpers
  registerHandlebarsHelpers();

  // Register hooks
  registerHooks()

});



/* -------------------------------------------- */
Hooks.once('ready', async function () {

  BoLUtility.ready()
  BoLCharacterSummary.ready()
})


