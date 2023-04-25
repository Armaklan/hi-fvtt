import { BoLDefaultRoll } from "../controllers/bol-rolls.js";

// Spell circle to min PP cost
const __circle2minpp = { 0: 0, 1: 2, 2: 6, 3: 11 }
const __validDices = { "6": 1, "8": 1, "10": 1, "12": 1 }
export class BoLUtility {


  /* -------------------------------------------- */
  static init() {
    game.settings.register("bol", "rollArmor", {
      name: "Effectuer des jets pour les armures",
      hint: "Effectue un jet de dés pour les armures (valeur fixe si désactivé)",
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
      onChange: lang => window.location.reload()
    })
    game.settings.register("bol", "useBougette", {
      name: "Utiliser la Bougette (règle fan-made)",
      hint: "Utilise un indicateur de Bougette, comme décrit dans l'aide de jeu Gold&Glory du RatierBretonnien (https://www.lahiette.com/leratierbretonnien/)",
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
      onChange: lang => window.location.reload()
    })
    game.settings.register("bol", "dice-formula", {
      name: "Formule de dés",
      hint: "Sélectionne la formule de dés (par défaut 2d6)",
      scope: "world",
      config: true,
      default: "2d6",
      type: String,
      choices: { "6": "2d6", "8": "2d8", "10": "2d10", "12": "2d12", "20": "2d20" },
      onChange: value => {
        BoLUtility.setDiceFormula(value)
      }
    })
    game.settings.register("bol", "dice-success-value", {
      name: "Seuil de succès",
      hint: "Sélectionne le seuil de succès (9 par défaut pour 2d6)",
      scope: "world",
      config: true,
      default: 9,
      range: {
        min: 2,
        max: 40,
        step: 1
      },
      type: Number,
      onChange: value => {
        BoLUtility.setSuccessValue(value)
      }
    })
    game.settings.register("bol", "dice-critical-success-value", {
      name: "Valeur min de réussite critique",
      hint: "Indique le seuil minimum de réussite critique (12 par défaut pour 2d6). Si les réussites critiques sont sur 19 et 20, alors indiquez 19.",
      scope: "world",
      config: true,
      default: 12,
      range: {
        min: 2,
        max: 40,
        step: 1
      },
      type: Number,
      onChange: value => {
        BoLUtility.setCriticalSuccessValue(value)
      }
    })
    game.settings.register("bol", "dice-critical-failure-value", {
      name: "Valeur max d'échec critique",
      hint: "Indique le seuil maximum d'échec critique (2 par défaut pour 2d6). Si les échecs critiques sont sur 2 et 3, alors indiquez 3.",
      scope: "world",
      config: true,
      default: 2,
      range: {
        min: 2,
        max: 40,
        step: 1
      },
      type: Number,
      onChange: value => {
        BoLUtility.setCriticalFailureValue(value)
      }
    })
    game.settings.register("world", "character-summary-data", {
      name: "character-summary-data",
      scope: "world",
      config: false,
      default: { npcList: [], x: 200, y: 200 },
      type: Object
    })
    game.settings.register("bol", "logoActorSheet", {
      name: "Chemin du logo des fiches de perso",
      hint: "Vous pouvez changer le logo BoL des fiches de perso, pour jouer dans un autre univers (idéalement 346 x 200, défaut : systems/hi-fvtt/ui/logo.webp)",
      scope: "world",
      config: true,
      default: "systems/hi-fvtt/ui/logo-hi.gif",
      type: String,
      onChange: lang => window.location.reload()
    })
    game.settings.register("bol", "logoTopLeft", {
      name: "Chemin du logo haut gauche",
      hint: "Vous pouvez changer le logo BoL en haut à gauche de chaque écran (idéalement 718 x 416, défaut : systems/hi-fvtt/ui/logo2.webp)",
      scope: "world",
      config: true,
      default: "systems/hi-fvtt/ui/logo-hi.gif",
      type: String,
      onChange: lang => window.location.reload()
    })
    game.settings.register("bol", "horoscope-group", {
      name: "horoscope-group",
      scope: "world",
      config: false,
      default: {},
      type: Object
    })

    this.rollArmor = game.settings.get("bol", "rollArmor") // Roll armor or not
    this.useBougette = game.settings.get("bol", "useBougette") // Use optionnal bougette rules
    this.actorSheetLogo = game.settings.get("bol", "logoActorSheet") || "systems/hi-fvtt/ui/logo.webp"
    this.logoTopLeft = game.settings.get("bol", "logoTopLeft") || "systems/hi-fvtt/ui/logo2.webp"

    this.diceFormula = game.settings.get("bol", "dice-formula")
    this.successValue = Number(game.settings.get("bol", "dice-success-value"))
    this.criticalSuccessValue = Number(game.settings.get("bol", "dice-critical-success-value"))
    this.criticalFailureValue = Number(game.settings.get("bol", "dice-critical-failure-value"))
  }

