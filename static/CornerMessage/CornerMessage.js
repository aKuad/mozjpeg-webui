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
    this.#is_viewing = false;
    this.#style_values = Object.values(CornerMessage.style);

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
   * @param {string} mes 
   * @param {string} style 
   *
   * @throws {Error} a
   */
  async view(mes, style = CornerMessage.style.info) {
    if(!this.#style_values.includes(style)) {
      throw new Error("Unknown style specified.");
    }

    if(this.#is_viewing) {
      await this.close();
    }

    this.#mesbox.innerText = mes;

    this.#container.classList.remove(...this.#style_values);
    this.#container.classList.add(style);
    this.#container.classList.add("CornerMessage-container-view");

    this.#is_viewing = true;
  }


  /**
   * Close message box
   */
  async close() {
    this.#container.classList.remove("CornerMessage-container-view");
    await new Promise(r => setTimeout(r, 200));
    this.#is_viewing = false;
  }
}
