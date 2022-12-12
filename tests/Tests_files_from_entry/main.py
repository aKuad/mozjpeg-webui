# coding: UTF-8
"""Tests for ``files_from_entry.js`` module

Details:
  See ``page.html``.

"""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from uvicorn import run


app = FastAPI()
app.mount("/static", StaticFiles(directory="../../static"), name="static")
templates = Jinja2Templates(directory="./")


@app.get("/")
def index(request: Request):
  return templates.TemplateResponse("page.html", {"request": request})


if __name__ == '__main__':
  run("main:app")
