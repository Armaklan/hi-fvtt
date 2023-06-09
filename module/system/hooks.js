import { BoLUtility } from "./bol-utility.js";

export default function registerHooks() {

    /**
     * Ready hook loads tables, and override's foundry's entity link functions to provide extension to pseudo entities
     */

    Hooks.once("ready", async () => {
        console.info("BOL | System Initialized.");
    });

    Hooks.on("renderPause", ((_app, html) => {
        html.find("img").attr("src", "systems/hi-fvtt/ui/pause2.webp")
    }))

    Hooks.on('renderChatLog', (log, html, data) => BoLUtility.chatListeners(html))
    Hooks.on('renderChatMessage', (message, html, data) => BoLUtility.chatMessageHandler(message, html, data))

    /**
     * Create a macro when dropping an entity on the hotbar
     * Item      - open roll dialog for item
     * Actor     - open actor sheet
     * Journal   - open journal sheet
     */
    Hooks.on("hotbarDrop", async (bar, data, slot) => {
        console.log(data.type);
        // Create item macro if rollable item - weapon, spell, prayer, trait, or skill
        if (data.type == "Item") {
            let item = data.data;
            console.log(item);
            // let command = `let onlyDamage = false;\nlet customLabel = "";\nlet skillDescription = "";\nlet dmgDescription = "";\n\nif (event) {\n  if (event.shiftKey) onlyDamage = true;\n}\n\ngame.cof.macros.rollItemMacro("${item._id}", "${item.name}", "${item.type}", 0, 0, 0, onlyDamage, customLabel, skillDescription, dmgDescription);`;

            // let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
            // if (!macro) {
            //     macro = await Macro.create({
            //         name: item.name,
            //         type : "script",
            //         img: item.img,
            //         command : command
            //     }, {displaySheet: false})
            // }
            // game.user.assignHotbarMacro(macro, slot);
        }
        // Create a macro to open the actor sheet of the actor dropped on the hotbar
        else if (data.type == "Actor") {
            let actor = game.actors.get(data.id);
            let command = `/*\nPersonnalisez la macro selon vos besoins en suivant les exemples suivants : \ngame.hi.macros.rollMacro('attribute', 'might|daring|savvy|flair', adv, mod);\ngame.hi.macros.rollMacro('aptitude', 'init|melee|ranged|def', adv, mod);\n*/\ngame.hi.macros.rollMacro('attribute', 'might', 0, 0);`;
            let macro = game.macros.entities.find(m => (m.name === actor.name) && (m.command === command));
            if (!macro) {
                macro = await Macro.create({
                    name: actor.data.name,
                    type: "script",
                    img: "icons/svg/dice-target.svg",
                    command: command
                }, { displaySheet: false })
                game.user.assignHotbarMacro(macro, slot);
            }
        }
        // Create a macro to open the journal sheet of the journal dropped on the hotbar
        else if (data.type == "JournalEntry") {
            let journal = game.journal.get(data.id);
            console.log(journal);
            let command = `game.journal.get("${data.id}").sheet.render(true)`
            let macro = game.macros.entities.find(m => (m.name === journal.name) && (m.command === command));
            if (!macro) {
                macro = await Macro.create({
                    name: journal.data.name,
                    type: "script",
                    img: (journal.data.img) ? journal.data.img : "icons/svg/book.svg",
                    command: command
                }, { displaySheet: false })
                game.user.assignHotbarMacro(macro, slot);
            }
        }
        return false;
    });

    /********************************************************************************** */
    Hooks.on("renderActorDirectory", (app, html, data) => {
        if (game.user.isGM) {
            const button = document.createElement('button');
            button.style.width = '95%';
            button.innerHTML = game.i18n.localize("HI.ui.pclistbutton")
            button.addEventListener('click', () => {
                game.hi.charSummary.render(true)
            })
            html.find('.header-actions').after(button)
        }
    })

}