  /* -------------------------------------------- */
  static setDiceFormula(value) {
    this.diceFormula = value
  }
  static setSuccessValue(value) {
    this.successValue = Number(value)
  }
  static setCriticalSuccessValue(value) {
    this.criticalSuccessValue = Number(value)
  }
  static setCriticalFailureValue(value) {
    this.criticalFailureValue = Number(value)
  }
  static getDiceData() {
    let df = this.diceFormula
    if (!__validDices[String(this.diceFormula)]) {
      df = "6"
    }
    return {
      diceFormula: this.diceFormula,
      successValue: this.successValue,
      criticalSuccessValue: this.criticalSuccessValue,
      criticalFailureValue: this.criticalFailureValue
    }
  }
  /* -------------------------------------------- */
  static getRollArmor() {
    return this.rollArmor
  }
  /* -------------------------------------------- */
  static getUseBougette() {
    return this.useBougette
  }
  /* -------------------------------------------- */
  static getLogoActorSheet() {
    return this.actorSheetLogo
  }
  /* -------------------------------------------- */
  static getLogoTopLeft() {
    return this.logoTopLeft
  }
  /* -------------------------------------------- */
  static getActorFromRollData(rollData) {
    let actor = game.actors.get(rollData.actorId)
    if (rollData.tokenId) {
      let token = canvas.tokens.placeables.find(t => t.id == rollData.tokenId)
      if (token) {
        actor = token.actor
      }
    }
    return actor
  }

  /* -------------------------------------------- */
  static async ready() {
    //$("#logo").attr("src", this.getLogoTopLeft() )  
    $("#logo").css("content", `url(${this.getLogoTopLeft()})`)

    CONFIG.statusEffects = duplicate(game.hi.config.statusEffects)
  }

  /* -------------------------------------------- */
  static templateData(it) {
    return BoLUtility.data(it)?.data ?? {}
  }

  /* -------------------------------------------- */
  static data(it) {
    if (it instanceof Actor || it instanceof Item || it instanceof Combatant) {
      return it.data;
    }
    return it;
  }

  /* -------------------------------------------- */
  static storeRoll(roll) {
    this.rollTab[roll.id] = roll
  }

  /* -------------------------------------------- */
  static getRoll(rollId) {
    return this.rollTab[roll.id]
  }

  /* -------------------------------------------- */
  static createDirectOptionList(min, max) {
    let options = {};
    for (let i = min; i <= max; i++) {
      options[`${i}`] = `${i}`;
    }
    return options;
  }

  /* -------------------------------------------- */
  static buildListOptions(min, max) {
    let options = [];
    for (let i = min; i <= max; i++) {
      options.push(`<option value="${i}">${i}</option>`);
    }
    return options.join("");
  }

  /* -------------------------------------------- */
  static async showDiceSoNice(roll, rollMode) {
    if (game.modules.get("dice-so-nice")?.active) {
      if (game.dice3d) {
        let whisper = null;
        let blind = false;
        rollMode = rollMode ?? game.settings.get("core", "rollMode");
        switch (rollMode) {
          case "blindroll": //GM only
            blind = true;
          case "gmroll": //GM + rolling player
            whisper = this.getUsers(user => user.isGM);
            break;
          case "roll": //everybody
            whisper = this.getUsers(user => user.active);
            break;
          case "selfroll":
            whisper = [game.user.id];
            break;
        }
        await game.dice3d.showForRoll(roll, game.user, true, whisper, blind);
      }
    }
  }
  /* -------------------------------------------- */
  static getUsers(filter) {
    return game.users.filter(filter).map(user => user.data._id);
  }
  /* -------------------------------------------- */
  static getWhisperRecipients(rollMode, name) {
    switch (rollMode) {
      case "blindroll": return this.getUsers(user => user.isGM);
      case "gmroll": return this.getWhisperRecipientsAndGMs(name);
      case "selfroll": return [game.user.id];
    }
    return undefined;
  }
  /* -------------------------------------------- */
  static getOtherWhisperRecipients(name) {
    let users = []
    for (let user of game.users) {
      if (!user.isGM && user.name != name) {
        users.push(user.id)
      }
    }
    return users
  }

