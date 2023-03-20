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
import { BOL } from "./system/config.js"
import { registerHandlebarsHelpers } from "./system/helpers.js"
import registerHooks from "./system/hooks.js"
import { Macros } from "./system/macros.js"
import { preloadHandlebarsTemplates } from "./system/templates.js"

/* -------------------------------------------- */
Hooks.once('init', async function () {

  game.bol = {
    BoLActor,
    BoLItem,
    BoLHotbar,
    macros: Macros,
    config: BOL
  };

  // Game socket 
  game.socket.on("system.bol", sockmsg => {
    BoLUtility.onSocketMessage(sockmsg);
  })


  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "2d6+@attributes.mind.value+@aptitudes.init.value",
    decimals: 2
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = BoLActor;
  CONFIG.Item.documentClass = BoLItem;
  CONFIG.Combat.documentClass = BoLCombatManager;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("bol", BoLActorSheet, { types: ["character", "encounter"], makeDefault: true })
  Actors.registerSheet("bol", BoLVehicleSheet, { types: ["vehicle"], makeDefault: true })

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("bol", BoLItemSheet, { makeDefault: true });

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
// Register world usage statistics
function registerUsageCount(registerKey) {
  if (game.user.isGM) {
    game.settings.register(registerKey, "world-key", {
      name: "Unique world key",
      scope: "world",
      config: false,
      default: "",
      type: String
    });

    let worldKey = game.settings.get(registerKey, "world-key")
    if (worldKey == undefined || worldKey == "") {
      worldKey = randomID(32)
      game.settings.set(registerKey, "world-key", worldKey)
    }
  }
}

/* -------------------------------------------- */
function welcomeMessage() {
  ChatMessage.create({
    user: game.user.id,
    whisper: [game.user.id],
    content: `<div id="welcome-message-pegasus"><span class="rdd-roll-part">
    <strong>` + game.i18n.localize("BOL.chat.welcome1") + `</strong><p>` +
      game.i18n.localize("BOL.chat.welcome2") + "<p>" +
      game.i18n.localize("BOL.chat.welcome3") + "<p>" +
      game.i18n.localize("BOL.chat.welcome4") + "</p>" +
      game.i18n.localize("BOL.chat.welcome5") + "<br>" +
      game.i18n.localize("BOL.chat.welcome6")
  })
}

/* -------------------------------------------- */
Hooks.once('ready', async function () {

  BoLUtility.ready()
  BoLCharacterSummary.ready()

  registerUsageCount('bol')


  welcomeMessage()
})


