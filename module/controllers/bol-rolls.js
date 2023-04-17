import { BoLUtility } from "../system/bol-utility.js";

const _apt2attr = { brawl: "agility", melee: "agility", ranged: "agility", def: "vigor" }

/* -------------------------------------------- */
export class BoLRoll {

  /* -------------------------------------------- */
  static options() {
    return { classes: ["bol", "dialog"], width: 480, height: 'fit-content' };
  }

  /* -------------------------------------------- */
  static getDefaultAttribute(key) {
    return _apt2attr[key]
  }

  /* -------------------------------------------- */
  static updateApplicableEffects(rollData) {
    let appEffects = []
    for (let effect of rollData.bolEffects) {
      if (effect.system.properties.identifier == "always") {
        appEffects.push(effect)
      } else if (effect.system.properties.identifier.includes(rollData.attribute.key)) {
        appEffects.push(effect)
      } else if (rollData.aptitude && effect.system.properties.identifier.includes(rollData.aptitude.key)) {
        appEffects.push(effect)
      }
    }
    return appEffects
  }

  /* -------------------------------------------- */
  static buildHoroscopeGroupList() {
    let horoscopes = game.settings.get("bol", "horoscope-group")
    let horoList = [{ id: -1, name: "Aucun", type: "malus", nbDice: 0 }]
    for (let id in horoscopes) {
      let horo = horoscopes[id]
      for (let i = 0; i < horo.availableDice; i++) {
        horoList.push({ id: id, name: horo.name, type: horo.type, nbDice: i + 1 })
      }
    }
    return horoList
  }

  /* -------------------------------------------- */
  static getCommonRollData(actor, mode, attribute, aptitude = undefined) {

    let rollData = {
      mode: mode,
      actorId: actor.id,
      tokenId: actor.token?.id,
      img: actor.img,
      attribute: attribute,
      attrValue: attribute.value,
      aptValue: 0,
      careerBonus: 0,
      horoscopeBonus: 0,
      horoscopeMalus: 0,
      selectedHoroscope: [],
      armorAgiMalus: actor.getArmorAgiMalus(),
      armorInitMalus: actor.getArmorInitMalus(),
      horoscopeBonusList: actor.getHoroscopesBonus(),
      horoscopeMalusList: actor.getHoroscopesMalus(),
      adv: "0",
      mod: 0,
      modRanged: 0,
      aptValue: 0,
      bolEffects: actor.boleffects,
      horoscopeGroupList: this.buildHoroscopeGroupList()
    }
    if (aptitude) {
      rollData.aptitude = aptitude
      rollData.aptValue = aptitude.value
    }
    rollData.bolApplicableEffects = this.updateApplicableEffects(rollData)
    return rollData
  }

  /* -------------------------------------------- */
  static attributeCheck(actor, key, event, combatData) {

    let attribute = eval(`actor.system.attributes.${key}`)

    let rollData = this.getCommonRollData(actor, "attribute", attribute)
    rollData.description = game.i18n.localize('BOL.ui.attributeCheck') + " - " + game.i18n.localize(attribute.label)
    rollData.label = (attribute.label) ? game.i18n.localize(attribute.label) : null

    console.log(">>>>>>>>>>", rollData, actor)
    return this.displayRollDialog(rollData)
  }

  /* -------------------------------------------- */
  static aptitudeCheck(actor, key, event, combatData) {

    let aptitude = eval(`actor.system.aptitudes.${key}`)
    let attrKey = this.getDefaultAttribute(key)
    let attribute = eval(`actor.system.attributes.${attrKey}`)

    let rollData = this.getCommonRollData(actor, "aptitude", attribute, aptitude)

    rollData.label = (aptitude.label) ? game.i18n.localize(aptitude.label) : null
    rollData.description = game.i18n.localize('BOL.ui.aptitudeCheck') + " - " + game.i18n.localize(aptitude.label)
    rollData.combatData = combatData // For initiative mainly

    return this.displayRollDialog(rollData)
  }

