export const System = {};

System.label = "Barbarians of Lemuria";
System.name = "bol";
System.rootPath = "/systems/" + System.name;
System.dataPath = System.rootPath + "/data";
System.templatesPath = System.rootPath + "/templates";
System.debugMode = true;

export const BOL = {};

HI.damageValues = {
    "1": "1",
    "2": "2",
    "3": "3",
    "d3": "d3",
    "d6M": "d6M (Malus)",
    "d6": "d6",
    "d6B": "d6B (Bonus)",
    "d6BB": "d6B + dé bonus",
}

HI.damageMultiplier = {
    "1": "x1",
    "2": "x2",
    "3": "x3",
    "4": "x4",
    "5": "x5",
    "6": "x6",
    "7": "7",
    "8": "x8"
}

HI.spellType = {
    "0": "HI.spellItem.charm",
    "1": "HI.spellItem.circle1",
    "2": "HI.spellItem.circle2",
    "3": "HI.spellItem.circle3"
}

HI.alchemyType = {
    "common": "HI.alchemyItem.common",
    "scarce": "HI.alchemyItem.scarce",
    "legend": "HI.alchemyItem.legend",
    "mythic": "HI.alchemyItem.mythic",
}

HI.equipmentSlots = {
    "none": "HI.equipmentSlots.none",
    "head": "HI.equipmentSlots.head",
    "neck": "HI.equipmentSlots.neck",
    "shoulders": "HI.equipmentSlots.shoulders",
    "body": "HI.equipmentSlots.body",
    "rhand": "HI.equipmentSlots.rhand",
    "lhand": "HI.equipmentSlots.lhand",
    "2hands": "HI.equipmentSlots.2hands",
    "rarm": "HI.equipmentSlots.rarm",
    "larm": "HI.equipmentSlots.larm",
    "chest": "HI.equipmentSlots.chest",
    "belt": "HI.equipmentSlots.belt",
    "legs": "HI.equipmentSlots.legs",
    "feet": "HI.equipmentSlots.feet",
    "finder": "HI.equipmentSlots.finder",
    "ear": "HI.equipmentSlots.ear"
}

HI.armorQualities = {
    "none": "HI.armorQuality.none",
    "light": "HI.armorQuality.light",
    "lightQ": "HI.armorQuality.lightQ",
    "lightSup": "HI.armorQuality.lightSup",
    "lightLeg": "HI.armorQuality.lightLeg",
    "medium": "HI.armorQuality.medium",
    "mediumQ": "HI.armorQuality.mediumQ",
    "mediumSup": "HI.armorQuality.mediumSup",
    "mediumLeg": "HI.armorQuality.mediumLeg",
    "heavy": "HI.armorQuality.heavy",
    "heavyQ": "HI.armorQuality.heavyQ",
    "heavySup": "HI.armorQuality.heavySup",
    "heavyLeg": "HI.armorQuality.heavyLeg"
}

HI.soakFormulas = {
    "none": "0",
    "light": "1d6-3",
    "lightQ": "1d6r1-3",
    "lightSup": "1d6-2",
    "lightLeg": "2d6kh1-2",
    "medium": "1d6-2",
    "mediumQ": "1d6r1-2",
    "mediumSup": "1d6-1",
    "mediumLeg": "2d6kh1-1",
    "heavy": "1d6-1",
    "heavyQ": "1d6r1-1",
    "heavySup": "1d6",
    "heavyLeg": "2d6kh1"
}

HI.attackAttributes = {
    "might": "HI.attributes.might",
    "daring": "HI.attributes.daring",
    "savvy": "HI.attributes.savvy",
    "flair": "HI.attributes.flair"
}

HI.attackAptitudes = {
    "melee": "HI.aptitudes.melee",
    "ranged": "HI.aptitudes.ranged"
}

HI.aptitudes = {
    "melee": "HI.aptitudes.melee",
    "ranged": "HI.aptitudes.ranged",
    "brawl": "HI.aptitudes.brawl",
    "def": "HI.aptitudes.def"
}

HI.resources = {
    "hp": "HI.resources.hp",
    "hero": "HI.resources.hero",
    "composure": "HI.resources.composure",
    "power": "HI.resources.power",
    "alchemypoints": "HI.resources.alchemypoints"
}

