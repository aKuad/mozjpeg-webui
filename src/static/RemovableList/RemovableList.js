/**
 * User removable list, which can contain custom objects with index text
 *
 * `RemovableList.css` requires to link as stylesheet, BEFORE INSTANTIATE `RemovableList` CLASS
 *
 * @author aKuad
 */
class RemovableList {
  /** @type {HTMLElement} */
  #list_container;

  /** @type {CSSStyleRule} */
  #cross_class;

  /** @callback onremove_callback */
  #onremove_callback;


  /**
   * @constructor
   * @param {HTMLElement} list_container A HTML element to view list
   * @param {onremove_callback} onremove_callback Will call when remove button clicked
   *
   * @throws {TypeError} No arguments
   * @throws {TypeError} Non HTMLElement `list_container`
   * @throws {TypeError} Non function `onremove_callback`
   */
  constructor(list_container, onremove_callback = null) {
    // Arguments type checking
    if(list_container === undefined) {
      throw new TypeError("No arguments.");
    }
    if(!(list_container instanceof HTMLElement)) {
      const list_container_type = list_container === null ? "null" : typeof list_container === "object" ? list_container.constructor.name : typeof list_container;
      throw new TypeError(`Argument 'list_container' must be a HTMLElement, not ${list_container_type}.`);
    }
    if(onremove_callback !== null && typeof onremove_callback !== "function") {
      const onremove_callback_type = typeof onremove_callback === "object" ? onremove_callback.constructor.name : typeof onremove_callback;
      throw new TypeError(`Argument 'onremove_callback' must be a function, not ${onremove_callback_type}.`);
    }

    // Arguments store to member variables
    this.#list_container = list_container;
    this.#list_container.classList.add("RemovableList-container");
    this.#onremove_callback = onremove_callback;

    // Get .RemovableList-cross css class object
    this.#cross_class = null;
    for(const sheet of document.styleSheets) {
      for(const rule of sheet.cssRules) {
        if(rule.selectorText == ".RemovableList-cross") {
          this.#cross_class = rule;
        }
      }
    }
  }