  /* -------------------------------------------- */
  static async detectDistance(weapon, target) {
    let visible, dist
    if (target && (weapon.system.properties.ranged || weapon.system.properties.throwing)) {
      console.log("target", target, weapon)
      visible = canvas.effects.visibility.testVisibility(target.center, { object: _token })
      dist = Number(canvas.grid.measureDistances([{ ray: new Ray(_token.center, target.center) }], { gridSpaces: false })).toFixed(2)
      let range = Number(weapon.system.properties.range)
      let rangeMsg = "BOL.chat.rangeout"
      if (dist <= range) {
        rangeMsg = "BOL.chat.range0"
      } else if (dist < range * 2) {
        rangeMsg = "BOL.chat.range1"
      } else if (dist < range * 3) {
        rangeMsg = "BOL.chat.range2"
      } else if (dist < range * 4) {
        rangeMsg = "BOL.chat.range3"
      } else if (dist < range * 5) {
        rangeMsg = "BOL.chat.range4"
      } else if (dist < range * 6) {
        rangeMsg = "BOL.chat.range5"
      } else if (dist < range * 7) {
        rangeMsg = "BOL.chat.range6"
      }
      ChatMessage.create({
        content: await renderTemplate('systems/hi-fvtt/templates/chat/chat-info-range.hbs', {
          weapon: weapon,
          attackerName: _token.actor.name,
          defenderName: target.actor.name,
          weaponRange: weapon.system.properties.range,
          visible: visible,
          distance: dist,
          rangeMsg: rangeMsg
        })
      })
    }
  }

  /* -------------------------------------------- */
  static weaponCheckWithWeapon(actor, weapon) {

    let target = BoLUtility.getTarget()

    let weaponData = weapon.system
    let attribute = eval(`actor.system.attributes.${weaponData.properties.attackAttribute}`)
    let aptitude = eval(`actor.system.aptitudes.${weaponData.properties.attackAptitude}`)

    let rollData = this.getCommonRollData(actor, "weapon", attribute, aptitude)

    // Compute distance
    this.detectDistance(weapon, target)

    // Manage specific case
    let fightOption = actor.getActiveFightOption()
    if (fightOption && fightOption.system.fightoptiontype == "fulldefense") {
      ui.notifications.warn(`{{actor.name}} est en Défense Totale ! Il ne peut pas attaquer ce round.`)
      return
    }

    // Update the roll structure
    rollData.weapon = weapon
    rollData.isRanged = weaponData.properties.ranged || weaponData.properties.throwing
    rollData.targetId = target?.id
    rollData.fightOption = fightOption
    rollData.defenderId = target?.actor.id
    rollData.label = (weapon.name) ? weapon.name : game.i18n.localize('BOL.ui.noWeaponName')
    rollData.description = game.i18n.localize('BOL.ui.weaponAttack') + " : " + weapon.name

    return this.displayRollDialog(rollData)
  }

  /* -------------------------------------------- */
  static weaponCheck(actor, event) {
    const li = $(event.currentTarget).parents(".item")
    let weapon = actor.items.get(li.data("item-id"))
    if (!weapon) {
      ui.notifications.warn("Unable to find weapon !")
      return
    }
    weapon = duplicate(weapon)
    return this.weaponCheckWithWeapon(actor, weapon)
  }

  /* -------------------------------------------- */
  static alchemyCheck(actor, event) {
    const li = $(event.currentTarget).parents(".item");
    let alchemy = actor.items.get(li.data("item-id"));
    if (!alchemy) {
      ui.notifications.warn("Unable to find Alchemy !");
      return;
    }
    alchemy = duplicate(alchemy)
    let alchemyData = alchemy.system
    if (alchemyData.properties.pccurrent < alchemyData.properties.pccost) {
      ui.notifications.warn("Pas assez de Points de Création investis dans la Préparation !")
      return
    }

    let rollData = this.getCommonRollData(actor, "alchemy", actor.system.attributes.mind)

    rollData.alchemy = alchemy
    rollData.careerBonus = actor.getAlchemistBonus()
    rollData.pcCost = Number(alchemyData.properties.pccost)
    rollData.pcCostCurrent = Number(alchemyData.properties.pccurrent)
    rollData.mod = Number(alchemyData.properties.difficulty)
    rollData.label = alchemy.name
    rollData.description = game.i18n.localize('BOL.ui.makeAlchemy') + "+" + alchemy.name

    console.log("ALCHEMY!", rollData);
    return this.displayRollDialog(rollData);
  }

