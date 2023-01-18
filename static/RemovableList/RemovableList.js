/**
 * User removable list, which can contain custom objects with index text
 *
 * `RemovableList.css` requires to link as stylesheet
 *
 * @property {HTMLElement} list_container A HTML element to view list
 *
 * @author aKuad
 */
 class RemovableList {
  /** @type {HTMLElement} */
  #list_container;

  /** @type {CSSStyleRule} */
  #cross_class;


  /**
   * @constructor
   * @param list_container A HTML element to view list
   */
  constructor(list_container) {
    this.#list_container = list_container;
    this.#list_container.classList.add("RemovableList-container");

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
   * @param {Array<Object>} objs Custom object and index text contained objects to append
   * @property {*}      objs.content Object to append in new item
   * @property {string} objs.index Text to view in list
   * @returns {Array<boolean>} Each objects were - success to add: true, failed: false
   */
  add_items_no_overwrite(objs) {
    // Check is argument correct
    RemovableList.#check_appendable_object_error(objs);

    // Process all elements
    let list_items = Array.from(this.#list_container.children);
    let add_results = objs.map(obj => RemovableList.#add_items_no_overwrite_core(list_items, obj.content, obj.index));
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
  static #add_items_no_overwrite_core(list_items, content, index) {
    // Check is same index not exist
    if(RemovableList.#get_index_by_text(list_items, index) !== -1) { return false; }

    // Create item element and append
    let new_item = RemovableList.#create_item_element(content, index);
    list_items.push(new_item);
    return true;
  }


  /**
   * Add items to list with resolving index text duplication
   *
   * @param {Array<Object>} objs Custom object and index text contained objects to append
   * @property {*}      objs.content Object to append in new item
   * @property {string} objs.index Text to view in list
   */
  add_items_keep_each(objs) {
    // Check is argument correct
    RemovableList.#check_appendable_object_error(objs);

    // Process all elements
    let list_items = Array.from(this.#list_container.children);
    objs.map(obj => RemovableList.#add_items_keep_each_core(list_items, obj.content, obj.index));
    this.#view_update(list_items);
  }


  /**
   * Core part of `add_items_keep_each`
   *
   * @param {Array<HTMLDivElement>} list_items Item array to modify
   * @param {*} content Object to append in new item
   * @param {string} index Text to view in list
   */
  static #add_items_keep_each_core(list_items, content, index) {
    let suffix = "";
    let suffix_num = 0;
    while(true) {
      if(RemovableList.#add_items_no_overwrite_core(list_items, content, index + suffix)) { return; }
      suffix_num++;
      suffix = "_" + suffix_num.toString();
    }
  }


  /**
   * Add items with overwriting when index was duplicated
   *
   * @param {Array<Object>} objs Custom object and index text contained objects to append
   * @property {*}      objs.content Object to append in new item
   * @property {string} objs.index Text to view in list
   */
  add_items_overwrite(objs) {
    // Check is argument correct
    RemovableList.#check_appendable_object_error(objs);

    // Process all elements
    let list_items = Array.from(this.#list_container.children);
    objs.map(obj => RemovableList.#add_items_overwrite_core(list_items, obj.content, obj.index));
    this.#view_update(list_items);
  }


  /**
   * Core part of `add_items_overwrite`
   *
   * @param {Array<HTMLDivElement>} list_items Item array to modify
   * @param {*} content Object to append in new item
   * @param {string} index Text to view in list
   */
  static #add_items_overwrite_core(list_items, content, index) {
    // Try to add without overwriting
    if(RemovableList.#add_items_no_overwrite_core(list_items, content, index)) { return; }

    // Get index and overwrite content
    let write_index = RemovableList.#get_index_by_text(list_items, index);
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
   * @returns {Array<Object>}
   * @property {*}      Array[].content Appended object in item
   * @property {string} Array[].index Text viewing in list
   */
  export_items_all() {
    let items = Array.from(this.#list_container.children, e => {
      return {content: e.content, index: e.innerText};
    });
    return items;
  }


  /**
   * Remove all items from DOM
   */
  remove_items_all() {
    this.#list_container.replaceChildren();
  }


  /**
   * Sort items and update DOM
   *
   * @param {Array<HTMLDivElement>} items Item array to modify
   */
  #view_update(items) {
    let items_sort = Array.from(items);
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
    let list_texts = Array.from(list_items, e => e.innerText);
    return list_texts.indexOf(search_text);
  }


  /**
   * Create a div element for list item
   *
   * @param {*} content Object to append
   * @param {string} index Text to view in list
   * @returns {HTMLDivElement} Created element object
   */
  static #create_item_element(content, index) {
    // Create base element
    let ele = document.createElement("div");
    ele.classList.add("RemovableList-item");
    ele.content = content;
    ele.innerText = index;

    // Create and append removing button
    let ele_cross = document.createElement("div");
    ele_cross.classList.add("RemovableList-cross");
    ele_cross.addEventListener("click", e => {
      e.target.parentNode.remove();
    });
    ele.appendChild(ele_cross);

    return ele;
  }


  /**
   * Check array's all elements has string `index` and any object
   *
   * @param {Array<Object>} objs Array object to check
   *
   * @throws {Error} Not enough arguments
   * @throws {Error} Non array object specified as argument.
   * @throws {Error} Incorrect elements detected - null elements
   * @throws {Error} Incorrect elements detected - non string 'index'
   * @throws {Error} Incorrect elements detected - empty string 'index'
   * @throws {Error} Incorrect elements detected - undefined 'content'
   */
  static #check_appendable_object_error(objs) {
    // Is argument specified
    if(objs === undefined) {
      throw new Error("At least 1 argument must be specified, but only 0 passed.");
    }

    // Is array object
    if(objs === null || typeof(objs.map) !== "function") {
      throw new Error("Non array object specified as argument.");
    }

    if(objs.map(obj => obj === null).includes(true)) {
      throw new Error("Incorrect elements detected - null elements");
    }

    if(objs.map(obj => typeof(obj.index) !== "string").includes(true)) {
      throw new Error("Incorrect elements detected - non string or undefined 'index'");
    }

    if(objs.map(obj => obj.index === "").includes(true)) {
      throw new Error("Incorrect elements detected - empty string 'index'");
    }

    if(objs.map(obj => obj.content === undefined).includes(true)) {
      throw new Error("Incorrect elements detected - undefined 'content'");
    }
  }
}
