/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import { BoLRoll } from "../controllers/bol-rolls.js";
import { BoLUtility } from "../system/bol-utility.js";

export class BoLVehicleSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["bol", "sheet", "actor"],
      template: "systems/bol/templates/actor/vehicle-sheet.hbs",
      width: 860,
      height: 600,
      dragDrop: [{ dragSelector: ".items-list .item", dropSelector: null }],
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    function onLoad() {
      let logoSheet = BoLUtility.getLogoActorSheet()
      $(".bol-actor-form").css("backgroundImage",`url(${logoSheet})`)
    }
    // Setup everything onload
    $(function () { onLoad(); });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    })
    // Equip/Unequip item
    html.find('.item-equip').click(this._onToggleEquip.bind(this));

    html.find('.create_item').click(ev => {
      this.actor.createEmbeddedDocuments('Item', [{ name: "Nouvel Equipement", type: "item" }], { renderSheet: true });
    });

    html.find(".toggle-fight-option").click((ev) => {
      const li = $(ev.currentTarget).parents(".item")
      this.actor.toggleFightOption(li.data("itemId"))
    })

    html.find(".inc-dec-btns-alchemy").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.spendAlchemyPoint(li.data("itemId"), 1)
    })

    // Incr./Decr. career ranks
    html.find(".inc-dec-btns").click((ev) => {
      const li = $(ev.currentTarget).parents(".item");
      if (li) {
        const item = this.actor.items.get(li.data("itemId"));
        if (item) {
          const dataset = ev.currentTarget.dataset;
          const operator = dataset.operator;
          const target = dataset.target;
          const incr = parseInt(dataset.incr)
          const min = parseInt(dataset.min)
          const max = parseInt(dataset.max) || 10000
          let value = eval("item." + target)
          value = value || 0
          //console.log("IncDec", item, target, value, operator, min, max)
          if (operator === "minus") {
            if (value >= min + incr) value -= incr;
            else value = min;
          }
          if (operator === "plus") {
            if (value <= max - incr) value += incr;
            else value = max;
          }
          let update = { [`${target}`]: value };
          item.update(update);
        }
      }
    });


    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      Dialog.confirm({
        title: "Suppression",
        content: `Vous êtes sûr de vouloir supprimer cet item ?`,
        yes: () => {
          const li = $(ev.currentTarget).parents(".item");
          this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")])
          li.slideUp(200, () => this.render(false));
        },
        no: () => { },
        defaultYes: false,
      });
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

  }

  /* -------------------------------------------- */

  /** @override */
  async getData(options) {
    const data = super.getData(options)
    const actorData = duplicate(data)
    let formData = duplicate(data)

    formData.config = game.bol.config
    formData.name = this.actor.name
    formData.img = this.actor.img
    formData.system = duplicate(this.actor.system)
    formData.weapons = this.actor.vehicleWeapons
    formData.isGM = game.user.isGM
    formData.options = this.options
    formData.owner = this.document.isOwner
    formData.editScore = this.options.editScore
    formData.description = await TextEditor.enrichHTML(this.actor.system.description, {async: true})

    formData.isGM = game.user.isGM

    console.log("VEHICLEDATA", formData)
    return formData;
  }
  /* -------------------------------------------- */

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  _onToggleEquip(event) {
    event.preventDefault();
    const li = $(event.currentTarget).closest(".item");
    const item = this.actor.items.get(li.data("itemId"));
    return this.actor.toggleEquipItem(item);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget
    const dataset = element.dataset
    const rollType = dataset.rollType
    const li = $(event.currentTarget).closest(".item")
    switch (rollType) {
      case "attribute":
        BoLRoll.attributeCheck(this.actor, dataset.key, event)
        break;
      case "aptitude":
        BoLRoll.aptitudeCheck(this.actor, dataset.key, event)
        break;
      case "weapon":
        BoLRoll.weaponCheck(this.actor, event)
        break;
      case "spell":
        BoLRoll.spellCheck(this.actor, event)
        break;
      case "alchemy":
        BoLRoll.alchemyCheck(this.actor, event)
        break;
      case "protection":
        this.actor.rollProtection(li.data("item-id"))
        break;
      case "damage":
        this.actor.rollWeaponDamage(li.data("item-id"))
        break;
      case "aptitudexp":
        this.actor.incAptitudeXP(dataset.key)
        break;
      case "attributexp":
        this.actor.incAttributeXP(dataset.key)
        break;
      case "careerxp":
        this.actor.incCareerXP( li.data("item-id"))
        break;

      default: break;
    }
  }

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }
}
