# coding: UTF-8
"""Tests for ``main_3-8.py`` and ``main_3-9.py``

Test cases:
  * Can return optimized JPEG from single JPEG
  * Can return optimized JPEG files packed ZIP from multiple JPEG
  * Return error when non JPEG binary input
  * Return error when invalid JPEG binary input
  * Return error when no name (empty string) file input
  * Return error when ``files`` field missing post

Test steps:
  1. Create jpeg files ``img1.jpg``, ``img2.jpg``, ``img3.jpg``
  2. Create any files (non jpeg) ``invalid.txt`` ``invalid.jpg``
  3. Execute ``main_3-8.py`` or ``main_3-9.py``
  4. Execute this program in other console
  5. Check console output and follow checking instructions

Author:
  aKuad

"""

from json import loads as json_loads
import requests


API_URL = "http://localhost:8000/api/jpegs-opt"


def Test_SingleProcess():
  print("-- Test_SingleProcess")
  files = [("files", ("img1.jpg", open("img1.jpg", "rb"), "image/jpeg"))]
  res = requests.post(API_URL, files=files)

  if int(res.status_code / 100) == 5:
    print(res.content)
    print("--- NG - Server error")
  elif int(res.status_code / 100) == 4:
    print(res.content)
    print("--- NG - Client error")
  else:
    Part_BinaryFileWrite("res.jpg", res.content)
    print("--- CHECK - Was res.jpg created and can open")


def Test_MultipleProcess():
  print("-- Test_MultipleProcess")
  files = [("files", ("img1.jpg", open("img1.jpg", "rb"), "image/jpeg")),
           ("files", ("img2.jpg", open("img2.jpg", "rb"), "image/jpeg")),
           ("files", ("img3.jpg", open("img3.jpg", "rb"), "image/jpeg"))]
  res = requests.post(API_URL, files=files)

  if int(res.status_code / 100) == 5:
    print(res.content)
    print("--- NG - Server error")
  elif int(res.status_code / 100) == 4:
    print(res.content)
    print("--- NG - Client error")
  else:
    Part_BinaryFileWrite("res.zip", res.content)
    print("--- CHECK - Can open res.zip and contains 3 jpeg files")


def Test_MultipleProcessIncludingInvalid():
  print("-- Test_MultipleProcessIncludingInvalid")
  files = [("files", ("img1.jpg", open("img1.jpg", "rb"), "image/jpeg")),
           ("files", ("img2.jpg", open("img2.jpg", "rb"), "image/jpeg")),
           ("files", ("invalid.jpg", open("invalid.jpg", "rb"), "image/jpeg"))]
  res = requests.post(API_URL, files=files)

  if int(res.status_code / 100) == 5:
    print(res.content)
    print("--- NG - Server error")
  elif int(res.status_code / 100) == 4:
    print(res.content)
    print("--- NG - Client error")
  
  failed_names = res.headers.get("failed-names").split("\n")
  if len(failed_names) != 1 or failed_names[0] != "invalid.jpg":
    print("Expected:", ["invalid.jpg"])
    print("Actual:", failed_names)
    print("--- NG - Unexpected header")
  else:
    Part_BinaryFileWrite("res-inv.zip", res.content)
    print("--- CHECK - Can open res-inv.zip and contains 2 jpeg files")


def ErrCheck_NonJpeg():
  print("-- ErrCheck_NonJpeg")
  files = [("files", ("invalid.txt", open("invalid.txt", "rb"), "text/plain"))]
  res = requests.post(API_URL, files=files)

  if int(res.status_code / 100) != 4:
    print(res.content)
    print("--- NG - Client error wasn's occured")
    return

  res_dict = json_loads(res.content.decode("utf-8"))
  if res_dict["detail"] == "Non jpeg input":
    print("--- OK")
  else:
    print(res.content)
    print("--- NG - Unexpected error occured")


def ErrCheck_InvalidJpeg():
  print("-- ErrCheck_InvalidJpeg")
  files = [("files", ("invalid.jpg", open("invalid.jpg", "rb"), "image/jpeg"))]
  res = requests.post(API_URL, files=files)

  if int(res.status_code / 100) != 4:
    print(res.content)
    print("--- NG - Client error wasn's occured")
    return

  res_dict = json_loads(res.content.decode("utf-8"))
  if res_dict["detail"] == "Invalid jpeg input (may be broken)":
    print("--- OK")
  else:
    print(res.content)
    print("--- NG - Unexpected error occured")


def ErrCheck_InvalidJpegMultiple():
  print("-- ErrCheck_InvalidJpegMultiple")
  files = [("files", ("invalid1.jpg", open("invalid.jpg", "rb"), "image/jpeg")),
           ("files", ("invalid2.jpg", open("invalid.jpg", "rb"), "image/jpeg"))]
  res = requests.post(API_URL, files=files)

  if int(res.status_code / 100) != 4:
    print(res.content)
    print("--- NG - Client error wasn's occured")
    return

  res_dict = json_loads(res.content.decode("utf-8"))
  if res_dict["detail"] == "No files could be processed (may be broken)":
    print("--- OK")
  else:
    print(res.content)
    print("--- NG - Unexpected error occured")


def ErrCheck_NoNameFile():
  print("-- ErrCheck_NoNameFile")
  files = [("files", ("", open("img1.jpg", "rb"), "image/jpeg"))]
  res = requests.post(API_URL, files=files)

  if int(res.status_code / 100) != 4:
    print(res.content)
    print("--- NG - Client error wasn's occured")
    return

  res_dict = json_loads(res.content.decode("utf-8"))
  if res_dict["detail"] == "Empty filename detected":
    print("--- OK")
  else:
    print(res.content)
    print("--- NG - Unexpected error occured")


def ErrCheck_NoBody():
  print("-- ErrCheck_NoBody")
  res = requests.post(API_URL)

  if int(res.status_code / 100) != 4:
    print(res.content)
    print("--- NG - Client error wasn's occured")
    return

  res_dict = json_loads(res.content.decode("utf-8"))
  if res_dict["detail"][0]["type"] == "value_error.missing":
    print("--- OK")
  else:
    print(res.content)
    print("--- NG - Unexpected error occured")


def Part_BinaryFileWrite(file_name: str, file_body: bytes):
  with open(file_name, "wb") as f:
    f.write(file_body)


if __name__ == "__main__":
  Test_SingleProcess()
  Test_MultipleProcess()
  Test_MultipleProcessIncludingInvalid()
  ErrCheck_NonJpeg()
  ErrCheck_InvalidJpeg()
  ErrCheck_InvalidJpegMultiple()
  ErrCheck_NoNameFile()
  ErrCheck_NoBody()