  /* -------------------------------------------- */
  static getWhisperRecipientsAndGMs(name) {
    let recep1 = ChatMessage.getWhisperRecipients(name) || [];
    return recep1.concat(ChatMessage.getWhisperRecipients('GM'));
  }

  /* -------------------------------------------- */
  static blindMessageToGM(chatOptions) {
    let chatGM = duplicate(chatOptions);
    chatGM.whisper = this.getUsers(user => user.isGM);
    chatGM.content = "Blind message of " + game.user.name + "<br>" + chatOptions.content;
    console.log("blindMessageToGM", chatGM);
    game.socket.emit("system.hi-fvtt", { name: "msg_gm_chat_message", data: chatGM });
  }

  /* -------------------------------------------- */
  static sendAttackSuccess(rollData) {
    if (rollData.targetId) {
      // Broadcast to GM or process it directly in case of GM defense
      if (!game.user.isGM) {
        game.socket.emit("system.hi-fvtt", { name: "msg_attack_success", data: duplicate(rollData) })
      } else {
        BoLUtility.processAttackSuccess(rollData)
      }
    }
  }

  /* -------------------------------------------- */
  static async chatMessageHandler(message, html, data) {
    const chatCard = html.find('.flavor-text')
    if (chatCard.length > 0) {
      // If the user is the message author or the actor owner, proceed
      const actor = game.actors.get(data.message.speaker.actor)
      //console.log("FOUND 1!!! ", actor)
      if (actor && actor.isOwner) return
      else if (game.user.isGM || data.author.id === game.user.id) return

      const divButtons = chatCard.find('.actions-section')
      divButtons.hide()
    }
  }

  /* -------------------------------------------- */
  static getRollDataFromMessage(event) {
    let messageId = BoLUtility.findChatMessageId(event.currentTarget)
    let message = game.messages.get(messageId)
    return message.getFlag("world", "bol-roll-data")
  }

  /* -------------------------------------------- */
  static cleanupButtons(id) {
    $(`#${id}`).hide() // Hide the options roll buttons
    game.socket.emit("system.hi-fvtt", { name: "msg_cleanup_buttons", data: { id: id } })
  }

  /* -------------------------------------------- */
  static async chatListeners(html) {

    // Damage handling
    html.on("click", '.chat-damage-apply', event => {
      let rollData = BoLUtility.getRollDataFromMessage(event)
      BoLUtility.cleanupButtons(rollData.applyId)
      BoLUtility.sendAttackSuccess(rollData)
    });

    html.on("click", '.chat-damage-roll', event => {
      event.preventDefault()
      let rollData = BoLUtility.getRollDataFromMessage(event)
      rollData.damageMode = event.currentTarget.attributes['data-damage-mode'].value
      let bolRoll = new BoLDefaultRoll(rollData)
      bolRoll.rollDamage()
    });

    html.on("click", '.transform-legendary-roll', event => {
      event.preventDefault();
      let rollData = BoLUtility.getRollDataFromMessage(event)
      let actor = game.actors.get(rollData.actorId)
      actor.subHeroPoints(1)
      let r = new BoLDefaultRoll(rollData)
      r.upgradeToLegendary()
    })

    html.on("click", '.transform-heroic-roll', event => {
      event.preventDefault();
      let rollData = BoLUtility.getRollDataFromMessage(event)
      let actor = game.actors.get(rollData.actorId)
      actor.subHeroPoints(1)
      let r = new BoLDefaultRoll(rollData)
      r.upgradeToHeroic()
    })

    html.on("click", '.hero-reroll', event => {
      event.preventDefault();
      let rollData = BoLUtility.getRollDataFromMessage(event)
      let actor = game.actors.get(rollData.actorId)
      actor.subHeroPoints(1)
      rollData.reroll = false // Disable reroll option for second roll
      let r = new BoLDefaultRoll(rollData)
      r.roll();
    });


    html.on("click", '.hero-addOne', event => {
      event.preventDefault();
      let rollData = BoLUtility.getRollDataFromMessage(event)
      let actor = game.actors.get(rollData.actorId)
      actor.subHeroPoints(1)
      rollData.reroll = false // Disable reroll option for second roll
      let r = new BoLDefaultRoll(rollData)
      r.addOne();
    });

    html.on("click", '.damage-handling', event => {
      event.preventDefault()
      let attackId = event.currentTarget.attributes['data-attack-id'].value
      let defenseMode = event.currentTarget.attributes['data-defense-mode'].value
      let weaponId = (event.currentTarget.attributes['data-weapon-id']) ? event.currentTarget.attributes['data-weapon-id'].value : -1

      // Remove message for all
      let msgId = BoLUtility.findChatMessageId(event.currentTarget)
      if (game.user.isGM) {
        BoLUtility.processDamageHandling(attackId, defenseMode, weaponId, msgId)
      } else {
        game.socket.emit("system.hi-fvtt", { name: "msg_damage_handling", data: { msgId: msgId, attackId: attackId, defenseMode: defenseMode, weaponId: weaponId } })
      }
    })

    html.on("click", '.recup-vitalite', event => {
      event.preventDefault()
      let actorId = event.currentTarget.attributes['data-actor-id'].value
      let recupHP = event.currentTarget.attributes['data-recup-hp'].value
      let actor = game.actors.get(actorId)

      let messageId = BoLUtility.findChatMessageId(event.currentTarget)
      BoLUtility.removeChatMessageId(messageId)

      actor.applyRecuperation(recupHP)
    })

  }

