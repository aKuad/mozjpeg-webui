/**
 * Get all file objects from a FileSystemEntry object.
 *
 * @async
 * @param {FileSystemFileEntry | FileSystemDirectoryEntry}entry File system entry to get all file objects
 * @returns {Promise<Array<FileWithFullpath>>} File objects (with full path) array
 *
 * @author aKuad
 */
async function files_from_entry(entry) {
  // Check input is FileEntry or DirectoryEntry object
  if(typeof(blob) !== "object" ||
     blob === null ||
     typeof(blob.toString) !== "function" ||
     (blob.toString() !== "[object DirectoryEntry]" &&
      blob.toString() !== "[object FileEntry]" &&
      blob.toString() !== "[object FileSystemDirectoryEntry]" &&
      blob.toString() !== "[object FileSystemFileEntry]"))
  {
    throw new Error("Other than Blob or File object can't export.");
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
      files = files.concat(await files_from_entry(child_entry));
    }
    return files;
  } else {
    // FileEntry -> File object
    let file = await new Promise(resolve => {
      entry.file(f => { resolve(f); });
    });
    return [new FileWithFullpath(file, entry.fullPath)];
  }
}


class FileWithFullpath {
  /**
   * File containing object to keep full path
   *
   * @param {File} file 
   * @param {string} fullpath 
   */
  constructor(file, fullpath) {
    this.file = file;
    this.fullpath = fullpath;
  }

  toString() {
    return this.fullpath;
  }
}
