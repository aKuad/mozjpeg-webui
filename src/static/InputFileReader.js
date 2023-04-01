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
   * @throws {TypeError} No arguments
   * @throws {TypeError} Argument is not `HTMLInputElement`
   */
  static async read(elem) {
    // Argument check
    if(elem === undefined) {
      throw new TypeError("No arguments.");
    }
    if(!(elem instanceof HTMLInputElement)) {
      const elem_type = elem === null ? "null" : typeof elem === "object" ? elem.constructor.name : typeof elem;
      throw new TypeError(`Argument must be a HTMLInputElement, not ${elem_type}.`);
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
}
