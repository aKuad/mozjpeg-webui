/**
 * Get all file objects from a FileSystemEntry object.
 *
 * @async
 * @param {FileSystemFileEntry | FileSystemDirectoryEntry} entry File system entry to get all file objects
 * @returns {Promise<Array<File>>} File objects (with full path) array
 *
 * @throws {Error} Not enough arguments
 * @throws {Error} `entry` type must be `FileSystemFileEntry` or `FileSystemDirectoryEntry`
 *
 * @author aKuad
 */
async function files_from_entry(entry) {
  // Check is argument specified
  if(entry === undefined) {
    throw new Error("At least 1 argument must be specified, but only 0 passed.");
  }

  // Check input is FileEntry or DirectoryEntry object
  if(!is_file_or_directory_entry(entry))
  {
    throw new Error("Argument is not a FileSystemFileEntry or FileSystemDirectoryEntry object.");
  }

  if(entry.isDirectory) {
    // DirectoryEntry -> Directory/FileEntries (child entries)
    let reader = entry.createReader();
    let child_entries = await new Promise(resolve => {
      reader.readEntries(entries => { resolve(entries); });
    });
    // Child entries -> File objects
    let files = [];
    for(const child_entry of child_entries) {
      files.push(...await files_from_entry(child_entry));
    }
    return files;

  } else {
    // FileEntry -> File object
    let file = await new Promise(resolve => {
      entry.file(f => { resolve(f); });
    });
    return [file_obj_rename(file, entry.fullPath)];
  }
}


/**
 * Change name field in file object
 *
 * @param {File} file File object to rename
 * @param {string} name New name of file
 * @returns {File} Renamed file object
 */
function file_obj_rename(file, name) {
  return new File([file], name, {type: file.type, lastModified: file.lastModified});
}


/**
 * Return is input object FileSystem file/directory Entry
 *
 * @param {*} obj Object to check
 * @returns {boolean} When file/directory entry: true, other cases: false
 */
function is_file_or_directory_entry(obj) {
  // Check is object and not null
  if((typeof(obj) !== "object") || (obj === null)) {
    return false;
  }

  // Check is toString method available
  if(typeof(obj.toString) !== "function") {
    return false;
  }

  // Check is in true cases
  let true_cases = ["[object DirectoryEntry]", "[object FileEntry]",
                    "[object FileSystemDirectoryEntry]", "[object FileSystemFileEntry]"];
  let obj_string = obj.toString();
  return true_cases.includes(obj_string);
}
