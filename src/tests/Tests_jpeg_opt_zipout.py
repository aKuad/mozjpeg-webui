# coding: UTF-8
"""Tests for ``jpeg_opt_zipout.py`` module

Test cases:
  * Can output a zipfile, containing optimized JPEG files
  * Can output failed filenames, when invalid files included
  * Raise exception when no files succeeded to optimize
  * Raise exception when invalid executable specified

Test steps:
  1. Set current to this ``tests`` directory
  2. Create any JPEG file as ``img1.jpg`` ``img2.jpg`` ``img3.jpg``
  3. Execute this program
  4. Check console output and follow checking instructions

Author:
  aKuad

"""

from fastapi import UploadFile

# For import top layer module
import sys
sys.path.append("../")

from util.jpeg_opt_zipout import jpeg_opt_zipout


def Test_NoInvalid():
  print("-- Test_NoInvalid")
  files = [UploadFile(open("img1.jpg", "rb"), filename="img1.jpg"),
           UploadFile(open("img2.jpg", "rb"), filename="img2.jpg"),
           UploadFile(open("img3.jpg", "rb"), filename="dir/img3.jpg")]
  zipout, failed_names = jpeg_opt_zipout(files)
  Part_BinaryFileWrite("zipout-noinvalid.zip", zipout)
  if(len(failed_names) == 0):
    print("--- CHECK - Is 'zipout-noinvalid.zip' contains 3 jpeg files?")
  else:
    print("failed_names: ", failed_names)
    print("--- NG - Un expected files failed to process")


def Test_PartlyInvalid():
  print("-- Test_PartlyInvalid")
  files = [UploadFile(open("img1.jpg", "rb"),    filename="img1.jpg"),
           UploadFile(open("img2.jpg", "rb"),    filename="img2.jpg"),
           UploadFile(open("invalid.jpg", "rb"), filename="invalid.jpg")]
  zipout, failed_names = jpeg_opt_zipout(files)
  Part_BinaryFileWrite("zipout-partly.zip", zipout)
  if(len(failed_names) == 1 and failed_names[0] == "invalid.jpg"):
    print("--- CHECK - Is 'zipout-partly.zip' contains 2 jpeg files?")
  else:
    print("failed_names: ", failed_names)
    print("--- NG - Un expected files failed to process")


def Test_HighTuroughput():
  print("-- Test_HighTuroughput")
  files = []
  for i in range(40): # 40 as many (or heavy) files
    files.append(UploadFile(open("img1.jpg", "rb"), filename=f"img{i}.jpg"))
  zipout, _ = jpeg_opt_zipout(files)
  Part_BinaryFileWrite("zipout-throughput.zip", zipout)
  print("--- CHECK - Was test ended speedy?")


def ErrCheck_AllInvalid():
  print("-- ErrCheck_AllInvalid")
  files = [UploadFile(open("invalid.jpg", "rb"), filename="invalid.jpg"),
           UploadFile(open("invalid.txt", "rb"), filename="invalid.txt")]
  try:
    zipout, failed_names = jpeg_opt_zipout(files)
    print("--- NG - Exception hasn't raised")
  except ValueError as e:
    print("--- OK")
  except Exception as e:
    print(e)
    print("--- NG - Un expected exception raised")


def ErrCheck_NonExistCommand():
  print("-- ErrCheck_NonExistCommand")
  files = [UploadFile(open("img1.jpg", "rb"), filename="img1.jpg")]
  try:
    zipout, failed_names = jpeg_opt_zipout(files, "a")  # "a" as non exist command
    print("--- NG - Exception hasn't raised")
  except OSError as e:
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


def Part_BinaryFileWrite(file_name: str, file_body: bytes):
  with open(file_name, "wb") as f:
    f.write(file_body)


if __name__ == "__main__":
  Test_NoInvalid()
  Test_PartlyInvalid()
  Test_HighTuroughput()
  ErrCheck_AllInvalid()
  ErrCheck_NonExistCommand()
