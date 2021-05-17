class Attributes {
  /**
   * @typedef {object} AttrOptions
   * @property {import("./database").DBObj} enactor The enactor obhect responsible for the set
   * @property {import("./database").DBObj} target The target of the set, who's attribute will be set.
   * @property {string} attribute The name of the attribute to be set.
   * @property {any} value The value of the attribute.
   *
   */

  /**
   * Set an attribute on an entity.  Does not check player permissions.  This needs to be done manually.
   * @param {AttrOptions} options The various settings needed tor setting a new attribute.
   * @return {import("./database").DBObj}
   */
  async set(options) {
    const { enactor, target, attribute, value, data = {} } = options;
    if (!target.attrs) target.attrs = [];
    target.attrs[attribute] = { value: value, setby: enactor._id };
    return target;
  }

  /**
   *  Get an attribute value from a character
   * @param {import("./database").DBObj} tar
   * @param {string} attr
   * @returns {any}
   */
  get(tar, attr) {
    if (tar.attrs[attr]) return tar.attrs[attr].value;
  }
}

module.exports = Attributes;