  /* -------------------------------------------- */
  static horoscopeCheck(actor, event, horoscopeType) {
    let cost = (horoscopeType == "minor") ? 1 : 2
    if (cost > actor.getAstrologyPoints()) {
      ui.notifications.warn(game.i18n.localize("BOL.ui.astrologyNoPoints"))
      return
    }
    let rollData = this.getCommonRollData(actor, "horoscope", actor.system.attributes.mind)

    rollData.careerBonus = actor.getAstrologerBonus()
    rollData.horoscopeType = horoscopeType
    rollData.horoscopeTypeLabel = "BOL.ui." + horoscopeType
    rollData.astrologyPointsCost = cost
    rollData.label = game.i18n.localize('BOL.ui.makeHoroscope')
    rollData.description = game.i18n.localize('BOL.ui.makeHoroscope') + " " + game.i18n.localize(rollData.horoscopeTypeLabel)

    console.log("HOROSCOPE!", rollData);
    return this.displayRollDialog(rollData);
  }

  /* -------------------------------------------- */
  static spellCheckWithSpell(actor, spell) {
    let rollData = this.getCommonRollData(actor, "spell", actor.system.attributes.mind)

    rollData.spell = spell
    rollData.ppCurrent = Number(actor.system.resources.power.value),
      rollData.careerBonus = actor.getSorcererBonus(),
      rollData.ppCostArmor = actor.getPPCostArmor(),
      rollData.ppCost = Number(spell.system.properties.ppcost),
      rollData.mod = Number(spell.system.properties.difficulty),
      rollData.label = spell.name,
      rollData.description = game.i18n.localize('BOL.ui.focusSpell') + " : " + spell.name

    //console.log("SPELL!", spellDef)
    return this.displayRollDialog(rollData)
  }

  /* -------------------------------------------- */
  static spellCheck(actor, event) {
    if (actor.system.resources.power.value <= 0) {
      ui.notifications.warn("Plus assez de points de Pouvoir !")
      return
    }
    const li = $(event.currentTarget).parents(".item")
    let spell = actor.items.get(li.data("item-id"))
    if (!spell) {
      ui.notifications.warn("Impossible de trouver ce sort !")
      return
    }
    spell = duplicate(spell)
    return this.spellCheckWithSpell(actor, spell)
  }

