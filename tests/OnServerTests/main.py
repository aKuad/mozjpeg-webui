# coding: UTF-8
"""Tests for on HTTP server connection required modules

About test details, see each testing HTML codes.

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
  return templates.TemplateResponse("Tests_files_from_entry.html", {"request": request})


if __name__ == '__main__':
  run("main:app")
