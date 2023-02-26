/**
 * Export any data to user as file downloading
 *
 * @param {Blob | File} blob Data body to export
 * @param {string} name Default file name to export
 *
 * @throws {Error} No arguments
 * @throws {Error} `blob` type must be `Blob` or `File`
 *
 * @author aKuad
 */
function export_as_download(blob, name = "file") {
  // Argument check
  if(blob === undefined) {
    throw new TypeError("No arguments.");
  }
  if(!(blob instanceof Blob) && !(blob instanceof File)) {
    const blob_type = blob === null ? "null" : typeof blob === "object" ? blob.constructor.name : typeof blob;
    throw new TypeError(`Argument 'blob' must be an Blob or File, not ${blob_type}.`);
  }

  // Create link element (linked to object downloading)
  const url = URL.createObjectURL(blob);
  const elem = document.createElement("a");
  elem.download = name;
  elem.href = url;

  // Dispatch event as download link clicked
  elem.click();

  // Delete created element and URL
  delete elem;
  URL.revokeObjectURL(url);
}
