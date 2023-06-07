/**
 * @file Detecting files drop on custom HTML element
 *
 * (`FilesDropField.css` requires to link as stylesheet)
 *
 * @author aKuad
 */

/**
 * Detecting files drop on custom HTML element
 * (`FilesDropField.css` requires to link as stylesheet)
 */
class FilesDropField {
  /**
   * Element as drag&drop field
   *
   * @type {HTMLElement}
   */
  #attach_field;

  /**
   * Element to display on `attach_field` when dragging
   *
   * @type {HTMLDivElement}
   */
  #attachment;

  /**
   * Input element on `#attachment` to detect files drop
   *
   * @type {HTMLInputElement}
   */
  #detector;


  /**
   * Attach the script to a HTML element
   *
   * @param {HTMLElement} attach_field A HTML element to attach script
   * @param {HTMLElement | null} ondrag_view A HTML element to display on dragover
   * @returns {HTMLInputElement} A HTML element for detecting files input
   *
   * @throws {TypeError} No arguments
   * @throws {TypeError} Argument `attach_field` is not `HTMLElement`
   * @throws {TypeError} Argument `ondrag_view` (optional) is not `HTMLElement`
   */
  constructor(attach_field, ondrag_view = null) {
    // Arguments check
    if(attach_field === undefined) {
      throw new TypeError("No arguments.");
    }
    if(!(attach_field instanceof HTMLElement)) {
      const actual_type = attach_field === null ? "null" : typeof attach_field === "object" ? attach_field.constructor.name : typeof attach_field;
      throw new TypeError(`Argument 'attach_field' must be a HTMLElement, not ${actual_type}.`);
    }
    if(ondrag_view !== null && !(ondrag_view instanceof HTMLElement)) {
      const actual_type = typeof ondrag_view === "object" ? ondrag_view.constructor.name : typeof ondrag_view;
      throw new TypeError(`Argument 'ondrag_view' must be a HTMLElement, not ${actual_type}.`);
    }

    // Elements setup
    this.#attach_field = attach_field;
    this.#attach_field.classList.add("FilesDropField-base");
    this.#detector = FilesDropField.#create_detector();
    this.#attachment = FilesDropField.#create_attachment(this.#detector, ondrag_view);

    // Viewing event
    this.#attach_field.addEventListener("dragenter", this.#field_disp);

    // Hiding events
    this.#detector.addEventListener("dragleave", this.#field_hide);
    this.#detector.addEventListener("drop", this.#field_hide);
  }


  /**
   * Return input element for detecting files
   *
   * @returns {HTMLInputElement} A HTML element for detecting files input
   */
  get_drop_detector() {
    return this.#detector;
  }


  /**
   * @returns {HTMLInputElement} A HTML element for detecting files input
   */
  static #create_detector() {
    const detector = document.createElement("input");
    detector.type = "file";
    detector.multiple = true;
    detector.classList.add("FilesDropField-detector");
    return detector;
  }


  /**
   * @param {HTMLInputElement} detector A HTML element for detecting files input
   * @param {HTMLElement | null} ondrag_view A HTML element to display on dragover
   * @returns {HTMLDivElement} Created attachment element
   */
  static #create_attachment(detector, ondrag_view = null) {
    const attachment = document.createElement('div');
    attachment.classList.add("FilesDropField-attachment", "FilesDropField-attachment-hide");

    if(ondrag_view !== null) {
      ondrag_view.classList.add("FilesDropField-ondragview");
      attachment.appendChild(ondrag_view);
    }
    attachment.appendChild(detector);

    return attachment;
  }


  /**
   * Field hiding process
   *
   * @listens dragenter
   */
  #field_disp = async () => {
    this.#attach_field.appendChild(this.#attachment);
    await new Promise(r => setTimeout(r, 50));  // strangely, it makes stable viewing
    this.#attachment.classList.remove("FilesDropField-attachment-hide");
  }


  /**
   * Field displaying process
   *
   * @listens dragleave
   * @listens drop
   */
  #field_hide = async () => {
    this.#attachment.classList.add("FilesDropField-attachment-hide");
    await new Promise(r => setTimeout(r, 150));
    this.#attachment.remove();
  }


  /**
   * Stop on-dragenter event
   */
  drop_lock() {
    this.#attach_field.removeEventListener("dragenter", this.#field_disp);
  }


  /**
   * Restart on-dragenter event
   */
  drop_unlock() {
    this.#attach_field.addEventListener("dragenter", this.#field_disp);
  }
}
