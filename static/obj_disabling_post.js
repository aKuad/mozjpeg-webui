/**
 * Disable specified objects during post requesting
 *
 * @param {Array<HTMLInputElement>} objs Objects to be disabled
 * @param {string} url Post URL
 * @param {*} body Post body object
 * @returns {Response} Fetch API's result object
 *
 * @author aKuad
 */
async function obj_disabling_post(objs, url, body) {
  // Disable all objects
  for(const obj of objs) {
    obj.disabled = true;
  }

  // Dispatch fetch and wait until done
  response = await fetch(url, { "body": body });

  // Enable all objects
  for(const obj of objs) {
    obj.disabled = false;
  }

  return response
}
