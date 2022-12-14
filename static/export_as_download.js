/**
 * Export any data to user as file downloading
 *
 * @param {Blob | File} blob Data body to export
 * @param {string} name Default file name to export
 *
 * @throws {Error} Not enough arguments
 * @throws {Error} `blob` type must be `Blob` or `File`
 *
 * @author aKuad
 */
function export_as_download(blob, name = "file") {
  // Check is argument specified
  if(blob === undefined) {
    throw new Error("At least 1 argument must be specified, but only 0 passed.");
  }

  // Check input is Blob or File object
  if(!is_blob_or_file(blob))
  {
    throw new Error("Other than Blob or File object can't export.");
  }

  // Create link element (linked to object downloading)
  let url = URL.createObjectURL(blob);
  let elem = document.createElement("a");
  elem.download = name;
  elem.href = url;

  // Dispatch event as download link clicked
  elem.click();

  // Delete created element and URL
  delete elem;
  URL.revokeObjectURL(url);
}


/**
 * Return is input object Blob or File object
 *
 * @param {*} obj Object to check
 * @returns When Blob/File object: true, other cases: false
 */
function is_blob_or_file(obj) {
  // Check is object and not null
  if((typeof(obj) !== "object") || (obj === null)) {
    return false;
  }

  // Check is toString method available
  if(typeof(obj.toString) !== "function") {
    return false;
  }

  // Check is in true cases
  let true_cases = ["[object Blob]", "[object File]"];
  let obj_string = obj.toString();
  return true_cases.includes(obj_string);
}
