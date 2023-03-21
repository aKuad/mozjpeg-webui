/**
 * Detecting files drop on custom HTML element
 *
 * @author aKuad
 */
class FilesDropField {
  /**
   * Attach the script to a HTML element
   *
   * @param {HTMLElement} attach_field A HTML element to attach script
   * @param {HTMLElement | null} ondrag_view A HTML element to display on dragover
   * @returns {HTMLInputElement} A HTML element for detecting files input
   */
  static attach(attach_field, ondrag_view = null) {
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
    attach_field.classList.add("FilesDropField-base");
    const detector = document.createElement("input");
    const attachment = FilesDropField.#create_attachment(detector, ondrag_view);

    // Viewing event
    async function disp_field() {
      attach_field.appendChild(attachment);
      await new Promise(r => setTimeout(r, 50));  // strangely, it makes stable viewing
      attachment.classList.remove("FilesDropField-attachment-hide");
      await new Promise(r => setTimeout(r, 100));
    }
    attach_field.addEventListener("dragenter", disp_field);

    // Hiding events
    async function hide_field() {
      attachment.classList.add("FilesDropField-attachment-hide");
      await new Promise(r => setTimeout(r, 150));
      attachment.remove();
    }
    detector.addEventListener("dragleave", hide_field);
    detector.addEventListener("drop", hide_field);

    // Return input element for detecting files
    return detector;
  }


  /**
   * Create a HTML element to attach
   *
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

    detector.type = "file";
    detector.multiple = true;
    detector.classList.add("FilesDropField-detector");
    attachment.appendChild(detector);

    return attachment;
  }
}
