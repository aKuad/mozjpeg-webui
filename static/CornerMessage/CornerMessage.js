/**
 * View short message in right-bottom corner
 *
 * `CornerMessage.css` requires to link as stylesheet
 *
 * @author aKuad
 */
class CornerMessage {
  /** @type {HTMLDivElement} */
  #container;

  /** @type {HTMLDivElement} */
  #mesbox;
  
  /** @type {boolean} */
  #is_viewing;

  static style = Object.freeze({
    info:   "CornerMessage-style-info",
    warn:   "CornerMessage-style-warn",
    danger: "CornerMessage-style-danger"
  });

  /** @type {Array<string>} */
  #style_values;


  /**
   * @constructor
   */
  constructor() {
    // Initialize member variables
    this.#is_viewing = false;
    this.#style_values = Object.values(CornerMessage.style);

    // Create message element
    this.#container = document.createElement("div");
    this.#container.classList.add("CornerMessage-container");

    this.#mesbox = document.createElement("div");
    this.#mesbox.classList.add("CornerMessage-mesbox");
    this.#container.appendChild(this.#mesbox);

    let cross = document.createElement("div");
    cross.classList.add("CornerMessage-cross");
    cross.addEventListener("click", () => this.close() );
    this.#container.appendChild(cross);

    document.body.appendChild(this.#container);
  }


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
  async view(mes, style = CornerMessage.style.info) {
    // Check is message string
    if(typeof(mes) !== "string") {
      throw new Error("Incorrect argument type, 'mes' must be string.");
    }

    // Check is message not empty
    if(mes === "") {
      throw new Error("Empty string message.");
    }

    // Check is correct style specified
    if(!this.#style_values.includes(style)) {
      throw new Error("Unknown style specified.");
    }

    // If previous message viewing, close
    if(this.#is_viewing) {
      await this.close();
    }

    // New message append
    this.#mesbox.innerText = mes;

    // Style append
    this.#container.classList.remove(...this.#style_values);
    this.#container.classList.add(style);
    this.#container.classList.add("CornerMessage-container-view");

    // Flag update
    this.#is_viewing = true;
  }


  /**
   * Close message box
   *
   * @async
   */
  async close() {
    this.#container.classList.remove("CornerMessage-container-view");
    await new Promise(r => setTimeout(r, 200));   // Wait for the message hide
    this.#is_viewing = false;
  }
}
