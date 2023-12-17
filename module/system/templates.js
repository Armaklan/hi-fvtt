/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {

    // Define template paths to load
    const templatePaths = [
        // ACTORS
        "systems/hi-fvtt/templates/actor/parts/actor-header.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-stats.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-combat.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-actions.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-features.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-equipment.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-spellalchemy.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-biodata.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/actor-horoscope-group.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/creature-stats.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/creature-actions.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/vehicle-stats.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/vehicle-description.hbs",
        "systems/hi-fvtt/templates/actor/parts/tabs/vehicle-weapons.hbs",
        // ITEMS
        "systems/hi-fvtt/templates/item/parts/item-header.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/equipment-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/capacity-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/vehicle-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/protection-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/weapon-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/spell-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/alchemy-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/magical-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/career-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/boon-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/flaw-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/effect-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/origin-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/race-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/fightoption-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/item/weapon-vehicle-properties.hbs",
        "systems/hi-fvtt/templates/item/parts/properties/feature/horoscope-properties.hbs",

        // DIALOGS
        "systems/hi-fvtt/templates/chat/rolls/attack-damage-card.hbs",
        "systems/hi-fvtt/templates/chat/rolls/spell-roll-card.hbs",
        "systems/hi-fvtt/templates/chat/rolls/alchemy-roll-card.hbs",
        "systems/hi-fvtt/templates/chat/rolls/selected-horoscope-roll-card.hbs",
        "systems/hi-fvtt/templates/chat/rolls/horoscope-roll-card.hbs",
        "systems/hi-fvtt/templates/dialogs/aptitude-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/attribute-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/mod-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/adv-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/career-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/effect-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/boons-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/flaws-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/total-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/fightoptions-roll-part.hbs",
        "systems/hi-fvtt/templates/dialogs/horoscope-roll-part.hbs"
    ];

    // Load the template parts
    return loadTemplates(templatePaths);
};
