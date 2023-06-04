/**
 * @file View message and custom buttons in center of page
 *
 * (`CustomDialog.css` requires to link as stylesheet)
 *
 * @author aKuad
 */

/**
 * View message and custom buttons in center of page
 * (`CustomDialog.css` requires to link as stylesheet)
 */
class CustomDialog {
  /**
   * @param {string} message Dialog message (Non string object will be converted)
   * @param  {...string} buttons_text Dialog buttons text (Non string objects will be converted)
   * @returns {Promise<string>} Object to detect clicked button text
   *
   * @throws {TypeError} No arguments
   * @throws {RangeError} Empty string `message`
   */
  static view(message, ...buttons_text) {
    return new Promise(resolve => {
      // Argument check
      if(message === undefined) {
        throw new TypeError("No arguments.");
      }
      if(String(message) === "") {
        throw new RangeError("'message' can't be an empty string.");
      }

      // Parameter adjustment
      const buttons_text_adj = [];
      if(buttons_text.length === 0) {
        buttons_text_adj.push("OK");
      } else {
        buttons_text.map(text => buttons_text_adj.push(text));
      }

      // Elements setup
      const dialog_back = document.createElement("div");
      dialog_back.id = "CustomDialog-back";
      const dialog = document.createElement("div");
      dialog.id = "CustomDialog-dialog";

      function onclick_call(button_text) {
        resolve(button_text);
        CustomDialog.#fadeout_from_body(dialog_back);
      }

      dialog.appendChild(CustomDialog.#create_field_message(String(message)));
      dialog.appendChild(CustomDialog.#create_field_buttons(onclick_call, buttons_text_adj));
      dialog_back.appendChild(dialog);

      // Display dialog
      CustomDialog.#fadein_to_body(dialog_back);

      // Set focus to last button
      //// Get button elements -> convert to Array (for pop()) -> get last element -> set focus
      Array.from(dialog.querySelectorAll(".CustomDialog-button")).pop().focus();
    });
  }


  /**
   * @param {string} message Message to display in dialog
   */
  static #create_field_message(message) {
    const field = document.createElement("div");
    field.id = "CustomDialog-field-message";
    field.innerText = message;
    return field;
  }


  /**
   * @param {function} onclick_call Call when button clicked, will be passed button text
   * @param {Array<string>} buttons_text Texts to view in button (Non string objects will be converted)
   */
  static #create_field_buttons(onclick_call, buttons_text) {
    const field = document.createElement("div");
    field.id = "CustomDialog-field-buttons";

    buttons_text.forEach(text => {
      const button = document.createElement("button");
      button.classList.add("CustomDialog-button");
      button.innerText = String(text);
      button.addEventListener("click", () => onclick_call(text));
      field.appendChild(button);
    });

    return field;
  }


  /**
   * @param {HTMLElement} elem Element to fade-in
   */
  static async #fadein_to_body(elem) {
    document.body.appendChild(elem);
    await new Promise(r => setTimeout(r, 50));  // strangely, it makes stable viewing
    elem.classList.add("CustomDialog-disp");
  }


  /**
   * @param {HTMLElement} elem Element to fade-out
   */
  static async #fadeout_from_body(elem) {
    elem.classList.remove("CustomDialog-disp");
    await new Promise(r => setTimeout(r, 250));
    elem.remove();
  }
}