HI.weaponSizes = {
    "unarmed": "HI.weaponSize.unarmed",
    "improvised": "HI.weaponSize.improvised",
    "light": "HI.weaponSize.light",
    "medium": "HI.weaponSize.medium",
    "heavy": "HI.weaponSize.heavy"
}

HI.damageAttributes = {
    "zero": "0",
    "might": "HI.attributes.might",
    "half-might": "HI.attributes.halfmight"
}

HI.itemCategories = {
    "equipment": "HI.itemCategory.equipment",
    "capacity": "HI.itemCategory.capacity",
    "spell": "HI.itemCategory.spell",
    "alchemy": "HI.itemCategory.alchemy",
    "vehicle": "HI.itemCategory.vehicle",
    "vehicleweapon": "HI.itemCategory.vehicleweapon",
    "other": "HI.itemCategory.other"
}

HI.itemSubtypes = {
    "armor": "HI.equipmentCategory.armor",
    "weapon": "HI.equipmentCategory.weapon",
    "shield": "HI.equipmentCategory.shield",
    "helm": "HI.equipmentCategory.helm",
    "jewel": "HI.equipmentCategory.jewel",
    "scroll": "HI.equipmentCategory.scroll",
    "container": "HI.equipmentCategory.container",
    "ammunition": "HI.equipmentCategory.ammunition",
    "currency": "HI.equipmentCategory.currency",
    "other": "HI.equipmentCategory.other"
}

HI.vehicleSubtypes = {
    "mount": "HI.vehicleCategory.mount",
    "flying": "HI.vehicleCategory.flying",
    "boat": "HI.vehicleCategory.boat",
    "other": "HI.vehicleCategory.other"
}

// HI.equipmentCategories = {
//     "armor" : "HI.equipmentCategory.armor",
//     "weapon" : "HI.equipmentCategory.weapon",
//     "shield" : "HI.equipmentCategory.shield",
//     "helm" : "HI.equipmentCategory.helm",
//     "jewel" : "HI.equipmentCategory.jewel",
//     "scroll" : "HI.equipmentCategory.scroll",
//     "container" : "HI.equipmentCategory.container",
//     "ammunition" : "HI.equipmentCategory.ammunition",
//     "currency" : "HI.equipmentCategory.currency",
//     "other" : "HI.equipmentCategory.other"
// }

HI.protectionCategories = {
    "armor": "HI.protectionCategory.armor",
    "shield": "HI.protectionCategory.shield",
    "helm": "HI.protectionCategory.helm",
    "other": "HI.protectionCategory.other"
}

HI.weaponCategories = {
    "melee": "HI.weaponCategory.melee",
    "ranged": "HI.weaponCategory.ranged",
    "other": "HI.weaponCategory.other"
}

HI.itemProperties1 = {
    "equipable": "HI.itemProperty.equipable",
    "protection": "HI.itemProperty.protection",
    "magical": "HI.itemProperty.magical",
    "worn": "HI.itemProperty.worn",
}

HI.itemProperties2 = {
    "equipable": "HI.itemProperty.equipable",
    "protection": "HI.itemProperty.protection",
    "blocking": "HI.itemProperty.blocking",
    "magical": "HI.itemProperty.magical",
    "concealable": "HI.itemProperty.concealable",
    "2H": "HI.itemProperty.2H",
    "helm": "HI.itemProperty.helm",
    "improvised": "HI.itemProperty.improvised",
    "shield": "HI.itemProperty.shield",
    "melee": "HI.itemProperty.melee",
    "throwable": "HI.itemProperty.throwable",
    "ignoreshield": "HI.itemProperty.ignoreshield",
    "bashing": "HI.itemProperty.bashing",
    "stackable": "HI.itemProperty.stackable",
    "ranged": "HI.itemProperty.ranged",
    "weapon": "HI.itemProperty.weapon",
    "reloadable": "HI.itemProperty.reloadable",
    "worn": "HI.itemProperty.worn",
    "spell": "HI.itemProperty.spell",
    "armor": "HI.itemProperty.armor",
    "consumable": "HI.itemProperty.consumable",
    "bow": "HI.itemProperty.bow",
    "crossbow": "HI.itemProperty.crossbow",
    "throwing": "HI.itemProperty.throwing",
    "activable": "HI.itemProperty.activable",
    "powder": "HI.itemProperty.powder",
    "damage": "HI.itemProperty.damage",
    "difficulty": "HI.itemProperty.difficulty"
}

