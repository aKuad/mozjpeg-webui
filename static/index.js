/**
 * @author aKuad
 */

window.addEventListener("load", () => {
  const filesList = new RemovableList(document.querySelector("#field-fileslist"), () => toggle_process_available(filesList));


  /**
   * Button - Add files
   */
  document.querySelector("#files-in").addEventListener("change", async event => {
    // If file selecting cancelled, do nothing
    if(event.target.files.length === 0) { return; }

    // Get all inputted files
    const files_all = [];
    if(event.target.webkitEntries.length !== 0) {
      for(const entry of event.target.webkitEntries) {
        files_all.push(...await files_from_entry(entry));
      }
    } else {
      files_all.push(...event.target.files);
    }

    if(files_all.length === 0) {
      // If no files (e.g. Empty directory), view error message
      CornerMessage.view("No files detected.", CornerMessage.style.warn);
      return;
    }

    // Filter by mime is jpeg
    const files_jpeg = files_all.filter(e => e.type === "image/jpeg");
    const files_nojpeg = files_all.filter(e => e.type !== "image/jpeg");

    // If non jpeg files detected, set error message
    const err_mes_array = [];
    if(files_nojpeg.length > 0) {
      err_mes_array.push("Non jpeg input:");
      if(files_nojpeg.length === 1) {
        // .replace(/^\//, "") ... /file.jpg -> file.jpg
        err_mes_array.push(files_nojpeg[0].name.replace(/^\//, ""));
      } else {
        err_mes_array.push(files_nojpeg[0].name.replace(/^\//, "") + " (+" + (files_nojpeg.length - 1).toString() + ")");
      }
    }

    // Add files to file list
    const items = files_jpeg.map(e => new Object({content: e, index: e.name.replace(/^\//, "")}));
    const items_result = filesList.add_items_no_overwrite(...items);
    toggle_process_available(filesList);

    // If same name files detected, set error message
    const failed_count = items_result.filter(e => e === false).length;
    if(failed_count > 0) {
      err_mes_array.push("Some file(s) name duplicated:");
      const failed_first = files_jpeg[items_result.indexOf(false)];
      if(failed_count === 1) {
        err_mes_array.push(failed_first.name.replace(/^\//, ""));
      } else {
        err_mes_array.push(failed_first.name.replace(/^\//, "") + " (+" + (failed_count - 1).toString() + ")");
      }
    }

    // View error message, when exist
    if(err_mes_array.length !== 0) {
      CornerMessage.view(err_mes_array.join("\n"), CornerMessage.style.danger);
    }
  });


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
      export_as_download(res_blob);
    } else {
      // On failed, view error message
      const res_json = await res.json();
      CornerMessage.view("Failed to process:\n" + res_json.detail, CornerMessage.style.danger);
    }

    controls_unlock(filesList);
  });
});


/**
 * @param {RemovableList} filesList 
 */
function controls_lock(filesList) {
  filesList.remove_lock();
  document.querySelector("#files-in").disabled = true;
  document.querySelector("#button-add").setAttribute("disabled", "");
  document.querySelector("#button-clear").setAttribute("disabled", "");
  document.querySelector("#button-process").setAttribute("disabled", "");
  document.querySelector("#button-process").setAttribute("onprocess", "");
}


/**
 * @param {RemovableList} filesList 
 */
function controls_unlock(filesList) {
  filesList.remove_unlock();
  document.querySelector("#files-in").disabled = false;
  document.querySelector("#button-add").removeAttribute("disabled");
  document.querySelector("#button-clear").removeAttribute("disabled");
  toggle_process_available(filesList);  // Unlock, but when available
  document.querySelector("#button-process").removeAttribute("onprocess");
}


/**
 * @param {RemovableList} filesList 
 */
function toggle_process_available(filesList) {
  if(filesList.count_items() === 0) {
    document.querySelector("#button-process").setAttribute("disabled", "");
  } else {
    document.querySelector("#button-process").removeAttribute("disabled");
  }
}
