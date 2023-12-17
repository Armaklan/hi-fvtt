/*
Init order = 
  10 - Legendary
  9 - Heroic
  8 - Success
  7 - Rivals/adversary
  6 - Coriaces/tough
  5 - Failure
  4 - Pietaille
  3 - Echec critique
*/



export class BoLCombatManager extends Combat {

  /************************************************************************************/
  async rollInitiative(ids, formula = undefined, messageOptions = {}) {
    console.log(`${game.system.title} | Combat.rollInitiative()`, ids, formula, messageOptions);
    // Structure input data
    ids = typeof ids === "string" ? [ids] : ids;
    //const currentId = this.combatant.id;

    // calculate initiative
    for (let cId = 0; cId < ids.length; cId++) {
      const combatant = this.combatants.get(ids[cId])
      const bonusInitiative = combatant.actor.data.data.attributes.savvy.value;

      const r = new Roll("1d6")
      await r.roll({ "async": false })

      let fvttInit = r.total + bonusInitiative;
      await this.updateEmbeddedDocuments("Combatant", [{ _id: ids[cId], initiative: fvttInit }]);
    }
  }

  /************************************************************************************/
  nextRound() {
    let combatants = this.combatants.contents
    for (let c of combatants) {
      let actor = game.actors.get(c.actorId)
      actor.clearRoundModifiers()
    }
    super.nextRound()
  }

  /************************************************************************************/
  startCombat() {
    let combatants = this.combatants.contents
    for (let c of combatants) {
      let actor = game.actors.get(c.actorId)
      actor.storeVitaliteCombat()
    }
    return super.startCombat()
  }

  /************************************************************************************/
  _onDelete() {
    let combatants = this.combatants.contents
    for (let c of combatants) {
      let actor = game.actors.get(c.actorId)
      actor.clearInitiative()
      actor.displayRecuperation()
    }
    super._onDelete()
  }

}

