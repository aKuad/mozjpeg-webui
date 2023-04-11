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
  const year = `${date_now.getFullYear()}`;
  const month = `0${date_now.getMonth()}`.slice(-2);
  const day   = `0${date_now.getDay()}`.slice(-2);
  const hour = `0${date_now.getHours()}`.slice(-2);
  const minute = `0${date_now.getMinutes()}`.slice(-2);
  const second = `0${date_now.getSeconds()}`.slice(-2);

  return `mozjpeg-${year}${month}${day}${hour}${minute}${second}`;
}