  /* -------------------------------------------- */
  static async processDamageHandling(attackId, defenseMode, weaponId = -1, msgId) {
    if (!game.user.isGM) {
      return
    }
    let message = game.messages.get(msgId)
    let rollData = message.getFlag("world", "bol-roll-data")
    BoLUtility.removeChatMessageId(msgId)

    console.log("Damage Handling", attackId, defenseMode, weaponId)
    // Only GM process this 
    if (rollData && rollData.defenderId) {
      if (rollData.defenseDone) {
        return
      } // ?? Why ???
      rollData.defenseDone = true
      rollData.defenseMode = defenseMode
      let token = game.scenes.current.tokens.get(rollData.targetId)
      let defender = token.actor

      if (defenseMode == 'damage-with-armor') {
        let armorFormula = defender.getArmorFormula()
        rollData.rollArmor = new Roll(armorFormula)
        rollData.rollArmor.roll({ async: false })
        rollData.armorProtect = (rollData.rollArmor.total < 0) ? 0 : rollData.rollArmor.total
        rollData.finalDamage = rollData.damageTotal - rollData.armorProtect
        rollData.finalDamage = (rollData.finalDamage < 0) ? 0 : rollData.finalDamage
        defender.sufferDamage(rollData.finalDamage)
        console.log("Armor roll -> result ", rollData)
      }
      if (defenseMode == 'damage-without-armor') {
        rollData.finalDamage = atrollDatatackDef.damageTotal
        defender.sufferDamage(rollData.finalDamage)
      }
      if (defenseMode == 'hero-reduce-damage') {
        let armorFormula = defender.getArmorFormula()
        rollData.rollArmor = new Roll(armorFormula)
        rollData.rollArmor.roll({ async: false })
        rollData.armorProtect = (rollData.rollArmor.total < 0) ? 0 : rollData.rollArmor.total
        rollData.rollHero = new Roll("1d6")
        rollData.rollHero.roll({ async: false })
        rollData.finalDamage = rollData.damageTotal - rollData.rollHero.total - rollData.armorProtect
        rollData.finalDamage = (rollData.finalDamage < 0) ? 0 : rollData.finalDamage
        defender.sufferDamage(rollData.finalDamage)
        defender.subHeroPoints(1)
      }
      if (defenseMode == 'hero-in-extremis') {
        rollData.finalDamage = 0;
        rollData.weaponHero = defender.weapons.find(item => item._id == weaponId);
        defender.deleteEmbeddedDocuments("Item", [weaponId]);
      }

      let defenderUser
      for (let user of game.users) {
        if (user.character && user.character.id == defender.id) {
          defenderUser = user
        }
      }
      let damageResults = {
        attackId: rollData.id,
        attacker: rollData.attacker,
        rollArmor: rollData.rollArmor,
        rollHero: rollData.rollHero,
        weaponHero: rollData.weaponHero,
        armorProtect: rollData.armorProtect,
        name: defender.name,
        defender: defender,
        defenseMode: rollData.defenseMode,
        finalDamage: rollData.finalDamage
      }
      ChatMessage.create({
        alias: defender.name,
        whisper: BoLUtility.getWhisperRecipientsAndGMs(defender.name),
        content: await renderTemplate('systems/hi-fvtt/templates/chat/rolls/defense-result-card.hbs', damageResults)
      })
      console.log("Defender data : ", defenderUser)
      ChatMessage.create({
        alias: defender.name,
        whisper: BoLUtility.getOtherWhisperRecipients(defenderUser?.name),
        content: await renderTemplate('systems/hi-fvtt/templates/chat/rolls/defense-summary-card.hbs', damageResults)
      })
    }
  }