  /* -------------------------------------------- */
  static updateTotalDice() {

    this.updateArmorMalus(this.rollData)
    this.updatePPCost(this.rollData)

    // get basic dices from boons/flaws
    let effectModifier = 0
    this.rollData.bmDice = this.rollData.nbBoons - this.rollData.nbFlaws + this.rollData.bDice - this.rollData.mDice
    // add applicable bonus/malus dices effects
    for (let effect of this.rollData.bolApplicableEffects) {
      if (effect.system.properties.modifier == "1B") {
        this.rollData.bmDice++;
      } else if (effect.system.properties.modifier == "1B") {
        this.rollData.bmDice += 2;
      } else if (effect.system.properties.modifier == "1M") {
        this.rollData.bmDice--;
      } else if (effect.system.properties.modifier == "2M") {
        this.rollData.bmDice -= 2;
      } else {
        effectModifier += Number(effect.system.properties.modifier)
      }
    }
    this.rollData.bmDice += this.rollData.horoscopeBonus
    this.rollData.bmDice -= this.rollData.horoscopeMalus
    if (this.rollData.selectedGroupHoroscopeIndex && this.rollData.selectedGroupHoroscopeIndex > 0) {
      let horo = this.rollData.horoscopeGroupList[this.rollData.selectedGroupHoroscopeIndex]
      this.rollData.bmDice += (horo.type == "malus") ? -horo.nbDice : horo.nbDice;
    }
    // Keep track of the final effect modifier
    this.rollData.effectModifier = effectModifier

    // Final number of dices    
    this.rollData.nbDice = 2 + Math.abs(this.rollData.bmDice)
    // Bonus or Malus ?
    if (this.rollData.bmDice == 0) {
      $('#roll-nbdice').val("2")
    } else {
      let letter = (this.rollData.bmDice > 0) ? "B" : "M"
      $('#roll-nbdice').val("2 + " + String(Math.abs(this.rollData.bmDice)) + letter)
    }
    let rollbase = this.rollData.attrValue + "+" + this.rollData.aptValue
    if (this.rollData.weapon && this.rollData.weapon.system.properties.onlymodifier) {
      rollbase = ""
    }
    $('#roll-modifier').val(rollbase + "+" + this.rollData.careerBonus + "+" + this.rollData.mod + "+" +
      this.rollData.modRanged + "+" + this.rollData.weaponModifier + "-" + this.rollData.defence + "-" + this.rollData.modArmorMalus + "-" +
      this.rollData.shieldMalus + "+" + this.rollData.attackModifier + "+" + this.rollData.appliedArmorMalus + "+" + effectModifier)

    // Rebuild lits of applicable effects
    let selectEffects = ""
    for (let effect of this.rollData.bolApplicableEffects) {
      selectEffects += `<option value="${effect.id}" selected>${effect.name}</option>`
    }
    $('#applicable-effects').html(selectEffects)
  }

  /* -------------------------------------------- */
  static preProcessFightOption(rollData) {
    rollData.damagesIgnoresArmor = false  // Always reset flags
    rollData.modArmorMalus = 0
    rollData.attackModifier = 0

    let fgItem = rollData.fightOption
    if (fgItem) {
      console.log(fgItem)
      if (fgItem.system.properties.fightoptiontype == "armordefault") {
        rollData.modArmorMalus = rollData.armorMalus // Activate the armor malus
        rollData.damagesIgnoresArmor = true
      }
      if (fgItem.system.properties.fightoptiontype == "intrepid") {
        rollData.attackModifier += 2
      }
      if (fgItem.system.properties.fightoptiontype == "defense") {
        rollData.attackModifier += -1
      }
      if (fgItem.system.properties.fightoptiontype == "attack") {
        rollData.attackModifier += 1
      }
      if (fgItem.system.properties.fightoptiontype == "twoweaponsdef" || fgItem.system.properties.fightoptiontype == "twoweaponsatt") {
        rollData.attackModifier += -1
      }
    }
  }
  /* -------------------------------------------- */
  static updateArmorMalus(rollData) {
    rollData.appliedArmorMalus = 0
    if (rollData.attribute.key == "agility") {
      $("#armor-agi-malus").show()
      rollData.appliedArmorMalus += rollData.armorAgiMalus
    } else {
      $("#armor-agi-malus").hide()
    }
    if (rollData.aptitude && rollData.aptitude.key == "init") {
      $("#armor-init-malus").show()
      rollData.appliedArmorMalus += rollData.armorInitMalus
    } else {
      $("#armor-init-malus").hide()
    }
  }

  /* ------------------------------ -------------- */
  static updatePPCost(rollData) {
    $('#ppcost').html(rollData.ppCost + " + Armor(" + rollData.ppCostArmor + ")=" + Number(rollData.ppCost + rollData.ppCostArmor))
  }

