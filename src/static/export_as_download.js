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
  // Check is argument specified
  if(blob === undefined) {
    throw new Error("No arguments.");
  }

  // Check input is Blob or File object
  if(!(blob instanceof Blob) && !(blob instanceof File)) {
    throw new Error("Other than Blob or File object can't export.");
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