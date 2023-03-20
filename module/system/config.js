export const System = {};

System.label = "Barbarians of Lemuria";
System.name = "bol";
System.rootPath = "/systems/" + System.name;
System.dataPath = System.rootPath + "/data";
System.templatesPath = System.rootPath + "/templates";
System.debugMode = true;

export const BOL = {};

BOL.damageValues = {
    "1": "1",
    "2": "2",
    "3": "3",
    "d3" : "d3",
    "d6M" : "d6M (Malus)",
    "d6" : "d6",
    "d6B" : "d6B (Bonus)",
    "d6BB" : "d6B + dé bonus",
}

BOL.damageMultiplier = {
  "1": "x1",
  "2": "x2",
  "3": "x3",
  "4": "x4",
  "5": "x5",
  "6": "x6",
  "7": "7",
  "8": "x8"
}

BOL.spellType = {
  "0": "BOL.spellItem.charm",
  "1": "BOL.spellItem.circle1",
  "2": "BOL.spellItem.circle2",
  "3": "BOL.spellItem.circle3"
}

BOL.alchemyType = {
  "common": "BOL.alchemyItem.common",
  "scarce": "BOL.alchemyItem.scarce",
  "legend": "BOL.alchemyItem.legend",
  "mythic": "BOL.alchemyItem.mythic",
}

BOL.equipmentSlots = {
    "none" : "BOL.equipmentSlots.none",
    "head" : "BOL.equipmentSlots.head",
    "neck" : "BOL.equipmentSlots.neck",
    "shoulders" : "BOL.equipmentSlots.shoulders",
    "body" : "BOL.equipmentSlots.body",
    "rhand" : "BOL.equipmentSlots.rhand",
    "lhand" : "BOL.equipmentSlots.lhand",
    "2hands" : "BOL.equipmentSlots.2hands",
    "rarm" : "BOL.equipmentSlots.rarm",
    "larm" : "BOL.equipmentSlots.larm",
    "chest" : "BOL.equipmentSlots.chest",
    "belt" : "BOL.equipmentSlots.belt",
    "legs" : "BOL.equipmentSlots.legs",
    "feet" : "BOL.equipmentSlots.feet",
    "finder" : "BOL.equipmentSlots.finder",
    "ear" : "BOL.equipmentSlots.ear"
}

BOL.armorQualities = {
    "none" : "BOL.armorQuality.none",
    "light" : "BOL.armorQuality.light",
    "lightQ" : "BOL.armorQuality.lightQ",
    "lightSup" : "BOL.armorQuality.lightSup",
    "lightLeg" : "BOL.armorQuality.lightLeg",
    "medium" : "BOL.armorQuality.medium",
    "mediumQ" : "BOL.armorQuality.mediumQ",
    "mediumSup" : "BOL.armorQuality.mediumSup",
    "mediumLeg" : "BOL.armorQuality.mediumLeg",
    "heavy" : "BOL.armorQuality.heavy",
    "heavyQ" : "BOL.armorQuality.heavyQ",
    "heavySup" : "BOL.armorQuality.heavySup",
    "heavyLeg" : "BOL.armorQuality.heavyLeg"
}

BOL.soakFormulas = {
    "none" : "0",
    "light" : "1d6-3",
    "lightQ" : "1d6r1-3",
    "lightSup" : "1d6-2",
    "lightLeg" : "2d6kh1-2",
    "medium" : "1d6-2",
    "mediumQ" : "1d6r1-2",
    "mediumSup" : "1d6-1",
    "mediumLeg" : "2d6kh1-1",
    "heavy" : "1d6-1",
    "heavyQ" : "1d6r1-1",
    "heavySup" : "1d6",
    "heavyLeg" : "2d6kh1"
}

BOL.attackAttributes = {
    "vigor" : "BOL.attributes.vigor",
    "agility" : "BOL.attributes.agility",
    "mind" : "BOL.attributes.mind",
    "appeal" : "BOL.attributes.appeal"
}

BOL.attackAptitudes = {
    "melee" : "BOL.aptitudes.melee",
    "ranged" : "BOL.aptitudes.ranged"
}

BOL.aptitudes = {
    "melee" : "BOL.aptitudes.melee",
    "ranged" : "BOL.aptitudes.ranged",
    "init" : "BOL.aptitudes.init",
    "def" : "BOL.aptitudes.def"
}

