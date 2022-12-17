/**
 * Disable specified objects during post requesting
 *
 * @param {string} url Post URL
 * @param {*} body Post body object
 * @param {Array<HTMLInputElement>} objs Objects to be disabled during fetch
 * @returns {Response} Fetch API's result object
 *
 * @author aKuad
 */
async function obj_disabling_post(url, body, objs) {
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
