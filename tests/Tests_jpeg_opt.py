# coding: UTF-8
"""Tests for ``jpeg_opt.py`` module

Test cases:
  * Can optimize a JPEG file
  * Raise exception when invalid JPEG input
  * Raise exception when invalid executable specified

Test steps:
  1. Set current to this ``tests`` directory
  2. Create any JPEG file as ``img.jpg``
  3. Execute it with python3 interpreter
  4. Check generated JPEG file ``out.jpg`` size has been smaller
  5. Check generated JPEG file ``out.jpg`` can open by other software

Author:
  aKuad

"""

# For import top layer module
import sys
sys.path.append("../")

from util.jpeg_opt import jpeg_opt


def Test_JpegOptimizing():
  print("-- Test_JpegOptimizing")
  org = Part_BinaryFileRead("img.jpg")
  opt = jpeg_opt(org)
  Part_BinaryFileWrite("out.jpg", opt)
  print("--- OK")


def Test_ErrCheck_NonJpegInput():
  print("-- Test_ErrCheck_NonJpegInput")
  try:
    jpeg_opt(b"a")  # "a" as non jpeg input
    print("--- NG - Exception hasn't raised")
  except ValueError as e:
    print(e)
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


def Test_ErrCheck_NonExistCommand():
  print("-- Test_ErrCheck_NonExistCommand")
  try:
    org = Part_BinaryFileRead("img.jpg")
    jpeg_opt(org, "a") # "a" as non exist command
    print("--- NG - Exception hasn't raised")
  except OSError as e:
    print(e)
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


def Part_BinaryFileRead(file_name: str):
  with open(file_name, "rb") as f:
    return f.read()


def Part_BinaryFileWrite(file_name: str, file_body: bytes):
  with open(file_name, "wb") as f:
    f.write(file_body)


if __name__ == "__main__":
  Test_JpegOptimizing()
  Test_ErrCheck_NonJpegInput()
  Test_ErrCheck_NonExistCommand()