  /* -------------------------------------------- */
  static createChatMessage(name, rollMode, chatOptions) {
    switch (rollMode) {
      case "blindroll": // GM only
        if (!game.user.isGM) {
          this.blindMessageToGM(chatOptions);

          chatOptions.whisper = [game.user.id];
          chatOptions.content = "Message only to the GM";
        }
        else {
          chatOptions.whisper = this.getUsers(user => user.isGM);
        }
        break;
      default:
        chatOptions.whisper = this.getWhisperRecipients(rollMode, name);
        break;
    }
    chatOptions.alias = chatOptions.alias || name;
    ChatMessage.create(chatOptions);
  }

  /* -------------------------------------------- */
  static createChatWithRollMode(name, chatOptions) {
    this.createChatMessage(name, game.settings.get("core", "rollMode"), chatOptions);
  }
  /* -------------------------------------------- */
  static isRangedWeapon(weapon) {
    return weapon.data.type == 'ranged' || weapon.data.thrown;
  }

  /* -------------------------------------------- */
  static removeChatMessageId(messageId) {
    if (messageId) {
      game.messages.get(messageId)?.delete();
    }
  }

  static findChatMessageId(current) {
    return BoLUtility.getChatMessageId(BoLUtility.findChatMessage(current));
  }

  static getChatMessageId(node) {
    return node?.attributes.getNamedItem('data-message-id')?.value;
  }

  static findChatMessage(current) {
    return BoLUtility.findNodeMatching(current, it => it.classList.contains('chat-message') && it.attributes.getNamedItem('data-message-id'));
  }

  static findNodeMatching(current, predicate) {
    if (current) {
      if (predicate(current)) {
        return current;
      }
      return BoLUtility.findNodeMatching(current.parentElement, predicate);
    }
    return undefined;
  }

  /* -------------------------------------------- */
  static getTarget() {
    if (game.user.targets && game.user.targets.size == 1) {
      for (let target of game.user.targets) {
        return target
      }
    }
    return undefined;
  }

  /* -------------------------------------------- */
  static async processAttackSuccess(rollData) {
    console.log("Attack success processing", rollData)
    if (!game.user.isGM || !rollData.defenderId) { // Only GM process this
      return
    }
    // Build and send the defense message to the relevant people (ie GM + defender)
    let defender = game.actors.get(rollData.defenderId)
    let defenderWeapons = defender.weapons || []
    let msg = await ChatMessage.create({
      alias: defender.name,
      whisper: BoLUtility.getWhisperRecipientsAndGMs(defender.name),
      content: await renderTemplate('systems/hi-fvtt/templates/chat/rolls/defense-request-card.hbs', {
        attackId: rollData.id,
        attacker: rollData.attacker,
        defender: defender,
        defenderWeapons: defenderWeapons,
        damageTotal: rollData.damageTotal,
        damagesIgnoresArmor: rollData.damagesIgnoresArmor,
      })
    })
    msg.setFlag("world", "bol-roll-data", rollData)
    console.log("DEF WEP", rollData, defender)
  }

