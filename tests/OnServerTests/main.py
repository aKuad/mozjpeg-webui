# coding: UTF-8
"""Tests for on HTTP server connection required modules

Note:
  About test details, see each testing HTML codes.

Requirements:
  Some additional modules are required.
  To install them: `pip install fastapi uvicorn jinja2 aiofiles`

Author:
  aKuad

"""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from uvicorn import run


app = FastAPI()
app.mount("/static", StaticFiles(directory="../../static"), name="static")
templates = Jinja2Templates(directory="./")


@app.get("/files_from_entry")
def index(request: Request):
  """
  URL: http://localhost:8000/files_from_entry
  """
  return templates.TemplateResponse("Tests_files_from_entry.html", {"request": request})


if __name__ == '__main__':
  run("main:app")
