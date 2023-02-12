/**
 * Get files from an `input.file` element, through `webkitEntries` or `files`
 *
 * @author aKuad
 */
class InputFileReader {
  /**
   * Get files from an `input.file` element
   *
   * @async
   * @param {HTMLInputElement} elem `input.file` element to read files
   * @returns {Array<File>} Loaded file objects
   *
   * @throws {TypeError} No arguments specified.
   * @throws {TypeError} Argument is non input element.
   */
  static async read(elem) {
    // Is argument specified
    if(elem === undefined) {
      throw new TypeError("No arguments specified.");
    }

    // Is argument input element
    if(!InputFileReader.#is_input_element(elem)) {
      throw new TypeError("Argument is non input element.");
    }

    // When webkitEntries available
    if(elem.webkitEntries.length > 0) {
      const files = [];
      for(const entry of elem.webkitEntries) {
        files.push(...await InputFileReader.#files_from_entry(entry));
      }
      return files;
    }

    // When unavailable
    return Array.from(elem.files);
  }


  /**
   * Get all file objects from a FileSystemEntry object.
   *
   * @async
   * @param {FileSystemFileEntry | FileSystemDirectoryEntry} entry File system entry to get all file objects
   * @returns {Promise<Array<File>>} Loaded file objects (with full path)
   */
  static async #files_from_entry(entry) {
    if(entry.isDirectory) {
      // DirectoryEntry -> Directory/FileEntries (child entries)
      const child_entries = await new Promise(resolve => {
        entry.createReader().readEntries(entries => { resolve(entries); });
      });
      // Child entries -> File objects
      const files = [];
      for(const child_entry of child_entries) {
        files.push(...await InputFileReader.#files_from_entry(child_entry));
      }
      return files;

    } else {
      // FileEntry -> File object
      const file = await new Promise(resolve => {
        entry.file(f => { resolve(f); });
      });
      const file_name = entry.fullPath.replace(/^\//, "");  // Remove '/', means root directory
      return [InputFileReader.#file_obj_rename(file, file_name)];
    }
  }


  /**
   * Change name field in file object
   *
   * @param {File} file File object to rename
   * @param {string} new_name New name of file
   * @returns {File} Renamed file object
   */
  static #file_obj_rename(file, new_name) {
    // Re-creating file object, because name field is read-only
    return new File([file], new_name, {type: file.type, lastModified: file.lastModified});
  }


  /**
   * Check is specified object input element
   *
   * @param {*} obj Object to check
   * @returns {boolean} obj is input element: true, other cases: false
   */
  static #is_input_element(obj) {
    // Is non-object or null
    if(typeof obj !== "object") { return false; }
    if(       obj === null    ) { return false; }

    // Is input element
    if(obj.webkitEntries === undefined) { return false; }
    if(obj.files         === undefined) { return false; }

    return true;
  }
}
