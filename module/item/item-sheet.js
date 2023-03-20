import { BoLUtility } from "../system/bol-utility.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class BoLItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["bol", "sheet", "item"],
      template: "systems/bol/templates/item/item-sheet.hbs",
      width: 650,
      height: 780,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /* -------------------------------------------- */
  /** @override */
  async getData(options) {
    const data = super.getData(options)
    let itemData = duplicate(data.document)
    data.config = game.bol.config
    data.item = itemData
    data.category = itemData.system.category
    data.isGM = game.user.isGM;
    data.itemProperties = this.item.itemProperties;
    data.description = await TextEditor.enrichHTML(this.object.system.description, {async: true})

    // Dynamic default data fix/adapt
    if (itemData.type == "item") {
      if (!itemData.system.category) {
        itemData.system.category = "equipment"
      }
      if ( itemData.system.category == "equipment" && itemData.system.properties.equipable) {
        if (!itemData.system.properties.slot) {
          itemData.system.properties.slot = "-"
        }
      }
      if (itemData.system.category == 'spell') {
        if(!itemData.system.properties.mandatoryconditions) {
          itemData.system.properties.mandatoryconditions = []
        }
        if(!itemData.system.properties.optionnalconditions) {
          itemData.system.properties.optionnalconditions = []
        }
        for (let i = 0; i < 4; i++) {
          itemData.system.properties.mandatoryconditions[i] = itemData.system.properties.mandatoryconditions[i] ?? ""
        }
        for (let i = 0; i < 8; i++) {
          itemData.system.properties.optionnalconditions[i] = itemData.system.properties.optionnalconditions[i] ?? ""
        }
      }
    } else {
      if (!itemData.system.subtype) {
        itemData.system.category = "origin"
      }
    }

    console.log("ITEMDATA", data);
    return data;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {

    super.activateListeners(html);
    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;
    // Roll handlers, click handlers, etc. would go here.

    html.find('.armorQuality').change(ev => {
      const li = $(ev.currentTarget);
      console.log(game.bol.config.soakFormulas[li.val()]);
      $('.soakFormula').val(game.bol.config.soakFormulas[li.val()]);
    });

  }

}