HI.itemStats = {
    "quantity": "HI.itemStat.quantity",
    "weight": "HI.itemStat.weight",
    "price": "HI.itemStat.price",
    "range": "HI.itemStat.range",
    "damage": "HI.itemStat.damage",
    "reload": "HI.itemStat.reload",
    "soak": "HI.itemStat.soak",
    "blocking": "HI.itemStat.blocking",
    "modifiers": "HI.itemStat.modifiers"
}

HI.itemModifiers = {
    "init": "HI.itemModifiers.init",
    "social": "HI.itemModifiers.social",
    "daring": "HI.itemModifiers.daring",
    "powercost": "HI.itemModifiers.powercost"
}

HI.itemBlocking = {
    "malus": "HI.itemBlocking.malus",
    "nbAttacksPerRound": "HI.itemBlocking.nbAttacksPerRound"
}

HI.itemSoak = {
    "formula": "HI.itemSoak.formula",
    "value": "HI.itemSoak.value"
}

HI.featureSubtypes = {
    "origin": "HI.featureSubtypes.origin",
    "race": "HI.featureSubtypes.race",
    "career": "HI.featureSubtypes.career",
    "boon": "HI.featureSubtypes.boon",
    "flaw": "HI.featureSubtypes.flaw",
    "language": "HI.featureSubtypes.language",
    "godsfaith": "HI.featureSubtypes.gods",
    "fightoption": "HI.featureSubtypes.fightOption",
    "boleffect": "HI.featureSubtypes.effect",
    "horoscope": "HI.featureSubtypes.horoscope",
}

HI.fightOptionTypes = {
    "armordefault": "HI.fightOptionTypes.armor",
    "intrepid": "HI.fightOptionTypes.intrepid",
    "twoweaponsdef": "HI.fightOptionTypes.twoweaponsdef",
    "twoweaponsatt": "HI.fightOptionTypes.twoweaponsatt",
    "fulldefense": "HI.fightOptionTypes.fulldefense",
    "defense": "HI.fightOptionTypes.defense",
    "attack": "HI.fightOptionTypes.attack",
}

HI.itemIcons = {
    "item": "icons/containers/chest/chest-worn-oak-tan.webp",
    "capacity": "icons/sundries/scrolls/scroll-plain-tan-red.webp",
    "species": "icons/environment/people/group.webp",
    "profile": "icons/sundries/documents/blueprint-axe.webp",
    "path": "icons/sundries/books/book-embossed-gold-red.webp"
}

HI.actorIcons = {
    "npc": "icons/environment/people/commoner.webp",
    "encounter": "icons/svg/mystery-man-black.svg",
    "loot": "icons/containers/bags/sack-simple-leather-brown.webp"
}

HI.bougetteState = {
    "0": "HI.bougette.nomoney",
    "1": "HI.bougette.tolive",
    "2": "HI.bougette.easylife",
    "3": "HI.bougette.luxury",
    "4": "HI.bougette.rich"
}
HI.bougetteDice = {
    "0": "0",
    "1": "2d6-1",
    "2": "2d6",
    "3": "2d6+1",
    "4": "2d6+2"
}

HI.creatureSize = {
    "tiny": { order: 1, label: "HI.size.tiny" },
    "verysmall": { order: 2, label: "HI.size.verysmall" },
    "small": { order: 3, label: "HI.size.small" },
    "medium": { order: 4, label: "HI.size.medium" },
    "large": { order: 5, label: "HI.size.large" },
    "verylarge": { order: 6, label: "HI.size.verylarge" },
    "huge": { order: 7, label: "HI.size.huge" },
    "massive": { order: 8, label: "HI.size.massive" },
    "enormous": { order: 9, label: "HI.size.enormous" },
    "gigantic": { order: 10, label: "HI.size.gigantic" },
    "immense": { order: 11, label: "HI.size.immense" },
    "colossal": { order: 12, label: "HI.size.colossal" }
}

HI.horoscopeAnswer = {
    "favorable": "HI.ui.horoscopefavorable",
    "unfavorable": "HI.ui.horoscopeunfavorable",
}

HI.bolEffectModifier = {
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

HI.statusEffects = [
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

HI.debug = false;