  /* ------------------------------ -------------- */
  static rollDialogListener(html) {

    this.updateTotalDice()

    html.find('#optcond').change((event) => { // Dynamic change of PP cost of spell
      let pp = BoLUtility.computeSpellCost(this.rollData.spell, event.currentTarget.selectedOptions.length)
      this.rollData.ppCost = pp
      this.updatePPCost(this.rollData)
    })

    html.find('#mod').change((event) => {
      this.rollData.mod = Number(event.currentTarget.value)
      this.updateTotalDice()
    })
    html.find('#modRanged').change((event) => {
      this.rollData.modRanged = Number(event.currentTarget.value)
      this.updateTotalDice()
    })

    html.find('#attr').change((event) => {
      let attrKey = event.currentTarget.value
      let actor = BoLUtility.getActorFromRollData(this.rollData)
      this.rollData.attribute = duplicate(actor.system.attributes[attrKey])
      this.rollData.attrValue = actor.system.attributes[attrKey].value
      this.rollData.bolApplicableEffects = this.updateApplicableEffects(this.rollData)
      this.updateTotalDice()
    })
    html.find('#apt').change((event) => {
      let aptKey = event.currentTarget.value
      let actor = BoLUtility.getActorFromRollData(this.rollData)
      this.rollData.aptitude = duplicate(actor.system.aptitudes[aptKey])
      this.rollData.aptValue = actor.system.aptitudes[aptKey].value
      this.rollData.bolApplicableEffects = this.updateApplicableEffects(this.rollData)
      this.updateTotalDice()
    })

    html.find('#applyShieldMalus').click((event) => {
      if (event.currentTarget.checked) {
        this.rollData.shieldMalus = this.rollData.shieldAttackMalus
      } else {
        this.rollData.shieldMalus = 0
      }
    })

    html.find('#career').change((event) => {
      let careers = $('#career').val()
      this.rollData.careerBonus = (!careers || careers.length == 0) ? 0 : Math.max(...careers.map(i => parseInt(i)))
      this.updateTotalDice()
    })
    html.find('#boon').change((event) => {
      let boons = $('#boon').val()
      this.rollData.nbBoons = (!boons || boons.length == 0) ? 0 : boons.length
      this.updateTotalDice()
    })
    html.find('#flaw').change((event) => {
      let flaws = $('#flaw').val()
      this.rollData.nbFlaws = (!flaws || flaws.length == 0) ? 0 : flaws.length
      this.updateTotalDice()
    })
    html.find('.bdice').click((event) => {
      this.rollData.mDice = 0
      this.rollData.bDice = Number(event.currentTarget.value)
      this.updateTotalDice()
    })
    html.find('.mdice').click((event) => {
      this.rollData.bDice = 0
      this.rollData.mDice = Number(event.currentTarget.value)
      this.updateTotalDice()
    })
    html.find('#horoscope-bonus-applied').change((event) => {
      this.rollData.selectedHoroscope = []
      for (let option of event.currentTarget.selectedOptions) {
        this.rollData.selectedHoroscope.push(duplicate(this.rollData.horoscopeBonusList[Number(option.index)]))
      }
      let horoscopes = $('#horoscope-bonus-applied').val()
      this.rollData.horoscopeBonus = (!horoscopes || horoscopes.length == 0) ? 0 : horoscopes.length
      this.updateTotalDice()
    })

    html.find('#horoscope-malus-applied').change((event) => {
      this.rollData.selectedHoroscope = []
      for (let option of event.currentTarget.selectedOptions) {
        this.rollData.selectedHoroscope.push(duplicate(this.rollData.horoscopeBonusList[Number(option.index)]))
      }
      let horoscopes = $('#horoscope-malus-applied').val()
      this.rollData.horoscopeMalus = (!horoscopes || horoscopes.length == 0) ? 0 : horoscopes.length
      this.updateTotalDice()
    })
    html.find('#horoscope-group-applied').change((event) => {
      this.rollData.selectedGroupHoroscopeIndex = event.currentTarget.value
      this.updateTotalDice()
    })


  }

