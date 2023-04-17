/* -------------------------------------------- */
import { BoLRoll } from "../controllers/bol-rolls.js";
import { BoLUtility } from "./bol-utility.js";

/* -------------------------------------------- */
export class BoLCharacterSummary extends Application {

  /* -------------------------------------------- */
  static displayPCSummary() {
    game.bol.charSummary.render(true)
  }
  /* -------------------------------------------- */
  updatePCSummary() {
    if (this.rendered) {
      this.render(true)
    }
  }

  /* -------------------------------------------- */
  static createSummaryPos() {
    return { top: 200, left: 200 };
  }

  /* -------------------------------------------- */
  static ready() {
    if (!game.user.isGM) { // Uniquement si GM
      return
    }
    let charSummary = new BoLCharacterSummary()
    game.bol.charSummary = charSummary
  }

  /* -------------------------------------------- */
  constructor() {
    super();
    //game.settings.set("world", "character-summary-data", {npcList: [], x:0, y:0})
    this.settings = game.settings.get("world", "character-summary-data")
  }

  /* -------------------------------------------- */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      template: "systems/hi-fvtt/templates/apps/character-summary-template.html",
      popOut: true,
      resizable: true,
      dragDrop: [{ dragSelector: ".items-list .item", dropSelector: null }],
      classes: ["bol", "dialog"], width: 820, height: 'fit-content'
    })
  }

  /* -------------------------------------------- */
  getData() {
    let formData = super.getData();

    formData.pcs = game.actors.filter(ac => ac.type == "character" && ac.hasPlayerOwner)
    formData.npcs = []
    let newList = []
    let toUpdate = false
    for (let actorId of this.settings.npcList) {
      let actor = game.actors.get(actorId)
      if (actor) {
        formData.npcs.push(actor)
        newList.push(actorId)
      } else {
        toUpdate = true
      }
    }
    formData.config = game.bol.config
    formData.horoscopeGroupList = game.settings.get("bol", "horoscope-group")

    if (toUpdate) {
      this.settings.npcList = newList
      //console.log("Going to update ...", this.settings)
      game.settings.set("world", "character-summary-data", this.settings)
    }

    return formData
  }

  /* -------------------------------------------- */
  updateNPC() {
    game.settings.set("world", "character-summary-data", game.bol.charSummary.settings)
    game.bol.charSummary.close()
    setTimeout(function () { game.bol.charSummary.render(true) }, 500)
  }

  /* -------------------------------------------- */
  async _onDrop(event) {
    //console.log("Dragged data are : ", dragData)
    let data = event.dataTransfer.getData('text/plain')
    let dataItem = JSON.parse(data)
    let actor = fromUuidSync(dataItem.uuid)
    if (actor) {
      game.bol.charSummary.settings.npcList.push(actor.id)
      game.bol.charSummary.updateNPC()

    } else {
      ui.notifications.warn(game.i18n.localize("HI.ui.noactorfound"))
    }
  }

  /* -------------------------------------------- */
  /** @override */
  async activateListeners(html) {
    super.activateListeners(html);

    html.find('.actor-open').click((event) => {
      const li = $(event.currentTarget).parents(".item")
      const actor = game.actors.get(li.data("actor-id"))
      actor.sheet.render(true)
    })

    html.find('.summary-roll').click((event) => {
      const li = $(event.currentTarget).parents(".item")
      const actor = game.actors.get(li.data("actor-id"))
      let type = $(event.currentTarget).data("type")
      let key = $(event.currentTarget).data("key")
      if (type == "attribute") {
        BoLRoll.attributeCheck(actor, key, event)
      } else if (type == "aptitude") {
        BoLRoll.aptitudeCheck(actor, key, event)
      }
    })

    html.find('.actor-delete').click(event => {
      const li = $(event.currentTarget).parents(".item");
      let actorId = li.data("actor-id")
      let newList = game.bol.charSummary.settings.npcList.filter(id => id != actorId)
      game.bol.charSummary.settings.npcList = newList
      game.bol.charSummary.updateNPC()
    })

    html.find('#horoscope-group-edit-available').change(event => {
      const horoId = $(event.currentTarget).data("horo-id")
      let newValue = event.currentTarget.value
      let horoscopes = duplicate(game.settings.get("bol", "horoscope-group"))
      if (horoId && horoscopes[horoId]) {
        horoscopes[horoId].availableDice = Number(newValue)
        if (newValue <= 0) {
          horoscopes[horoId] = undefined
        }
        game.settings.set("bol", "horoscope-group", horoscopes)
        setTimeout(function () { BoLUtility.updateSheets() }, 800)
      }
    })

    html.find('#horoscope-group-edit-max').change(event => {
      const horoId = $(event.currentTarget).data("horo-id")
      let newValue = event.currentTarget.value
      let horoscopes = duplicate(game.settings.get("bol", "horoscope-group"))
      if (horoId && horoscopes[horoId]) {
        horoscopes[horoId].maxDice = Number(newValue)
        if (newValue <= 0) {
          horoscopes[horoId] = undefined
        }
        game.settings.set("bol", "horoscope-group", horoscopes)
        setTimeout(function () { BoLUtility.updateSheets() }, 800)
      }
    })
  }

}