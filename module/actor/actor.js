import { BoLDefaultRoll, BoLRoll } from "../controllers/bol-rolls.js";
import { BoLUtility } from "../system/bol-utility.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class BoLActor extends Actor {

  /** @override */
  prepareData() {

    if (this.type === 'character') {
      this.chartype = 'player'
      this.villainy = false
    }
    if (this.type === 'encounter') {
      this.chartype = 'tough'
      this.villainy = true
    }
    super.prepareData()
  }

  /* -------------------------------------------- */
  getCharType() {
    if (this.type === 'character') {
      return "player"
    }
    return this.system.chartype
  }

  /* -------------------------------------------- */
  getVillainy() {
    if (this.type === 'character') {
      return false
    }
    return true
  }

  /* -------------------------------------------- */
  getBougette() {
    if (this.type == "character") {
      let b = duplicate(this.system.bougette)
      b.label = game.i18n.localize(game.bol.config.bougetteState[String(this.system.bougette.value)])
      b.diceImg = "icons/dice/" + game.bol.config.bougetteDice[String(this.system.bougette.value)] + "black.svg"
      return b
    }
    return undefined
  }

  /* -------------------------------------------- */
  async rollBougette() {
    if (this.type == "character") {
      let attribute = duplicate(this.system.attributes.might)
      let rollData = BoLRoll.getCommonRollData(this, "bougette", attribute, undefined)
      rollData.formula = game.bol.config.bougetteDice[String(this.system.bougette.value)]
      let r = new BoLDefaultRoll(rollData)
      r.roll()
    }
  }

  /* -------------------------------------------- */
  decBougette() {
    if (this.type == "character") {
      let bougette = duplicate(this.system.bougette)
      bougette.value = Math.max(Number(bougette.value) - 1, 0)
      this.update({ 'system.bougette': bougette })
    }
  }

  /* -------------------------------------------- */
  updateResourcesData() {
    if (this.type == 'character') {
      let newVitality = 10 + this.system.attributes.might.value + this.system.resources.hp.bonus
      if (this.system.resources.hp.max != newVitality) {
        this.update({ 'system.resources.hp.max': newVitality })
      }
      let newPower = 10 + this.system.attributes.savvy.value + this.system.resources.power.bonus
      if (this.system.resources.power.max != newPower) {
        this.update({ 'system.resources.power.max': newPower })
      }

      let newComposure = 3 + this.system.resources.composure.bonus
      if (this.system.resources.composure.max != newComposure) {
        this.update({ 'system.resources.composure.max': newComposure })
      }

      let newHero = 3 + this.system.attributes.flair.value + this.system.resources.hero.bonus
      if (this.system.resources.hero.max != newHero) {
        this.update({ 'system.resources.hero.max': newHero })
      }
    }
  }

  /* -------------------------------------------- */
  prepareDerivedData() {
    if (this.type == "vehicle") {

    } else {
      super.prepareDerivedData()
      this.updateResourcesData()
      this.manageHealthState();
    }
  }

  /* -------------------------------------------- */
  get details() {
    return this.system.details
  }
  get attributes() {
    return Object.values(this.system.attributes)
  }
  get aptitudes() {
    return Object.values(this.system.aptitudes)
  }

  /* -------------------------------------------- */
  clearRoundModifiers() { // Process data/items that are finished at end of a round
    let foList = this.fightoptions
    for (let fo of foList) {
      if (fo.system.properties.used) {
        this.updateEmbeddedDocuments("Item", [{ _id: fo._id, 'system.properties.used': false }])
      }
    }
  }

  /* -------------------------------------------- */
  get defenseValue() {
    let defMod = 0
    let fo = this.getActiveFightOption()
    if (fo && fo.system.properties.fightoptiontype == "intrepid") {
      defMod += -2
    }
    if (fo && fo.system.properties.fightoptiontype == "fulldefense") {
      defMod += 2
    }
    if (fo && fo.system.properties.fightoptiontype == "twoweaponsdef" && !fo.system.properties.used) {
      defMod += 1
      this.updateEmbeddedDocuments("Item", [{ _id: fo._id, 'system.properties.used': true }])
    }
    if (fo && fo.system.properties.fightoptiontype == "defense") {
      defMod += 1
    }
    if (fo && fo.system.properties.fightoptiontype == "attack") {
      defMod += -1
    }
    // Apply defense effects
    for (let i of this.items) {
      if (i.type === "feature" && i.system.subtype === "boleffect" && i.system.properties.identifier.includes("aptitudes.def")) {
        defMod += Number(i.system.properties.modifier)
      }
    }
    console.log("Defense : ", defMod)
    return this.system.aptitudes.def.value + defMod
  }

  /* -------------------------------------------- */
  getActiveFightOption() {
    let it = this.items.find(i => i.type === "feature" && i.system.subtype === "fightoption" && i.system.properties.activated)
    if (it) {
      return duplicate(it)
    }
    return undefined
  }

  /* -------------------------------------------- */
  incAttributeXP(key) {
    let attr = duplicate(this.system.attributes[key])
    if (attr) {
      let nextXP = attr.value * 5 + 15

      if (attr.value === 4) {
        nextXP = 45
      } else if (attr.value === 5) {
        nextXP = 55
      }

      let xp = duplicate(this.system.xp)
      if (xp.total - xp.spent >= nextXP) {
        attr.value += 1
        xp.spent += nextXP
        this.update({ [`system.attributes.${key}`]: attr, [`system.xp`]: xp })
      } else {
        ui.notifications.warn("Pas assez de points d'expérience !")
      }
    }
  }

  /* -------------------------------------------- */
  incAptitudeXP(key) {
    let apt = duplicate(this.system.aptitudes[key])
    if (apt) {
      let nextXP = attr.value * 5 + 10
      let xp = duplicate(this.system.xp)
      if (xp.total - xp.spent >= nextXP) {
        apt.value += 1
        xp.spent += nextXP
        this.update({ [`system.aptitudes.${key}`]: apt, [`system.xp`]: xp })
      } else {
        ui.notifications.warn("Pas assez de points d'expérience !")
      }
    }
  }
  /* -------------------------------------------- */
  incCareerXP(itemId) {
    let career = this.items.get(itemId)
    if (career) {
      career = duplicate(career)
      let nextXP = (career.system.rank + 1) * 5
      let xp = duplicate(this.system.xp)
      if (xp.total - xp.spent >= nextXP) {
        xp.spent += nextXP
        this.update({ [`system.xp`]: xp })
        this.updateEmbeddedDocuments('Item', [{ _id: career._id, 'system.rank': career.system.rank + 1 }])
      } else {
        ui.notifications.warn("Pas assez de points d'expérience !")
      }
    }
  }

  /* -------------------------------------------- */
  async toggleFightOption(itemId) {
    let fightOption = this.items.get(itemId)
    let state
    let updates = []

    if (fightOption) {
      fightOption = duplicate(fightOption)
      if (fightOption.system.properties.activated) {
        state = false
      } else {
        state = true
      }
      updates.push({ _id: fightOption._id, 'system.properties.activated': state }) // Update the selected one
      await this.updateEmbeddedDocuments("Item", updates) // Apply all changes
      // Then notify 
      ChatMessage.create({
        alias: this.name,
        whisper: BoLUtility.getWhisperRecipientsAndGMs(this.name),
        content: await renderTemplate('systems/hi-fvtt/templates/chat/chat-activate-fight-option.hbs', { name: this.name, img: fightOption.img, foName: fightOption.name, state: state })
      })

    }
  }

  /*-------------------------------------------- */
  get armorMalusValue() { // used for Fight Options
    for (let armor of this.armors) {
      if (armor.system.properties.armorQuality.includes("light")) {
        return 1
      }
      if (armor.system.properties.armorQuality.includes("medium")) {
        return 2
      }
      if (armor.system.properties.armorQuality.includes("heavy")) {
        return 3
      }
    }
    return 0
  }

  get resources() {
    return Object.values(this.system.resources)
  }
  get boleffects() {
    return this.items.filter(i => i.type === "feature" && i.system.subtype === "boleffect")
  }
  get horoscopes() {
    return this.items.filter(i => i.type === "feature" && i.system.subtype === "horoscope")
  }
  get boons() {
    return duplicate(this.items.filter(i => i.type === "feature" && i.system.subtype === "boon") || []);
  }
  get flaws() {
    return duplicate(this.items.filter(i => i.type === "feature" && i.system.subtype === "flaw") || []);
  }
  get careers() {
    return duplicate(this.items.filter(i => i.type === "feature" && i.system.subtype === "career") || [])
  }
  get origins() {
    return this.items.filter(i => i.type === "feature" && i.system.subtype === "origin");
  }
  get races() {
    return this.items.filter(i => i.type === "feature" && i.system.subtype === "race");
  }
  get languages() {
    return this.items.filter(i => i.type === "feature" && i.system.subtype === "language")
  }
  get fightoptions() {
    return this.items.filter(i => i.type === "feature" && i.system.subtype === "fightoption")
  }
  get godsfaith() {
    return this.items.filter(i => i.type === "feature" && i.system.subtype === "godsfaith")
  }
  get features() {
    return this.items.filter(i => i.type === "feature")
  }
  get equipment() {
    return this.items.filter(i => i.type === "item")
  }
  get equipmentCreature() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && ((i.system.subtype === "weapon" && i.system.properties.natural === true) || (i.system.subtype === "armor")))
  }
  get armors() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && i.system.subtype === "armor");
  }
  get helms() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && i.system.subtype === "helm");
  }
  get shields() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && i.system.subtype === "shield");
  }
  get vehicleWeapons() {
    return this.items.filter(i => i.type === "item" && i.system.category === "vehicleweapon")
  }
  get weapons() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && i.system.subtype === "weapon")
  }
  get protections() {
    return this.armors.concat(this.helms).concat(this.shields)
  }
  get spells() {
    return this.items.filter(i => i.type === "item" && i.system.category === "spell");
  }
  get alchemy() {
    return this.items.filter(i => i.type === "item" && i.system.category === "alchemy");
  }
  get melee() {
    return this.weapons.filter(i => i.system.properties.melee === true);
  }
  get natural() {
    return this.weapons.filter(i => i.system.properties.natural === true);
  }
  get ranged() {
    return this.weapons.filter(i => i.system.properties.ranged === true);
  }

  get containers() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && i.system.subtype === "container");
  }

  get treasure() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && i.system.subtype === "currency");
  }

  get vehicles() {
    return this.items.filter(i => i.type === "item" && i.system.category === "vehicle");
  }

  get ammos() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && i.system.subtype === "ammunition");
  }

  get misc() {
    return this.items.filter(i => i.type === "item" && i.system.category === "equipment" && (i.system.subtype === "other" || i.system.subtype === "container" || i.system.subtype === "scroll" || i.system.subtype === "jewel"));
  }

  get bonusBoons() {
    let boons = this.items.filter(i => i.type === "feature" && i.system.subtype === "boon" && i.system.properties.isbonusdice)
    return duplicate(boons || [])
  }
  get malusFlaws() {
    return duplicate(this.items.filter(i => i.type === "feature" && i.system.subtype === "flaw" && i.system.properties.ismalusdice) || []);
  }

  isSorcerer() {
    if (this.careers.find(item => item.system.properties.sorcerer == true))
      return true
    return false
  }
  isAlchemist() {
    if (this.careers.find(item => item.system.properties.alchemist == true))
      return true
    return false
  }
  isAstrologer() {
    if (this.careers.find(item => item.system.properties.astrologer == true))
      return true
    return false
  }
  isPriest() {
    if (this.careers.find(item => item.system.properties.priest == true))
      return true
    return false
  }

  /*-------------------------------------------- */
  getPPCostArmor() {
    let armors = this.armors
    let ppCostArmor = 0
    for (let armor of armors) {
      if (armor.system.worn) {
        ppCostArmor += Number(armor.system.properties.modifiers.powercost) || 0
      }
    }
    return ppCostArmor
  }
  /*-------------------------------------------- */
  getDamageAttributeValue(attrDamage) {
    let attrDamageValue = 0
    if (attrDamage.includes("might")) {
      attrDamageValue = this.system.attributes.might.value
      if (attrDamage.includes("half")) {
        attrDamageValue = Math.floor(attrDamageValue / 2)
      }
      // Apply might effects
      for (let i of this.items) {
        if (i.type === "feature" && i.system.subtype === "boleffect" && i.system.properties.identifier.includes("might")) {
          attrDamageValue += Number(i.system.properties.modifier)
        }
      }
    }
    return attrDamageValue
  }
  /*-------------------------------------------- */
  getArmorAgiMalus() {
    let malusAgi = 0
    for (let armor of this.protections) {
      if (armor.system.worn) {
        malusAgi += Number(armor.system.properties.modifiers.daring) || 0
      }
    }
    return malusAgi
  }
  /*-------------------------------------------- */
  getArmorInitMalus() {
    let malusInit = 0
    for (let armor of this.protections) {
      if (armor.system.worn) {
        malusInit += Number(armor.system.properties.modifiers.init) || 0
      }
    }
    return malusInit
  }

  /*-------------------------------------------- */
  spendPowerPoint(ppCost) {
    let newPP = this.system.resources.power.value - ppCost
    newPP = (newPP < 0) ? 0 : newPP
    this.update({ 'system.resources.power.value': newPP })
    return newPP
  }

  /*-------------------------------------------- */
  resetAlchemyStatus(alchemyId) {
    let alchemy = this.items.get(alchemyId)
    if (alchemy) {
      this.updateEmbeddedDocuments('Item', [{ _id: alchemy.id, 'system.properties.pccurrent': 0 }])
    }
  }

  /*-------------------------------------------- */
  spentAstrologyPoints(points) {
    let astrology = duplicate(this.system.resources.astrologypoints)
    astrology.value -= points
    astrology.value = Math.max(astrology.value, 0)
    this.update({ 'system.resources.astrologypoints': astrology })
  }

  /*-------------------------------------------- */
  getHoroscopesBonus() {
    let astro = this.items.filter(it => it.type == "feature" && it.system.subtype == "horoscope" && !it.system.properties.ishoroscopemajor
      && it.system.properties.horoscopeanswer == "favorable")
    return astro
  }
  /*-------------------------------------------- */
  getHoroscopesMalus() {
    let astro = this.items.filter(it => it.type == "feature" && it.system.subtype == "horoscope" && !it.system.properties.ishoroscopemajor
      && it.system.properties.horoscopeanswer == "unfavorable")
    return astro
  }

  /*-------------------------------------------- */
  manageHoroscope(rollData) {
    //Spent points
    this.spentAstrologyPoints(rollData.astrologyPointsCost)
    if (rollData.horoscopeType == "minor") {
      let horoscope = {
        name: "SITUATION A SPECIFIER", type: "feature",
        img: "icons/magic/perception/eye-ringed-glow-angry-large-red.webp",
        system: {
          subtype: "horoscope", properties: {
            ishoroscopemajor: false,
            horoscopeanswer: (rollData.isSuccess) ? "favorable" : "unfavorable",
            rank: rollData.careerBonus
          }
        }
      }
      this.createEmbeddedDocuments('Item', [horoscope])
    }
    if (rollData.horoscopeType == "major") {
      if (rollData.isSuccess) {
        this.subHeroPoints(1)
      } else {
        this.addHeroPoints(1)
      }
    }
    if (rollData.horoscopeType == "majorgroup") {
      let rID = randomID(16)
      let horoscopes = duplicate(game.settings.get("bol", "horoscope-group"))
      horoscopes[rID] = {
        id: rID,
        name: game.i18n.localize("HI.ui.groupHoroscope") + this.name,
        maxDice: rollData.careerBonus,
        availableDice: rollData.careerBonus,
        type: (rollData.isSuccess) ? "bonus" : "malus"
      }
      game.settings.set("bol", "horoscope-group", horoscopes)
    }

  }

  /*-------------------------------------------- */
  getAstrologyPoints() {
    return this.system.resources.astrologypoints.value
  }
  /*-------------------------------------------- */
  removeHoroscopeMinor(rollData) {
    let toDel = []
    for (let horo of rollData.selectedHoroscope) {
      toDel.push(horo._id)
    }
    if (toDel.length > 0) {
      this.deleteEmbeddedDocuments('Item', toDel)
    }
  }

  /*-------------------------------------------- */
  async spendAlchemyPoint(alchemyId, pcCost) {
    let alchemy = this.items.get(alchemyId)
    if (alchemy) {
      pcCost = Number(pcCost) ?? 0
      if (this.system.resources.alchemypoints.value >= pcCost) {
        let newPC = this.system.resources.alchemypoints.value - pcCost
        newPC = (newPC < 0) ? 0 : newPC
        this.update({ 'data.resources.alchemypoints.value': newPC })
        newPC = alchemy.system.properties.pccurrent + pcCost
        await this.updateEmbeddedDocuments('Item', [{ _id: alchemy.id, 'system.properties.pccurrent': newPC }])
      } else {
        ui.notifications.warn(game.i18n.localize("HI.ui.nomorealchemypoints"))
      }
    }
  }
  /*-------------------------------------------- */
  getAstrologerBonus() {
    let astrologer = this.careers.find(item => item.system.properties.astrologer == true)
    if (astrologer) {
      return astrologer.system.rank
    }
    return 0;
  }
  /*-------------------------------------------- */
  getAlchemistBonus() {
    let sorcerer = this.careers.find(item => item.system.properties.alchemist == true)
    if (sorcerer) {
      return sorcerer.system.rank
    }
    return 0;
  }
  /*-------------------------------------------- */
  getSorcererBonus() {
    let sorcerer = this.careers.find(item => item.system.properties.sorcerer == true)
    if (sorcerer) {
      return sorcerer.system.rank
    }
    return 0;
  }

  /*-------------------------------------------- */
  heroReroll() {
    if (this.type == 'character') {
      return this.system.resources.hero.value > 0;
    } else {
      if (this.system.villainy == 'adversary') {
        return this.system.resources.hero.value > 0;
      }
    }
    return false
  }

  /*-------------------------------------------- */
  getResourcesFromType() {
    let resources = {};
    if (this.type == 'encounter') {
      resources['hp'] = this.system.resources.hp
      resources['composure'] = this.system.resources.composure

      if (this.system.chartype != 'base') {
        resources['power'] = this.system.resources.power
      }
      if (this.system.chartype == 'adversary') {
        resources['hero'] = duplicate(this.system.resources.hero)
        resources['hero'].label = "HI.resources.villainy"
      }
    } else {
      resources = this.system.resources;
    }
    return resources
  }

  buildFeatures() {
    return {
      "careers": {
        "label": "HI.featureCategory.careers",
        "ranked": true,
        "items": this.careers
      },
      "origins": {
        "label": "HI.featureCategory.origins",
        "ranked": false,
        "items": this.origins
      },
      "races": {
        "label": "HI.featureCategory.races",
        "ranked": false,
        "items": this.races
      },
      "boons": {
        "label": "HI.featureCategory.boons",
        "ranked": false,
        "items": this.boons
      },
      "flaws": {
        "label": "HI.featureCategory.flaws",
        "ranked": false,
        "items": this.flaws
      },
      "languages": {
        "label": "HI.featureCategory.languages",
        "ranked": false,
        "items": this.languages
      },
      "fightoptions": {
        "label": "HI.featureCategory.fightoptions",
        "ranked": false,
        "items": this.fightoptions
      },
      "godsfaith": {
        "label": "HI.featureSubtypes.gods",
        "ranked": false,
        "items": this.godsfaith
      },
      "boleffects": {
        "label": "HI.featureSubtypes.effects",
        "ranked": false,
        "items": this.boleffects
      }
    }
  }

  buildCombat() {
    return {
      "melee": {
        "label": "HI.combatCategory.melee",
        "weapon": true,
        "protection": false,
        "blocking": false,
        "ranged": false,
        "options": false,
        "items": this.melee
      },
      "natural": {
        "label": "HI.combatCategory.natural",
        "weapon": true,
        "protection": false,
        "blocking": false,
        "ranged": false,
        "options": false,
        "items": this.natural
      },
      "ranged": {
        "label": "HI.combatCategory.ranged",
        "weapon": true,
        "protection": false,
        "blocking": false,
        "ranged": true,
        "options": false,
        "items": this.ranged
      },
      "protections": {
        "label": "HI.combatCategory.protections",
        "weapon": false,
        "protection": true,
        "blocking": false,
        "ranged": false,
        "options": false,
        "items": this.protections
      },
      "shields": {
        "label": "HI.combatCategory.shields",
        "weapon": false,
        "protection": false,
        "blocking": true,
        "ranged": false,
        "options": false,
        "items": this.shields
      },
      "fightoptions": {
        "label": "HI.combatCategory.fightOptions",
        "weapon": false,
        "protection": false,
        "blocking": false,
        "ranged": false,
        "options": true,
        "items": this.fightoptions
      }
    }
  }


  /*-------------------------------------------- */
  buildRollList() {
    let rolls = []
    for (let key in this.system.attributes) {
      let attr = this.system.attributes[key]
      rolls.push({ key: key, value: attr.value, name: attr.label, type: "attribute" })
    }
    for (let key in this.system.aptitudes) {
      if (key != "def") {
        let apt = this.system.aptitudes[key]
        rolls.push({ key: key, value: apt.value, name: apt.label, type: "aptitude" })
      }
    }
    return rolls
  }

  /*-------------------------------------------- */
  buildListeActions() {
    return this.melee.concat(this.ranged).concat(this.natural)
  }

  /*-------------------------------------------- */
  async manageHealthState() {
    let hpID = "lastHP" + this.id
    let lastHP = await this.getFlag("world", hpID)
    if (lastHP != this.system.resources.hp.value && game.user.isGM) { // Only GM sends this
      await this.setFlag("world", hpID, this.system.resources.hp.value)
      let prone = this.effects.find(ef => ef.label == "EFFECT.StatusProne")
      let dead = this.effects.find(ef => ef.label == "EFFECT.StatusDead")
      if (this.system.resources.hp.value <= 0) {
        if (!prone) {
          await this.createEmbeddedDocuments("ActiveEffect", [
            { label: 'EFFECT.StatusProne', icon: 'icons/svg/falling.svg', flags: { core: { statusId: 'prone' } } }
          ])
        }
        if (this.system.resources.hp.value < -5 && !dead) {
          await this.createEmbeddedDocuments("ActiveEffect", [
            { label: 'EFFECT.StatusDead', icon: 'icons/svg/skull.svg', flags: { core: { statusId: 'dead' } } }
          ])
        }
        ChatMessage.create({
          alias: this.name,
          whisper: BoLUtility.getWhisperRecipientsAndGMs(this.name),
          content: await renderTemplate('systems/hi-fvtt/templates/chat/chat-vitality-zero.hbs', { name: this.name, img: this.img, hp: this.system.resources.hp.value })
        })
      } else {
        if (prone) {
          await this.deleteEmbeddedDocuments("ActiveEffect", [prone.id])
        }
        if (dead) {
          await this.deleteEmbeddedDocuments("ActiveEffect", [dead.id])
        }
      }
    }
  }

  /*-------------------------------------------- */
  async registerInit(rollData) {
    rollData.actor = undefined // Cleanup if present
    await this.setFlag("world", "last-initiative", rollData)
  }

  /*-------------------------------------------- */
  storeVitaliteCombat() {
    this.setFlag("world", "vitalite-before-combat", duplicate(this.system.resources.hp))
  }
  /*-------------------------------------------- */
  async displayRecuperation() {
    let previousHP = this.getFlag("world", "vitalite-before-combat")
    let lossHP = previousHP.value - this.system.resources.hp.value
    //console.log(">>>>> RECUP INFO", previousHP, this.system.resources.hp.value)
    if (previousHP && lossHP > 0 && this.system.resources.hp.value > 0) {
      let msg = await ChatMessage.create({
        alias: this.name,
        whisper: BoLUtility.getWhisperRecipientsAndGMs(this.name),
        content: await renderTemplate('systems/hi-fvtt/templates/chat/chat-recup-information.hbs', {
          name: this.name,
          actorId: this.id,
          lossHP: lossHP,
          recupHP: Math.ceil(lossHP / 2)
        })
      })
    }
    this.unsetFlag("world", "vitalite-before-combat")
  }
  /*-------------------------------------------- */
  async applyRecuperation(recupHP) {
    let hp = duplicate(this.system.resources.hp)
    hp.value += recupHP
    hp.value = Math.min(hp.value, hp.max)
    this.update({ 'system.resources.hp': hp })
    let msg = await ChatMessage.create({
      alias: this.name,
      whisper: BoLUtility.getWhisperRecipientsAndGMs(this.name),
      content: game.i18n.format("HI.chat.inforecup", { name: this.name, recupHP: recupHP })
    })
  }

  /*-------------------------------------------- */
  clearInitiative() {
    this.unsetFlag("world", "last-initiative")
  }

  /*-------------------------------------------- */
  getSize() {
    if (this.system.details.size.length > 0 && game.bol.config.creatureSize[this.system.details.size]) {
      return game.bol.config.creatureSize[this.system.details.size].order
    }
    return game.bol.config.creatureSize["medium"].order // Medium size per default
  }

  /*-------------------------------------------- */
  getInitiativeRank(rollData = undefined, isCombat = false, combatData) {
    if (!rollData) {
      rollData = this.getFlag("world", "last-initiative")
    }
    let fvttInit = 4 // Pietaille par defaut
    if (this.type == 'character') {
      fvttInit = 5
      if (!rollData) {
        fvttInit = -1
        if (isCombat) {
          ui.notifications.info(game.i18n.localize("HI.ui.warninitiative"))
          BoLRoll.aptitudeCheck(this, "init", undefined, combatData)
        }
      } else {
        if (rollData.isLegendary) {
          fvttInit = 10
        } else if (rollData.isCritical) {
          fvttInit = 9
        } else if (rollData.isSuccess) {
          fvttInit = 8
        } else if (rollData.isFumble) {
          fvttInit = 3
        }
      }
    }
    if (this.getCharType() == 'adversary') {
      fvttInit = 7
    }
    if (this.getCharType() == 'tough') {
      fvttInit = 6
    }
    if (this.getCharType() == 'creature') {
      let mySize = this.getSize()
      let sizeSmall = game.bol.config.creatureSize["small"].order
      let sizeMedium = game.bol.config.creatureSize["medium"].order
      if (mySize >= sizeSmall && mySize <= sizeMedium) {
        fvttInit = 6
      }
      if (mySize > sizeMedium) {
        fvttInit = 7
      }
    }
    return fvttInit
  }

  /*-------------------------------------------- */
  async subHeroPoints(nb) {
    let newHeroP = this.system.resources.hero.value - nb;
    newHeroP = (newHeroP < 0) ? 0 : newHeroP;
    await this.update({ 'system.resources.hero.value': newHeroP });
  }
  /*-------------------------------------------- */
  async addHeroPoints(nb) {
    let newHeroP = this.system.resources.hero.value + nb;
    newHeroP = (newHeroP < 0) ? 0 : newHeroP;
    await this.update({ 'system.resources.hero.value': newHeroP });
  }

  /*-------------------------------------------- */
  incDecResources(target, value) {
    let newValue = this.system.resources[target].value + value
    this.update({ [`system.resources.${target}.value`]: newValue })
  }
  /*-------------------------------------------- */
  async sufferDamage(damage) {
    let newHP = this.system.resources.hp.value - damage
    await this.update({ 'system.resources.hp.value': newHP })
  }

  /* -------------------------------------------- */
  getArmorFormula() {
    let protectWorn = this.protections.filter(item => item.system.worn)
    let formula = ""
    for (let protect of protectWorn) {
      if (protect.system.subtype == 'helm') {
        formula += "+1"
      } else if (protect.system.subtype == 'armor') {
        if (BoLUtility.getRollArmor()) {
          if (!protect.system.properties.soak.formula || protect.system.properties.soak.formula == "") {
            ui.notifications.warn(game.i18n.localize("HI.ui.armornoformula", protect.name))
          } else {
            formula += "+" + " max(" + protect.system.properties.soak.formula + ",0)"
          }
        } else {
          if (protect.system.properties.soak.value == undefined) {
            ui.notifications.warn(game.i18n.localize("HI.ui.armornoformula", protect.name))
          } else {
            formula += "+ " + protect.system.properties.soak.value
          }
        }
      }
    }
    console.log("Protect Formula", formula)
    return (formula == "") ? "0" : formula;
  }

  /* -------------------------------------------- */
  rollProtection(itemId) {
    let armor = duplicate(this.items.get(itemId))
    if (armor) {
      let armorFormula = "max(" + armor.system.properties.soak.formula + ", 0)"
      let rollArmor = new Roll(armorFormula)
      rollArmor.roll({ async: false }).toMessage()
    }
  }

  /* -------------------------------------------- */
  rollWeaponDamage(itemId) {
    let weapon = duplicate(this.items.get(itemId))
    if (weapon) {
      let r = new BoLDefaultRoll({ id: randomID(16), isSuccess: true, mode: "weapon", weapon: weapon, actorId: this.id, actor: this })
      r.setSuccess(true)
      r.rollDamage()
    }
  }

  /* -------------------------------------------- */
  toggleEquipItem(item) {
    const equipable = item.system.properties.equipable;
    if (equipable) {
      let itemData = duplicate(item);
      itemData.system.worn = !itemData.system.worn;
      return item.update(itemData);
    }
  }
}