  /* -------------------------------------------- */
  static preProcessWeapon(rollData, defender) {
    if (rollData.mode == "weapon") {
      rollData.weaponModifier = rollData.weapon.system.properties.attackModifiers ?? 0
      rollData.attackBonusDice = rollData.weapon.system.properties.attackBonusDice
      if (rollData.attackBonusDice) {
        rollData.adv = "1B"
        rollData.bDice = 1
      }
      if (defender) { // If target is selected
        rollData.defence = defender.defenseValue
        rollData.armorMalus = defender.armorMalusValue
        rollData.shieldBlock = 'none'
        let shields = defender.shields
        for (let shield of shields) {
          rollData.shieldBlock = (shield.system.properties.blocking.blockingAll) ? 'blockall' : 'blockone';
          rollData.shieldAttackMalus = (shield.system.properties.blocking.malus) ? shield.system.properties.blocking.malus : 1;
          rollData.applyShieldMalus = false
        }
      }
    }
  }

  /* ROLL DIALOGS                                 */
  /* -------------------------------------------- */
  static async displayRollDialog(rollData, onEnter = "submit") {

    // initialize default flags/values
    const rollOptionTpl = `systems/hi-fvtt/templates/dialogs/${rollData.mode}-roll-dialog.hbs`

    let actor = BoLUtility.getActorFromRollData(rollData)
    let defender
    if (rollData.targetId) {
      let token = game.scenes.current.tokens.get(rollData.targetId)
      defender = token.actor
    }

    rollData.careers = actor.careers
    rollData.boons = actor.bonusBoons
    rollData.flaws = actor.malusFlaws
    rollData.rollOwnerID = actor.id
    rollData.defence = 0
    rollData.attackModifier = 0 // Used for fight options
    rollData.modArmorMalus = 0 // Used for fight options
    rollData.bDice = 0
    rollData.mDice = 0
    rollData.nbBoons = 0
    rollData.nbFlaws = 0
    rollData.nbDice = 0
    if (rollData.shieldBlock == 'blockall') {
      rollData.shieldMalus = rollData.shieldAttackMalus;
    } else {
      rollData.shieldMalus = 0
    }
    rollData.careerBonus = rollData.careerBonus ?? 0
    rollData.modRanged = rollData.modRanged ?? 0
    rollData.mod = rollData.mod ?? 0
    rollData.id = randomID(16)
    rollData.weaponModifier = 0
    rollData.attackBonusDice = false
    rollData.armorMalus = 0
    // Specific stuff 
    this.preProcessWeapon(rollData, defender)
    this.preProcessFightOption(rollData)
    this.updateArmorMalus(rollData)
    this.updatePPCost(rollData)
    // Save
    this.rollData = rollData
    console.log("ROLLDATA", rollData)

    // Then display+process the dialog
    const rollOptionContent = await renderTemplate(rollOptionTpl, rollData);
    let d = new Dialog({
      title: rollData.label,
      content: rollOptionContent,
      rollData: rollData,
      render: html => this.rollDialogListener(html),
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("BOL.ui.cancel"),
          callback: () => {
          }
        },
        submit: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize("BOL.ui.submit"),
          callback: (html) => {
            if (rollData.mode == 'spell' && rollData.ppCurrent < rollData.ppCost) { // Check PP available
              ui.notifications.warn("Pas assez de Points de Pouvoir !")
              return
            }
            //console.log("ROLLMALUS", rollData)

            rollData.registerInit = (rollData.aptitude && rollData.aptitude.key == 'init') ? $('#register-init').is(":checked") : false;

            const isMalus = (rollData.bmDice < 0)
            //rollData.nbDice += (rollData.attackBonusDice) ? 1 : 0

            let rollbase = rollData.attrValue + rollData.aptValue
            if (rollData.weapon && rollData.weapon.system.properties.onlymodifier) {
              rollbase = 0
            }

            let diceData = BoLUtility.getDiceData()
            const modifiers = rollbase + rollData.careerBonus + rollData.mod + rollData.weaponModifier - rollData.defence - rollData.modArmorMalus + rollData.shieldMalus + rollData.attackModifier + rollData.appliedArmorMalus + rollData.effectModifier
            const formula = (isMalus) ? rollData.nbDice + "d" + diceData.diceFormula + "kl2 + " + modifiers : rollData.nbDice + "d" + diceData.diceFormula + "kh2 + " + modifiers
            rollData.formula = formula
            rollData.modifiers = modifiers

            let r = new BoLDefaultRoll(rollData);
            r.roll();
          }
        }
      },
      default: onEnter,
      close: () => { }
    }, this.options());

    return d.render(true);
  }
}

