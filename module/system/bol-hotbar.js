import { BoLRoll } from "../controllers/bol-rolls.js";

export class BoLHotbar {


  static async assignToHotBar( item, slot) {
    let command = `game.bol.BoLHotbar.rollMacro("${item.name}", "${item.type}");`
    let macro = game.macros.contents.find(m => (m.name === item.name) && (m.command === command))
    if (!macro) {
      macro = await Macro.create({
        name: item.name,
        type: "script",
        img: item.img,
        command: command
      }, { displaySheet: false })
    }
    await game.user.assignHotbarMacro(macro, slot);
  }

  /**
   * Create a macro when dropping an entity on the hotbar
   * Item      - open roll dialog for item
   * Actor     - open actor sheet
   * Journal   - open journal sheet
   */
  static init( ) {

    Hooks.on("hotbarDrop", (bar, documentData, slot) => {
    // Create item macro if rollable item - weapon, spell, prayer, trait, or skill
    if (documentData.type == "Item") {
      let item = fromUuidSync(documentData.uuid)
      if (item == undefined) {
        item = this.actor.items.get(documentData.uuid)
      }
      if (item && (item.system.subtype === "weapon" || item.system.category === "spell")) {
        this.assignToHotBar( item, slot )
        return false
      }
    }
    return true
  })
  }

  /** Roll macro */
  static rollMacro(itemName, itemType, bypassData) {
    const speaker = ChatMessage.getSpeaker()
    let actor
    if (speaker.token) actor = game.actors.tokens[speaker.token]
    if (!actor) actor = game.actors.get(speaker.actor)
    if (!actor) {
      return ui.notifications.warn( game.i18n.localize("BOL.ui.selectactor") )
    }

    let item = actor.items.find(it => it.name === itemName && it.type == itemType)
    if (!item ) {
      return ui.notifications.warn( game.i18n.localize("BOL.ui.itemnotfound") )
    }
    // Trigger the item roll
    if  (item.system.category === "equipment" && item.system.subtype === "weapon") {
      return BoLRoll.weaponCheckWithWeapon( actor, item)
    }
    if  (item.system.category === "spell") {
      return BoLRoll.spellCheckWithSpell( actor, item)
    }
  }

}
