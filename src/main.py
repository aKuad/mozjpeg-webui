# coding: UTF-8
"""JPEG optimizing web app

About requirements and details, see ``README.md``

"""

from sys import version_info
if version_info.minor < 9:
  from typing import List
else:
  List = list

from fastapi import FastAPI, Request, status, File, UploadFile, HTTPException
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from uvicorn import run

from util.jpeg_opt import jpeg_opt
from util.jpeg_opt_zipout import jpeg_opt_zipout


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="pages")


@app.get("/")
def index(request: Request):
  """View app page
  """
  return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/jpegs-opt")
async def jpegs_opt(files: List[UploadFile] = File(...)):
  """Optimize JPEG binary, support multiple files

  Args:
    files (list[UploadFile]): File items to optimize

  Returns:
    On single file: Optimized JPEG binary,
    On multiple files: Optimized JPEGs packed in a zip with failed file names in `failed-names` header (if any),
    On error: JSON string with detail

  Note:
    File items must be:
      * MIME is ``image/jpeg``
      * Any file name has, not empty

  """
  # Check all files MIME is image/jpeg
  are_mime_jpeg = map(lambda e: e.content_type == "image/jpeg", files)
  if False in are_mime_jpeg:
    raise HTTPException(status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Non jpeg input")

  # Check all files have filename
  are_filename_empty = map(lambda e: e.filename == "", files)
  if True in are_filename_empty:
    raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Empty filename detected")

  # On single JPEG input
  if len(files) == 1:
    try:
      file_opt = jpeg_opt(await files[0].read(), "/opt/mozjpeg/bin/jpegtran")
      return Response(file_opt, media_type="image/jpeg")
    except ValueError:
      # On optimizing error occured
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid jpeg input (may be broken)")

  # On multiple JPEG input
  else:
    try:
      zipfile, failed_names = jpeg_opt_zipout(files, "/opt/mozjpeg/bin/jpegtran")
      return Response(zipfile, media_type="application/zip", headers={"failed-names": "\n".join(failed_names)})
    except ValueError:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No files could be processed (may be broken)")


if __name__ == '__main__':
  run("main:app", reload=True)
