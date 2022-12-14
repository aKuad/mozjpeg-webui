/**
 * HTML input element disabling with text changing
 *
 * @property {HTMLButtonElement} target_elem Button element to disabling
 * @property {string} text_origin Original text of `target_elem`
 * @property {string} text_lock Text to view in `target_elem` until locking
 */
class ButtonLock {
  /** @type {HTMLButtonElement} */
  #target_elem;

  /** @type {string} */
  #text_origin;

  /** @type {string} */
  #text_lock;


  /**
   * @constructor
   * @param {HTMLButtonElement} target_elem Element to disabling
   * @param {string} text_lock Text to view until locking
   */
  constructor(target_elem, text_lock) {
    // Check is argument Object
    if(!ButtonLock.#is_object(target_elem)) {
      throw new Error("Incorrect argument type, `target_elem` must be object.");
    }

    // Set member variables
    this.#target_elem = target_elem;
    this.#text_origin = target_elem.value;
    this.#text_lock = text_lock;
  }


  /**
   * Make disable of button
   */
  lock() {
    this.#target_elem.disabled = true;
    this.#target_elem.value = this.#text_lock;
  }


  /**
   * Release disable of button
   */
  unlock() {
    this.#target_elem.value = this.#text_origin;
    this.#target_elem.disabled = false;
  }


  /**
   * Return is argument type Object
   *
   * @param {*} obj Object to check
   * @return {boolean} When object: true, other cases: false
   */
  static #is_object(obj) {
    return (typeof(obj) === "object") && (obj !== null);
  }
}
