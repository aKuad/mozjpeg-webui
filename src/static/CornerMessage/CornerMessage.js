/**
 * View short message in right-bottom corner
 *
 * `CornerMessage.css` requires to link as stylesheet
 *
 * @author aKuad
 */
class CornerMessage {
  // type unspecified, because of code suggesting
  static style = Object.freeze({
    info:   "CornerMessage-style-info",
    warn:   "CornerMessage-style-warn",
    danger: "CornerMessage-style-danger"
  });

  /** @type {Array<string>} */
  static #style_values = Object.values(CornerMessage.style);


  /**
   * View message box with any message and style
   *
   * @async
   * @param {string} mes String to view
   * @param {string} style Message box color `info (Blue)`, `warn (Yellow)`, `danger (Red)`
   *
   * @throws {TypeError} No arguments
   * @throws {TypeError} Non string `mes`
   * @throws {RangeError} Empty string `mes`
   * @throws {RangeError} Incorrect argument `style`
   */
  static async view(mes, style = CornerMessage.style.info) {
    // Arguments checki
    if(mes === undefined) {
      throw new TypeError("No arguments.")
    }
    if(typeof(mes) !== "string") {
      const mes_type = mes === null ? "null" : typeof mes === "object" ? mes.constructor.name : typeof mes;
      throw new TypeError(`Argument 'mes' must be a string, not ${mes_type}.`);
    }
    if(mes === "") {
      throw new RangeError("'mes' can't be an empty string.");
    }
    if(!CornerMessage.#style_values.includes(style)) {
      // Is correct style specified
      throw new RangeError("Unknown style specified.");
    }

    // If previous message viewing, close
    if(document.querySelector("#CornerMessage-container")) {
      await CornerMessage.close();
    }

    // Create element
    const container = document.createElement("div");
    container.id = "CornerMessage-container";
    container.classList.add(style);
    container.classList.add("CornerMessage-container-hide");

    const mesbox = document.createElement("div");
    mesbox.id = "CornerMessage-mesbox";
    mesbox.innerText = mes;
    container.appendChild(mesbox);

    const cross = document.createElement("div");
    cross.id = "CornerMessage-cross";
    cross.addEventListener("click", () => CornerMessage.close() );
    container.appendChild(cross);

    // View element
    document.body.appendChild(container);
    await new Promise(r => setTimeout(r, 50));  // strangely, it makes stable viewing
    container.classList.add("CornerMessage-container-view");
    container.classList.remove("CornerMessage-container-hide");
  }


  /**
   * Close message box
   *
   * @async
   */
  static async close() {
    const container = document.querySelector("#CornerMessage-container");
    container.classList.add("CornerMessage-container-hide");
    container.classList.remove("CornerMessage-container-view");
    await new Promise(r => setTimeout(r, 200));   // Wait for the message hide
    container.remove();
  }
}
