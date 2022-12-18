/**
 * Disable specified objects during post requesting
 *
 * @param {string} url Post URL
 * @param {*} body Post body object
 * @param {Array<HTMLInputElement>} objs Objects to be disabled during fetch
 * @returns {Promise<Response>} Fetch API's result object
 *
 * @author aKuad
 */
 async function obj_disabling_post(url, body = undefined, objs = []) {
  // Check are 'objs' elements object
  if(!check_are_objects(objs)) {
    throw new Error("Non object element(s) specified as argument.");
  }

  // Disable all objects
  for(const obj of objs) {
    obj.disabled = true;
  }

  // Dispatch fetch and wait until done
  response = await fetch(url, { method: "POST", body: body });

  // Enable all objects
  for(const obj of objs) {
    obj.disabled = false;
  }

  return response
}


/**
 * Return are input array's all elements object
 *
 * @param {Array<*>} objs Objects to check containing in array
 * @returns {boolean} All elements are object: true, other cases: false
 */
 function check_are_objects(objs) {
  let is_obj = objs.map(obj => typeof obj === "object");
  // Exist 'false' means: non-object element(s) exist
  // Only 'true' means  : all element(s) are object
  return !is_obj.includes(false);
}