/* -------------------------------------------- */
export class BoLDefaultRoll {

  constructor(rollData) {
    this.rollData = rollData
    if (this.rollData.isSuccess == undefined) { // First init
      this.rollData.isSuccess = false;
      this.rollData.isCritical = false;
      this.rollData.isFumble = false;
    }
    if (this.rollData.optionsId) {
      BoLUtility.cleanupButtons(this.rollData.optionsId)
    }
    if (this.rollData.applyId) {
      BoLUtility.cleanupButtons(this.rollData.applyId)
    }
    this.rollData.optionsId = randomID(16)
    this.rollData.applyId = randomID(16)
  }

  /* -------------------------------------------- */
  async roll() {

    const r = new Roll(this.rollData.formula)
    //console.log("Roll formula", this.rollData.formula)
    await r.roll({ "async": false })

    let diceData = BoLUtility.getDiceData()
    //console.log("DICEDATA", diceData)
    const activeDice = r.terms[0].results.filter(r => r.active)
    const diceTotal = activeDice.map(r => r.result).reduce((a, b) => a + b)
    this.rollData.roll = r
    this.rollData.isSuccess = (r.total >= diceData.successValue)
    this.rollData.isCritical = (diceTotal >= diceData.criticalSuccessValue)
    this.rollData.isRealCritical = (diceTotal >= diceData.criticalSuccessValue)
    this.rollData.isHeroic = (diceTotal >= diceData.criticalSuccessValue)
    this.rollData.isLegendary = false
    this.rollData.isFumble = (diceTotal <= diceData.criticalFailureValue)
    this.rollData.isFailure = !this.rollData.isSuccess

    let actor = BoLUtility.getActorFromRollData(this.rollData)
    if (this.rollData.reroll == undefined) {
      this.rollData.reroll = actor.heroReroll()
    }
    if (this.rollData.registerInit) {
      actor.registerInit(this.rollData)
      this.rollData.initiativeRank = actor.getInitiativeRank(this.rollData)
      if (this.rollData.combatData) { // If combatData present
        let combat = game.combats.get(this.rollData.combatData.combatId)
        combat.setInitiative(this.rollData.combatData.combatantId, this.rollData.initiativeRank)
      }
    }
    if (this.rollData.isSuccess && this.rollData.mode == "spell") { // PP cost management
      this.rollData.remainingPP = actor.spendPowerPoint(this.rollData.ppCost + this.rollData.ppCostArmor)
    }

    if (this.rollData.mode == "alchemy") { // PP cost management
      actor.resetAlchemyStatus(this.rollData.alchemy._id)
    }
    if (this.rollData.mode == "bougette" && this.rollData.isFailure) {
      actor.decBougette()
    }

    await this.sendChatMessage()

    if (this.rollData.mode == "horoscope") { // PP cost management
      actor.manageHoroscope(this.rollData)
    }
    if (this.rollData.selectedHoroscope.length > 0) { // PP cost management
      actor.removeHoroscopeMinor(this.rollData)
    }
    if (this.rollData.selectedGroupHoroscopeIndex && this.rollData.selectedGroupHoroscopeIndex > 0) { // PP cost management
      BoLUtility.removeGroupHoroscope(this.rollData)
    }
  }

  /* -------------------------------------------- */
  async sendChatMessage() {
    let actor = BoLUtility.getActorFromRollData(this.rollData)
    this._buildChatMessage(this.rollData).then(async msgFlavor => {
      let msg = await this.rollData.roll.toMessage({
        user: game.user.id,
        rollMode: game.settings.get("core", "rollMode"),
        //whisper: BoLUtility.getWhisperRecipientsAndGMs(this.rollData.actor.name),
        flavor: msgFlavor,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
      })
      msg.setFlag("world", "bol-roll-data", this.rollData)
    })
  }

