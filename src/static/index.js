/**
 * mozjpeg-webui frontend main
 *
 * @author aKuad
 */

window.addEventListener("load", () => {
  const filesList = new RemovableList(document.querySelector("#field-fileslist"), () => toggle_process_available(filesList));


  /**
   * Button - Add files
   */
  document.querySelector("#input-files").addEventListener("change", files_input);
  document.querySelector("#input-dir"  ).addEventListener("change", files_input);
  /**
   * @param {Event} event On-change event
   */
  async function files_input(event) {
    // If file selecting cancelled, do nothing
    if(event.target.files.length         === 0 &&
       event.target.webkitEntries.length === 0) { return; }

    // Prevent parallel process
    controls_lock(filesList);

    // Get all inputted files
    const files_all = await InputFileReader.read(event.target);
    if(files_all.length === 0) {
      // If no files (e.g. Empty directory), view error message
      CornerMessage.view("No files detected.", CornerMessage.style.warn);
      return;
    }

    // Filter by file extension is jpeg
    const files_jpeg = [];
    const files_nojpeg = [];
    files_all.map(e => {
      const ext = e.name.slice(-4).toLowerCase(); // Extract last 4 chars
      if([".jpg", "jpeg"].includes(ext)) {        // Is it ".jpg" or "jpeg"
        files_jpeg.push(e);
      } else {
        files_nojpeg.push(e);
      }
    });

    // If non jpeg files detected, set error message
    const err_mes_array = [];
    if(files_nojpeg.length > 0) {
      err_mes_array.push("Non jpeg input:");
      if(files_nojpeg.length === 1) {
        err_mes_array.push(files_nojpeg[0].name);
      } else {
        err_mes_array.push(files_nojpeg[0].name + ` (+${ files_nojpeg.length-1 })`);
      }
    }

    // Add files to file list
    const items = files_jpeg.map(e => new RemovableListItem(e.name, e));
    const items_result = filesList.add_items_no_overwrite(...items);

    // If same name files detected, set error message
    const failed_count = items_result.filter(e => e === false).length;
    if(failed_count > 0) {
      err_mes_array.push("Some file(s) name duplicated:");
      const failed_first = files_jpeg[items_result.indexOf(false)];
      if(failed_count === 1) {
        err_mes_array.push(failed_first.name);
      } else {
        err_mes_array.push(failed_first.name + ` (+${ failed_count-1 })`);
      }
    }

    // View error message, when exist
    if(err_mes_array.length !== 0) {
      CornerMessage.view(err_mes_array.join("\n"), CornerMessage.style.danger);
    }

    controls_unlock(filesList);
  }


  /**
   * Button - Clear files
   */
  document.querySelector("#button-clear").addEventListener("click", e => {
    // If control locked, do nothing
    if(e.target.hasAttribute("disabled")) { return; }

    filesList.remove_items_all();
    toggle_process_available(filesList);
  });


  /**
   * Button - Process
   */
  document.querySelector("#button-process").addEventListener("click", async e => {
    // If control locked, do nothing
    if(e.target.hasAttribute("disabled")) { return; }

    controls_lock(filesList);

    // Post items to process
    const post_body = new FormData();
    filesList.export_items_all().forEach(e => {
      post_body.append("files", e.content);
    });
    const res = await fetch("/api/jpegs-opt", {body: post_body, method: "POST"});

    if(res.ok) {
      // On success, export file as downloading
      const res_blob = await res.blob();
      filesList.remove_items_all();
      CornerMessage.view("Success to process.", CornerMessage.style.info);
      export_as_download(res_blob, gen_file_name());
    } else {
      // On failed, view error message
      const res_json = await res.json();
      CornerMessage.view("Failed to process:\n" + res_json.detail, CornerMessage.style.danger);
    }

    controls_unlock(filesList);
  });
});


/**
 * @param {RemovableList} filesList Files list to control
 */
function controls_lock(filesList) {
  filesList.remove_lock();
  document.querySelector("#input-files").disabled = true;
  document.querySelector("#input-dir"  ).disabled = true;
  document.querySelector("#button-add-files").setAttribute("disabled", "");
  document.querySelector("#button-add-dir").setAttribute("disabled", "");
  document.querySelector("#button-clear").setAttribute("disabled", "");
  document.querySelector("#button-process").setAttribute("disabled", "");
  document.querySelector("#button-process").setAttribute("onprocess", "");
}


/**
 * @param {RemovableList} filesList Files list to control
 */
function controls_unlock(filesList) {
  filesList.remove_unlock();
  document.querySelector("#input-files").disabled = false;
  document.querySelector("#input-dir"  ).disabled = false;
  document.querySelector("#button-add-files").removeAttribute("disabled");
  document.querySelector("#button-add-dir").removeAttribute("disabled");
  document.querySelector("#button-clear").removeAttribute("disabled");
  toggle_process_available(filesList);  // Unlock, but when available
  document.querySelector("#button-process").removeAttribute("onprocess");
}


/**
 * @param {RemovableList} filesList Files list to read item count
 */
function toggle_process_available(filesList) {
  if(filesList.count_items() === 0) {
    document.querySelector("#button-process").setAttribute("disabled", "");
  } else {
    document.querySelector("#button-process").removeAttribute("disabled");
  }
}


/**
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