BOL.resources = {
  "hp" : "BOL.resources.hp",
  "hero" : "BOL.resources.hero",
  "faith" : "BOL.resources.faith",
  "power" : "BOL.resources.power",
  "alchemypoints" : "BOL.resources.alchemypoints"
}

BOL.weaponSizes = {
    "unarmed" : "BOL.weaponSize.unarmed",
    "improvised" : "BOL.weaponSize.improvised",
    "light" : "BOL.weaponSize.light",
    "medium" : "BOL.weaponSize.medium",
    "heavy" : "BOL.weaponSize.heavy"
}

BOL.damageAttributes = {
    "zero" : "0",
    "vigor" : "BOL.attributes.vigor",
    "half-vigor" : "BOL.attributes.halfvigor"
}

BOL.itemCategories = {
    "equipment" : "BOL.itemCategory.equipment",
    "capacity" : "BOL.itemCategory.capacity",
    "spell" : "BOL.itemCategory.spell",
    "alchemy" : "BOL.itemCategory.alchemy",
    "vehicle" : "BOL.itemCategory.vehicle",
    "vehicleweapon": "BOL.itemCategory.vehicleweapon",
    "other" : "BOL.itemCategory.other"
}

BOL.itemSubtypes = {
    "armor" : "BOL.equipmentCategory.armor",
    "weapon" : "BOL.equipmentCategory.weapon",
    "shield" : "BOL.equipmentCategory.shield",
    "helm" : "BOL.equipmentCategory.helm",
    "jewel" : "BOL.equipmentCategory.jewel",
    "scroll" : "BOL.equipmentCategory.scroll",
    "container" : "BOL.equipmentCategory.container",
    "ammunition" : "BOL.equipmentCategory.ammunition",
    "currency" : "BOL.equipmentCategory.currency",
    "other" : "BOL.equipmentCategory.other"
}

BOL.vehicleSubtypes = {
    "mount" : "BOL.vehicleCategory.mount",
    "flying" : "BOL.vehicleCategory.flying",
    "boat" : "BOL.vehicleCategory.boat",
    "other" : "BOL.vehicleCategory.other"
}

// BOL.equipmentCategories = {
//     "armor" : "BOL.equipmentCategory.armor",
//     "weapon" : "BOL.equipmentCategory.weapon",
//     "shield" : "BOL.equipmentCategory.shield",
//     "helm" : "BOL.equipmentCategory.helm",
//     "jewel" : "BOL.equipmentCategory.jewel",
//     "scroll" : "BOL.equipmentCategory.scroll",
//     "container" : "BOL.equipmentCategory.container",
//     "ammunition" : "BOL.equipmentCategory.ammunition",
//     "currency" : "BOL.equipmentCategory.currency",
//     "other" : "BOL.equipmentCategory.other"
// }

BOL.protectionCategories = {
    "armor" : "BOL.protectionCategory.armor",
    "shield" : "BOL.protectionCategory.shield",
    "helm" : "BOL.protectionCategory.helm",
    "other" : "BOL.protectionCategory.other"
}

BOL.weaponCategories = {
    "melee" : "BOL.weaponCategory.melee",
    "ranged" : "BOL.weaponCategory.ranged",
    "other" : "BOL.weaponCategory.other"
}

BOL.itemProperties1 = {
    "equipable" : "BOL.itemProperty.equipable",
    "protection" : "BOL.itemProperty.protection",
    "magical" : "BOL.itemProperty.magical",
    "worn" : "BOL.itemProperty.worn",
}

