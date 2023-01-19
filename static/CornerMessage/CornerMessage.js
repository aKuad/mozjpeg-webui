/**
 * View short message in right-bottom corner
 *
 * `CornerMessage.css` requires to link as stylesheet
 *
 * @author aKuad
 */
class CornerMessage {
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
   * @throws {Error} Non string `mes`
   * @throws {Error} Empty string `mes`
   * @throws {Error} Incorrect argument `style`
   */
  static async view(mes, style = CornerMessage.style.info) {
    // Check is message string
    if(typeof(mes) !== "string") {
      throw new Error("Incorrect argument type, 'mes' must be string.");
    }

    // Check is message not empty
    if(mes === "") {
      throw new Error("Empty string message.");
    }

    // Check is correct style specified
    if(!CornerMessage.#style_values.includes(style)) {
      throw new Error("Unknown style specified.");
    }

    // If previous message viewing, close
    if(document.querySelector("#CornerMessage-container")) {
      await CornerMessage.close();
    }

    let container = document.createElement("div");
    container.id = "CornerMessage-container";
    container.classList.add(style);
    container.classList.add("CornerMessage-container-hide");

    let mesbox = document.createElement("div");
    mesbox.id = "CornerMessage-mesbox";
    mesbox.innerText = mes;
    container.appendChild(mesbox);

    let cross = document.createElement("div");
    cross.id = "CornerMessage-cross";
    cross.addEventListener("click", () => CornerMessage.close() );
    container.appendChild(cross);

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
    let container = document.querySelector("#CornerMessage-container");
    container.classList.add("CornerMessage-container-hide");
    container.classList.remove("CornerMessage-container-view");
    await new Promise(r => setTimeout(r, 200));   // Wait for the message hide
    container.remove();
  }
}
