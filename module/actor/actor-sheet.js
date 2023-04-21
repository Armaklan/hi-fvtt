/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import { BoLRoll } from "../controllers/bol-rolls.js";
import { BoLUtility } from "../system/bol-utility.js";

export class BoLActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["bol", "sheet", "actor"],
      template: "systems/hi-fvtt/templates/actor/actor-sheet.hbs",
      width: 860,
      height: 870,
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
      $(".bol-actor-form").css("backgroundImage", `url(${logoSheet})`)
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
    html.find(".inc-dec-btns-resource").click((ev) => {
      const dataset = ev.currentTarget.dataset;
      const target = dataset.target
      const incr = parseInt(dataset.incr)
      this.actor.incDecResources(target, incr)
    })
    html.find(".advantage-btn").click((ev) => {
      const dataset = ev.currentTarget.dataset
      const targetValue = parseInt(dataset.val)
      this.actor.updateAdvantage(targetValue)
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
        title: game.i18n.localize("HI.ui.deletetitle"),
        content: game.i18n.localize("HI.ui.confirmdelete"),
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

    formData.config = game.hi.config
    formData.data = actorData
    formData.details = this.actor.details
    formData.attributes = this.actor.attributes
    formData.aptitudes = this.actor.aptitudes
    formData.resources = this.actor.getResourcesFromType()
    formData.xp = this.actor.system.xp
    formData.equipment = this.actor.equipment
    formData.equipmentCreature = this.actor.equipmentCreature
    formData.weapons = this.actor.weapons
    formData.protections = this.actor.protections
    formData.spells = this.actor.spells
    formData.alchemy = this.actor.alchemy
    formData.containers = this.actor.containers
    formData.treasure = this.actor.treasure
    formData.boleffects = this.actor.boleffects
    formData.alchemyrecipe = this.actor.alchemyrecipe
    formData.horoscopes = this.actor.horoscopes
    formData.vehicles = this.actor.vehicles
    formData.fightoptions = this.actor.fightoptions
    formData.ammos = this.actor.ammos
    formData.misc = this.actor.misc
    formData.combat = this.actor.buildCombat()
    formData.initiativeRank = this.actor.getInitiativeRank()
    //formData.combatCreature = this.actor.buildCombatCreature()
    formData.features = this.actor.buildFeatures()
    formData.isGM = game.user.isGM
    formData.options = this.options
    formData.owner = this.document.isOwner
    formData.editScore = this.options.editScore
    formData.useBougette = (this.actor.type == "character" && BoLUtility.getUseBougette()) || false
    formData.bougette = this.actor.getBougette()
    formData.charType = this.actor.getCharType()
    formData.villainy = this.actor.getVillainy()
    formData.biography = await TextEditor.enrichHTML(this.object.system.details?.biography || "", { async: true })
    formData.notes = await TextEditor.enrichHTML(this.object.system.details.notes || "", { async: true })
    formData.isSorcerer = this.actor.isSorcerer()
    formData.isAlchemist = this.actor.isAlchemist()
    formData.isAstrologer = this.actor.isAstrologer()
    formData.isMysteries = formData.isSorcerer || formData.isAlchemist || formData.isAstrologer
    formData.isPriest = this.actor.isPriest()
    formData.horoscopeGroupList = game.settings.get("bol", "horoscope-group")

    formData.isGM = game.user.isGM

    console.log("ACTORDATA", formData)
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
      case "bougette":
        this.actor.rollBougette()
        break;
      case "careerxp":
        this.actor.incCareerXP(li.data("item-id"))
        break;
      case "horoscope-minor":
        BoLRoll.horoscopeCheck(this.actor, event, "minor")
        break
      case "horoscope-major":
        BoLRoll.horoscopeCheck(this.actor, event, "major")
        break
      case "horoscope-major-group":
        BoLRoll.horoscopeCheck(this.actor, event, "majorgroup")
        break

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