BOL.itemProperties2 = {
    "equipable" : "BOL.itemProperty.equipable",
    "protection" : "BOL.itemProperty.protection",
    "blocking" : "BOL.itemProperty.blocking",
    "magical" : "BOL.itemProperty.magical",
    "concealable" : "BOL.itemProperty.concealable",
    "2H" : "BOL.itemProperty.2H",
    "helm" : "BOL.itemProperty.helm",
    "improvised" : "BOL.itemProperty.improvised",
    "shield" : "BOL.itemProperty.shield",
    "melee" : "BOL.itemProperty.melee",
    "throwable" : "BOL.itemProperty.throwable",
    "ignoreshield" : "BOL.itemProperty.ignoreshield",
    "bashing" : "BOL.itemProperty.bashing",
    "stackable" : "BOL.itemProperty.stackable",
    "ranged" : "BOL.itemProperty.ranged",
    "weapon" : "BOL.itemProperty.weapon",
    "reloadable" : "BOL.itemProperty.reloadable",
    "worn" : "BOL.itemProperty.worn",
    "spell" : "BOL.itemProperty.spell",
    "armor" : "BOL.itemProperty.armor",
    "consumable" : "BOL.itemProperty.consumable",
    "bow" : "BOL.itemProperty.bow",
    "crossbow" : "BOL.itemProperty.crossbow",
    "throwing" : "BOL.itemProperty.throwing",
    "activable" : "BOL.itemProperty.activable",
    "powder" : "BOL.itemProperty.powder",
    "damage" : "BOL.itemProperty.damage",
    "difficulty": "BOL.itemProperty.difficulty"
}

BOL.itemStats = {
    "quantity" : "BOL.itemStat.quantity",
    "weight" : "BOL.itemStat.weight",
    "price" : "BOL.itemStat.price",
    "range" : "BOL.itemStat.range",
    "damage" : "BOL.itemStat.damage",
    "reload" : "BOL.itemStat.reload",
    "soak" : "BOL.itemStat.soak",
    "blocking" : "BOL.itemStat.blocking",
    "modifiers" : "BOL.itemStat.modifiers"
}

BOL.itemModifiers = {
    "init" : "BOL.itemModifiers.init",
    "social" : "BOL.itemModifiers.social",
    "agility" : "BOL.itemModifiers.agility",
    "powercost" : "BOL.itemModifiers.powercost"
}

BOL.itemBlocking = {
    "malus" : "BOL.itemBlocking.malus",
    "nbAttacksPerRound" : "BOL.itemBlocking.nbAttacksPerRound"
}

BOL.itemSoak = {
    "formula" : "BOL.itemSoak.formula",
    "value" : "BOL.itemSoak.value"
}

BOL.featureSubtypes = {
    "origin" : "BOL.featureSubtypes.origin",
    "race" : "BOL.featureSubtypes.race",
    "career" : "BOL.featureSubtypes.career",
    "boon" : "BOL.featureSubtypes.boon",
    "flaw" : "BOL.featureSubtypes.flaw",
    "language" : "BOL.featureSubtypes.language",
    "godsfaith" : "BOL.featureSubtypes.gods",
    "fightoption" : "BOL.featureSubtypes.fightOption",
    "boleffect": "BOL.featureSubtypes.effect",
    "horoscope": "BOL.featureSubtypes.horoscope",
}

BOL.fightOptionTypes = {
  "armordefault": "BOL.fightOptionTypes.armor",
  "intrepid": "BOL.fightOptionTypes.intrepid",
  "twoweaponsdef": "BOL.fightOptionTypes.twoweaponsdef",
  "twoweaponsatt": "BOL.fightOptionTypes.twoweaponsatt",
  "fulldefense": "BOL.fightOptionTypes.fulldefense",
  "defense": "BOL.fightOptionTypes.defense",
  "attack": "BOL.fightOptionTypes.attack",
}

BOL.itemIcons = {
    "item": "icons/containers/chest/chest-worn-oak-tan.webp",
    "capacity": "icons/sundries/scrolls/scroll-plain-tan-red.webp",
    "species": "icons/environment/people/group.webp",
    "profile": "icons/sundries/documents/blueprint-axe.webp",
    "path": "icons/sundries/books/book-embossed-gold-red.webp"
}

BOL.actorIcons = {
    "npc": "icons/environment/people/commoner.webp",
    "encounter": "icons/svg/mystery-man-black.svg",
    "loot": "icons/containers/bags/sack-simple-leather-brown.webp"
}

BOL.bougetteState = {
  "0": "BOL.bougette.nomoney",
  "1": "BOL.bougette.tolive",
  "2": "BOL.bougette.easylife",
  "3": "BOL.bougette.luxury",
  "4": "BOL.bougette.rich"
}
BOL.bougetteDice = {
  "0": "0",
  "1": "2d6-1",
  "2": "2d6",
  "3": "2d6+1",
  "4": "2d6+2"
}