  /**
   * Try adding items to list without overwriting
   *
   * @param {...RemovableListItem} objs Item objects to append
   * @returns {Array<boolean>} Each objects were - success to add: true, failed: false
   */
  add_items_no_overwrite(...objs) {
    // Argument check
    RemovableList.#check_non_item_element(objs);

    // Process all elements
    const list_items = Array.from(this.#list_container.children);
    const add_results = objs.map(obj => this.#add_items_no_overwrite_core(list_items, obj.content, obj.index));
    this.#view_update(list_items);
    return add_results;
  }


  /**
   * Core part of `add_items_no_overwrite`
   *
   * @param {Array<HTMLDivElement>} list_items Item array to modify
   * @param {*} content Object to append in new item
   * @param {string} index Text to view in list
   * @returns {boolean} Success to add: true, failed: false
   */
  #add_items_no_overwrite_core(list_items, content, index) {
    // Check is same index not exist
    if(RemovableList.#get_index_by_text(list_items, index) !== -1) { return false; }

    // Create item element and append
    const new_item = this.#create_item_element(content, index);
    list_items.push(new_item);
    return true;
  }


  /**
   * Add items to list with resolving index text duplication
   *
   * @param {...RemovableListItem} objs Item objects to append
   */
  add_items_keep_each(...objs) {
    // Argument check
    RemovableList.#check_non_item_element(objs);

    // Process all elements
    const list_items = Array.from(this.#list_container.children);
    objs.map(obj => this.#add_items_keep_each_core(list_items, obj.content, obj.index));
    this.#view_update(list_items);
  }


  /**
   * Core part of `add_items_keep_each`
   *
   * @param {Array<HTMLDivElement>} list_items Item array to modify
   * @param {*} content Object to append in new item
   * @param {string} index Text to view in list
   */
  #add_items_keep_each_core(list_items, content, index) {
    const index_split = index.split(".");
    const index_ext = index_split.length === 1 ? "" : "." + index_split.pop();
    const index_body = index_split.join(".");

    let suffix = "";
    let suffix_num = 0;
    while(true) {
      if(this.#add_items_no_overwrite_core(list_items, content, index_body + suffix + index_ext)) { return; }
      suffix_num++;
      suffix = "_" + suffix_num.toString();
    }
  }


  /**
   * Add items with overwriting when index was duplicated
   *
   * @param {...RemovableListItem} objs Item objects to append
   */
  add_items_overwrite(...objs) {
    // Argument check
    RemovableList.#check_non_item_element(objs);

    // Process all elements
    const list_items = Array.from(this.#list_container.children);
    objs.map(obj => this.#add_items_overwrite_core(list_items, obj.content, obj.index));
    this.#view_update(list_items);
  }


  /**
   * Core part of `add_items_overwrite`
   *
   * @param {Array<HTMLDivElement>} list_items Item array to modify
   * @param {*} content Object to append in new item
   * @param {string} index Text to view in list
   */
  #add_items_overwrite_core(list_items, content, index) {
    // Try to add without overwriting
    if(this.#add_items_no_overwrite_core(list_items, content, index)) { return; }

    // Get index and overwrite content
    const write_index = RemovableList.#get_index_by_text(list_items, index);
    list_items[write_index].content = content;
  }


  /**
   * Hide item remove button
   */
  remove_lock() {
    this.#cross_class.style.display = "none";
  }


  /**
   * Re display item remove button
   */
  remove_unlock() {
    this.#cross_class.style.display = "";
  }


  /**
   * Export all items appended in list
   *
   * @returns {Array<RemovableListItem>}
   */
  export_items_all() {
    return Array.from(this.#list_container.children, e => new RemovableListItem(e.innerText, e.content));
  }


  /**
   * Get items count in list
   *
   * @returns {number} Count of items in list
   */
  count_items() {
    return this.#list_container.childElementCount;
  }


  /**
   * Remove all items from DOM
   */
  remove_items_all() {
    // Replace to empty, means all child elements remove
    this.#list_container.replaceChildren();
  }


  /**
   * Sort items and update DOM
   *
   * @param {Array<HTMLDivElement>} items Item array to append
   */
  #view_update(items) {
    const items_sort = Array.from(items);
    items_sort.sort((a, b) => {
      if(a.innerText < b.innerText) { return -1; }
      if(a.innerText > b.innerText) { return 1; }
      return 0;
    });
    this.#list_container.replaceChildren(...items_sort);
  }


  /**
   * Search index from item array
   *
   * @param {Array<HTMLDivElement>} list_items Item array to modify
   * @param {string} search_text String to search from list
   * @returns {number} Index number or -1 as not found
   */
  static #get_index_by_text(list_items, search_text) {
    const list_texts = Array.from(list_items, e => e.innerText);
    return list_texts.indexOf(search_text);
  }


  /**
   * Create a div element for list item
   *
   * @param {*} content Object to append
   * @param {string} index Text to view in list
   * @returns {HTMLDivElement} Created element object
   */
  #create_item_element(content, index) {
    // Create base element
    const ele = document.createElement("div");
    ele.classList.add("RemovableList-item");
    ele.content = content;
    ele.innerText = index;

    // Create and append removing button
    const ele_cross = document.createElement("div");
    ele_cross.classList.add("RemovableList-cross");
    ele_cross.addEventListener("click", e => {
      e.target.parentNode.remove();
    });
    if(this.#onremove_callback !== null) {
      ele_cross.addEventListener("click", this.#onremove_callback);
    }
    ele.appendChild(ele_cross);

    return ele;
  }


  /**
   * Detect non RemovableListItem object types from an array
   *
   * @param {Array<*>} objs Array object to check
   *
   * @throws {TypeError} Non RemovableListItem detected
   */
  static #check_non_item_element(objs) {
    const objs_invalid = objs.filter(e => e instanceof RemovableListItem === false);
    if(objs_invalid.length === 0) { return; }

    let objs_invalid_types = objs_invalid.map(e => {
      if(e === null)            { return "null"; }
      if(typeof e === "object") { return e.constructor.name; }
      return typeof e;
    });
    // 'new Set()' for remove duplicates
    objs_invalid_types = Array.from(new Set(objs_invalid_types));

    throw new TypeError(`Arguments must be RemovableListItem, detected ${objs_invalid_types.join(", ")}.`);
  }
}


/**
 * Item object, which can append to list
 *
 * @property {string} index String to view in list
 * @property {*} content A custom object to append
 */
class RemovableListItem {
  constructor(index, content) {
    // Arguments type checking ('content' allowed everything, including undefined)
    if(index === undefined) {
      throw new TypeError("No arguments.");
    }
    if(typeof index !== "string") {
      const index_type = index === null ? "null" : typeof index === "object" ? index.constructor.name : typeof index;
      throw new TypeError(`Argument 'index' must be a string, not ${index_type}.`);
    }
    if(index === "") {
      throw new RangeError("'index' can't be an empty string.");
    }

    // Store
    this.index = index;
    this.content = content;
  }
}