  /* -------------------------------------------- */
  upgradeToLegendary() {
    // Force to Critical roll
    let diceData = BoLUtility.getDiceData()
    let maxValue = Number(diceData.diceFormula) * 2

    this.rollData.isCritical = true
    this.rollData.isLegendary = true
    this.rollData.isRealCritical = false
    this.rollData.isSuccess = true
    this.rollData.isFailure = false
    this.rollData.roll = new Roll(maxValue + "+" + this.rollData.modifiers)
    this.rollData.reroll = false
    this.sendChatMessage()
  }

  /* -------------------------------------------- */
  upgradeToHeroic() {
    // Force to Critical roll
    let diceData = BoLUtility.getDiceData()
    let maxValue = Number(diceData.diceFormula) * 2

    this.rollData.isCritical = true
    this.rollData.isHeroic = true
    this.rollData.isLegendary = false
    this.rollData.isRealCritical = false
    this.rollData.isSuccess = true
    this.rollData.isFailure = false
    this.rollData.roll = new Roll(maxValue + "+" + this.rollData.modifiers)
    this.rollData.reroll = false
    this.sendChatMessage()
  }

  /* -------------------------------------------- */
  setSuccess(flag) {
    this.rollData.isSuccess = flag
  }

  /* -------------------------------------------- */
  async sendDamageMessage() {
    let actor = BoLUtility.getActorFromRollData(this.rollData)
    this._buildDamageChatMessage(this.rollData).then(async msgFlavor => {
      let msg = await this.rollData.damageRoll.toMessage({
        user: game.user.id,
        flavor: msgFlavor,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flags: { msgType: "default" }
      })
      this.rollData.actor = undefined // Cleanup
      msg.setFlag("world", "bol-roll-data", this.rollData)
    })
  }

  /* -------------------------------------------- */
  getDamageAttributeValue(attrDamage, actorId = undefined) {
    let actor = BoLUtility.getActorFromRollData(this.rollData)
    return actor.getDamageAttributeValue(attrDamage)
  }

  /* -------------------------------------------- */
  async rollDamage() {
    if (this.rollData.mode != "weapon") { // Only specific process in Weapon mode
      return
    }

    if (this.rollData.isSuccess) {
      if (!this.rollData.damageRoll) {
        let bonusDmg = 0
        if (this.rollData.damageMode == 'damage-plus-6') {
          bonusDmg = 6
        }
        if (this.rollData.damageMode == 'damage-plus-12') {
          bonusDmg = 12
        }
        let attrDamageValue = this.getDamageAttributeValue(this.rollData.weapon.system.properties.damageAttribute)
        let weaponFormula = BoLUtility.getDamageFormula(this.rollData.weapon.system, this.rollData.fightOption)

        let damageFormula = weaponFormula + "+" + bonusDmg + "+" + attrDamageValue

        //console.log("Formula", weaponFormula, damageFormula, this.rollData.weapon.data.data.properties.damage)
        this.rollData.damageFormula = damageFormula
        this.rollData.damageRoll = new Roll(damageFormula)
        await this.rollData.damageRoll.roll({ "async": false })
        this.rollData.damageTotal = this.rollData.damageRoll.total
        console.log("DAMAGE !!!", damageFormula, attrDamageValue, this.rollData)
      }
      BoLUtility.cleanupButtons(this.rollData.optionsId)
      this.sendDamageMessage()
    }
  }

  /* -------------------------------------------- */
  _buildDamageChatMessage(rollData) {
    const rollMessageTpl = 'systems/hi-fvtt/templates/chat/rolls/damage-roll-card.hbs';
    return renderTemplate(rollMessageTpl, rollData)
  }

  /* -------------------------------------------- */
  _buildChatMessage(rollData) {
    const rollMessageTpl = 'systems/hi-fvtt/templates/chat/rolls/default-roll-card.hbs'
    return renderTemplate(rollMessageTpl, rollData)
  }

}