BOL.creatureSize = {
  "tiny": {order: 1, label: "BOL.size.tiny"},
  "verysmall": {order: 2, label: "BOL.size.verysmall"},
  "small": {order: 3, label: "BOL.size.small"},
  "medium": {order: 4, label: "BOL.size.medium"},
  "large": {order: 5, label: "BOL.size.large"},
  "verylarge": {order: 6, label: "BOL.size.verylarge"},
  "huge": {order: 7, label: "BOL.size.huge"},
  "massive": {order: 8, label: "BOL.size.massive"},
  "enormous": {order: 9, label: "BOL.size.enormous"},
  "gigantic": {order: 10, label: "BOL.size.gigantic"},
  "immense": {order: 11, label: "BOL.size.immense"},
  "colossal": {order: 12, label: "BOL.size.colossal"}
}

BOL.horoscopeAnswer = {
  "favorable": "BOL.ui.horoscopefavorable",
  "unfavorable": "BOL.ui.horoscopeunfavorable",
}

BOL.bolEffectModifier = {
  "-8": "-8",
  "-6": "-6",
  "-4": "-4",
  "-2": "-2",
  "-1": "-1",
  "1B": "1B",
  "2B": "2B",
  "1M": "1M",
  "2M": "2M",
  "+1": "+1",
  "+2": "+2",
  "+4": "+4",
  "+6": "+6",
  "+8": "+8",
}

BOL.statusEffects = [
  {
      "id": "dead",
      "label": "EFFECT.StatusDead",
      "icon": "icons/svg/skull.svg"
  },
  {
      "id": "unconscious",
      "label": "EFFECT.StatusUnconscious",
      "icon": "icons/svg/unconscious.svg"
  },
  {
      "id": "sleep",
      "label": "EFFECT.StatusAsleep",
      "icon": "icons/svg/sleep.svg"
  },
  {
      "id": "stun",
      "label": "EFFECT.StatusStunned",
      "icon": "icons/svg/daze.svg"
  },
  {
      "id": "prone",
      "label": "EFFECT.StatusProne",
      "icon": "icons/svg/falling.svg"
  },
  {
      "id": "restrain",
      "label": "EFFECT.StatusRestrained",
      "icon": "icons/svg/net.svg"
  },
  {
      "id": "paralysis",
      "label": "EFFECT.StatusParalysis",
      "icon": "icons/svg/paralysis.svg"
  },
  {
      "id": "fly",
      "label": "EFFECT.StatusFlying",
      "icon": "icons/svg/wing.svg"
  },
  {
      "id": "blind",
      "label": "EFFECT.StatusBlind",
      "icon": "icons/svg/blind.svg"
  },
  {
      "id": "deaf",
      "label": "EFFECT.StatusDeaf",
      "icon": "icons/svg/deaf.svg"
  },
  {
      "id": "silence",
      "label": "EFFECT.StatusSilenced",
      "icon": "icons/svg/silenced.svg"
  },
  {
      "id": "fear",
      "label": "EFFECT.StatusFear",
      "icon": "icons/svg/terror.svg"
  },
  {
      "id": "burning",
      "label": "EFFECT.StatusBurning",
      "icon": "icons/svg/fire.svg"
  },
  {
      "id": "frozen",
      "label": "EFFECT.StatusFrozen",
      "icon": "icons/svg/frozen.svg"
  },
  {
      "id": "shock",
      "label": "EFFECT.StatusShocked",
      "icon": "icons/svg/lightning.svg"
  },
  {
      "id": "disease",
      "label": "EFFECT.StatusDisease",
      "icon": "icons/svg/biohazard.svg"
  },
  {
      "id": "poison",
      "label": "EFFECT.StatusPoison",
      "icon": "icons/svg/poison.svg"
  },
  {
      "id": "curse",
      "label": "EFFECT.StatusCursed",
      "icon": "icons/svg/sun.svg"
  },
  {
      "id": "invisible",
      "label": "EFFECT.StatusInvisible",
      "icon": "icons/svg/invisible.svg"
  },
  {
      "id": "target",
      "label": "EFFECT.StatusTarget",
      "icon": "icons/svg/target.svg"
  },
  {
      "id": "eye",
      "label": "EFFECT.StatusMarked",
      "icon": "icons/svg/eye.svg"
  }
]

BOL.debug = false;