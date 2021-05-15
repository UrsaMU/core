class Attributes {
  /**
   * Set an attribute on an entity.
   * @param {import("./database").DBObj} en The enactor
   * @param {import("./database").DBObj} tar The target
   * @param {string} attr The attribute to add/modify
   * @param {any} val The value to set the attribute to.
   * @return {import("./database").DBObj}
   */
  set(en, tar, attr, val) {
    if (!tar.attrs) tar.attrs = [];
    tar.attrs[attr] = { value: val, setby: en._id };
    return tar;
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