  /* -------------------------------------------- */
  static onSocketMessage(sockmsg) {
    if (sockmsg.name == "msg_attack_success") {
      BoLUtility.processAttackSuccess(sockmsg.data)
    }
    if (sockmsg.name == "msg_cleanup_buttons") {
      $(`#${sockmsg.data.id}`).hide() // Hide the options roll buttons
    }
    if (sockmsg.name == "msg_damage_handling") {
      BoLUtility.processDamageHandling(sockmsg.data.attackId, sockmsg.data.defenseMode, sockmsg.data.weaponId, sockmsg.data.msgId)
    }
  }

  /* -------------------------------------------- */
  static computeSpellCost(spell, nbOptCond = 0) {
    let pp = spell.data.properties.ppcost
    let minpp = __circle2minpp[spell.data.properties.circle]
    pp = (pp - nbOptCond < minpp) ? minpp : pp - nbOptCond
    return pp
  }

  /* -------------------------------------------- */
  static getDamageFormula(weaponData, fightOption) {
    let upgradeDamage = (fightOption && fightOption.data.properties.fightoptiontype == "twoweaponsatt")
    let damageString = weaponData.properties.damage
    let modifier = weaponData.properties.damageModifiers ?? 0
    let multiplier = weaponData.properties.damageMultiplier ?? 1

    if (damageString[0] == 'd') { damageString = "1" + damageString } // Help parsing
    if (modifier == null) modifier = 0;

    let reroll = (weaponData.properties.damageReroll1) ? "r1" : "" // Reroll 1 option

    let formula = damageString
    if (damageString.includes("d") || damageString.includes("D")) {
      var myReg = new RegExp('(\\d+)[dD]([\\d]+)([MB]*)?([\\+\\d]*)?', 'g')
      let res = myReg.exec(damageString)
      let nbDice = parseInt(res[1])
      let postForm = 'kh' + nbDice
      let modIndex = 3
      // Upgrade damage if needed
      if (upgradeDamage && (!res[3] || res[3] == "")) {
        res[3] = "B"  // Upgrade to bonus
      }
      if (res[3]) {
        if (upgradeDamage && res[3] == 'M') {
          res[3] = "" // Disable lamlus for upgradeDamage
        }
        if (res[3] == 'M') {
          postForm = 'kl' + nbDice
          nbDice++
          modIndex = 4
        }
        if (res[3] == 'MM') {
          postForm = 'kl' + nbDice
          nbDice += 2
          modIndex = 4
        }
        if (res[3] == 'B') {
          postForm = 'kh' + nbDice
          nbDice++
          modIndex = 4
        }
        if (res[3] == 'BB') {
          postForm = 'kh' + nbDice
          nbDice += 2
          modIndex = 4
        }
      }
      formula = "(" + nbDice + "d" + res[2] + reroll + postForm + "+" + modifier + ") *" + multiplier
    }
    return formula
  }

  /* -------------------------------------------- */
  static async loadCompendiumData(compendium) {
    const pack = game.packs.get(compendium);
    return await pack?.getDocuments() ?? [];
  }

  /* -------------------------------------------- */
  static async loadCompendium(compendium, filter = item => true) {
    let compendiumData = await this.loadCompendiumData(compendium);
    return compendiumData.filter(filter);
  }

  /* -------------------------------------------- */
  static async searchItem(dataItem) {
    let item
    if (dataItem.pack) {
      let id = dataItem.id || dataItem._id
      let items = await this.loadCompendium(dataItem.pack, item => item.id == id)
      item = items[0] || undefined
    } else {
      item = game.items.get(dataItem.id)
    }
    return item
  }

  /* -------------------------------------------- */
  static updateSheets() {
    // Then force opened actor refresh if needed
    for (let actor of game.actors) {
      if (actor.sheet.rendered) {
        actor.sheet.render()
      }
    }
    game.hi.charSummary.updatePCSummary() // Refresh if needed
  }

  /* -------------------------------------------- */
  static removeGroupHoroscope(rollData) {
    let horo = rollData.horoscopeGroupList[rollData.selectedGroupHoroscopeIndex]
    let horoscopes = duplicate(game.settings.get("bol", "horoscope-group"))
    let toChange = duplicate(horoscopes[horo.id])
    toChange.availableDice -= horo.nbDice // Remove the dice
    if (toChange.availableDice <= 0) {
      horoscopes[horo.id] = undefined
    } else {
      horoscopes[horo.id] = toChange
    }
    game.settings.set("bol", "horoscope-group", horoscopes)
    this.updateSheets()
  }
}
