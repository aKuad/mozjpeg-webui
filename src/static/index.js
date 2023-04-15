/**
 * mozjpeg-webui frontend main
 *
 * @author aKuad
 */

window.addEventListener("load", () => {
  /* Item list setup */
  const filesList = new RemovableList(document.querySelector("#field-fileslist"), () => toggle_process_available(filesList));


  /* Drag&Drop input setup */
  const dropField_view = document.querySelector("#dragview");
  dropField_view.remove();
  dropField_view.style.display = "";
  const dropField = new FilesDropField(document.querySelector("#field-fileslist"), dropField_view);
  const dropField_detector = dropField.detector;


  /**
   * Button - Add files
   */
  document.querySelector("#input-files").addEventListener("change", files_input);
  document.querySelector("#input-dir"  ).addEventListener("change", files_input);
  dropField_detector.addEventListener("change", files_input);
  /**
   * @param {Event} event On-change event
   */
  async function files_input(event) {
    // If file selecting cancelled, do nothing
    if(event.target.files.length         === 0 &&
       event.target.webkitEntries.length === 0) { return; }

    // Prevent parallel process
    controls_lock(filesList, dropField);

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

    // If non jpeg files detected, display error message
    if(files_nojpeg.length !== 0) {
      const files_nojpeg_name = files_nojpeg.map(f => f.name);
      CornerMessage.view(`Non jpeg input:\n${ array_omit_string(files_nojpeg_name) }`, CornerMessage.style.danger);
    }

    // Add files to file list
    const items = files_jpeg.map(e => new RemovableListItem(e.name, e));
    const items_result = filesList.add_items_no_overwrite(...items);
    const items_failed = [];
    for(let i = 0; i < items.length; i++) {
      if(!items_result[i]) {
        items_failed.push(items[i]);
      }
    }

    // If same name files detected, set error message
    if(items_failed.length !== 0) {
      const items_failed_name = items_failed.map(e => e.index);
      const user_select = await CustomDialog.view(`Some file(s) name duplicated:\n\n${ array_omit_string(items_failed_name) }`, "Skip", "Keep each", "Replace");
      if(user_select === "Keep each") {
        filesList.add_items_keep_each(...items_failed);
      } else if(user_select === "Replace") {
        filesList.add_items_overwrite(...items_failed);
      }
      // When "Skip" selected, do nothing
    }

    controls_unlock(filesList, dropField);
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

    controls_lock(filesList, dropField);

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

    controls_unlock(filesList, dropField);
  });
});


/**
 * @param {RemovableList} filesList Files list to control
 * @param {FilesDropField} dropField Drop detector to control
 */
function controls_lock(filesList, dropField) {
  filesList.remove_lock();
  dropField.drop_lock();
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
 * @param {FilesDropField} dropField Drop detector to control
 */
function controls_unlock(filesList, dropField) {
  filesList.remove_unlock();
  dropField.drop_unlock();
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
