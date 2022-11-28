/**
 * Export any data to user as file downloading
 *
 * @param {Blob | File} blob Data body to export
 * @param {string} name Default file name to export
 * 
 * @author aKuad
 */
function export_as_download(blob, name = "file") {
  // Check input is Blob or File object
  if(typeof(blob) !== "object" ||
     blob === null ||
     typeof(blob.toString) !== "function" ||
     (blob.toString() !== "[object Blob]" && blob.toString() !== "[object File]"))
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
