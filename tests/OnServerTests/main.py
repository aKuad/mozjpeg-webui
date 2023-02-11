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

from time import sleep

from fastapi import FastAPI, Request
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from uvicorn import run


app = FastAPI()
app.mount("/static", StaticFiles(directory="../../static"), name="static")
templates = Jinja2Templates(directory="./")


@app.get("/files_from_entry")
def files_from_entry(request: Request):
  """
  URL: http://localhost:8000/files_from_entry
  """
  return templates.TemplateResponse("Tests_files_from_entry.html", {"request": request})


@app.get("/InputFileReader")
def InputFileReader(request: Request):
  """
  URL: http://localhost:8000/InputFileReader
  """
  return templates.TemplateResponse("Tests_InputFileReader.html", {"request": request})


@app.get("/RemovableList")
def RemovableList(request: Request):
  """
  URL: http://localhost:8000/RemovableList
  """
  return templates.TemplateResponse("Tests_RemovableList.html", {"request": request})


@app.post("/post_echo")
async def post_echo(request: Request):
  """
  API for post testing
  """
  body = await request.body()
  print("----------")
  print(body)
  print(request.headers)
  print("----------")
  return Response(body)


@app.post("/post_echo_delay")
async def post_echo_delay(request: Request):
  """
  API for post testing (delayed response, supposed using high load API)
  """
  body = await request.body()
  print("----------")
  print(body)
  print(request.headers)
  print("----------")
  sleep(1)
  return Response(body)


if __name__ == '__main__':
  run("main:app", reload=True)
