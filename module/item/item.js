/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class BoLItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData()

    const actorData = this.actor ? this.actor.system : {}
  }

  /* -------------------------------------------- */
  get properties() {
    return this.system.properties
  }

  /* -------------------------------------------- */
  /**
   * Get the Array of item properties which are used in the small sidebar of the description tab
   * @return {Array}
   * @private
   */
  get itemProperties() {
    const props = [];
    if ( this.type === "item" ) {
      const entries = Object.entries(this.system.properties)
      props.push(...entries.filter(e => e[1] === true).map(e => { return game.bol.config.itemProperties2[e[0]] }))
    }
    return props.filter(p => !!p)
  }


}
