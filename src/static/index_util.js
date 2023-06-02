/**
 * @file Utility functions for `index.js`
 *
 * @author aKuad
 */

/**
 * Convert array to string, first element and count of other elements
 *
 * @param {Array} ary Array to generate omit string
 * @returns {string} Omitted string
 */
function array_omit_string(ary) {
  if(ary.length === 0) {
    return "";
  } else if(ary.length === 1) {
    return `${ ary[0] }`;
  } else {
    return `${ ary[0] } (+${ ary.length-1 })`;
  }
}


/**
 * Generate filename from current date-time
 *
 * @returns {string} Generated file name string
 */
function gen_file_name() {
  const date_now = new Date();
  const year   = `${date_now.getFullYear()}`;
  const month  = `0${date_now.getMonth()}`.slice(-2);
  const day    = `0${date_now.getDay()}`.slice(-2);
  const hour   = `0${date_now.getHours()}`.slice(-2);
  const minute = `0${date_now.getMinutes()}`.slice(-2);
  const second = `0${date_now.getSeconds()}`.slice(-2);

  return `mozjpeg-${year}${month}${day}${hour}${minute}${second}`;
}


/**
 * Divide filename extension matched or not
 *
 * @param {Array<File>} files File array to divide
 * @param {Array<string>} expected_exts Extensions for dividing
 * @returns {Array<Array<File>>} [Matched, Unmatched] file objects
 */
function names_ext_filter(files, expected_exts) {
  const expected_exts_lower = expected_exts.map(e => e.toLowerCase());
  const files_ok = [];
  const files_ng = [];

  files.forEach(file => {
    const file_split = file.name.split(".");
    const file_ext = file_split.length === 1 ? "" : file_split.pop().toLowerCase();

    if(expected_exts_lower.includes(file_ext)) {
      files_ok.push(file);
    } else {
      files_ng.push(file);
    }
  });

  return [files_ok, files_ng];
}


/**
 * Reset files input, can be call change event for same input
 *
 * @param {HTMLInputElement} input_elem File input element to reset
 */
function file_input_reset(input_elem) {
  input_elem.type = "button";
  input_elem.type = "file";
}


/**
 * Change name field in file object
 *
 * @param {File} file File object to rename
 * @param {string} new_name New name of file
 * @returns {File} Renamed file object
 */
function file_rename(file, new_name) {
  if(file.name === new_name) {
    // If renaming unnecessary, do nothing
    return file;
  } else {
    // Re-creating file object, because name field is read-only
    return new File([file], new_name, {type: file.type, lastModified: file.lastModified});
  }
}
