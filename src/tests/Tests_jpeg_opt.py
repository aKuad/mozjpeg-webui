# coding: UTF-8
"""Tests for ``jpeg_opt.py`` module

Test cases:
  * Can optimize a JPEG file
  * Raise exception when invalid JPEG input
  * Raise exception when invalid executable specified

Test steps:
  1. Set current to this ``tests`` directory
  2. Create any JPEG file as ``img1.jpg``
  3. Execute this program
  4. Check console output and follow checking instructions

Author:
  aKuad

"""

# For import top layer module
import sys
sys.path.append("../")

from util.jpeg_opt import jpeg_opt


def Test_JpegOptimizing():
  print("-- Test_JpegOptimizing")
  org = Part_BinaryFileRead("img1.jpg")
  opt = jpeg_opt(org)
  Part_BinaryFileWrite("out.jpg", opt)
  print("--- CHECK - Can out.jpg open")


def ErrCheck_NonJpegInput():
  print("-- ErrCheck_NonJpegInput")
  try:
    _ = jpeg_opt(b"a")  # "a" as non jpeg input
    print("--- NG - Exception hasn't raised")
  except ValueError as e:
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


def ErrCheck_NonExistCommand():
  print("-- ErrCheck_NonExistCommand")
  try:
    org = Part_BinaryFileRead("img1.jpg")
    _ = jpeg_opt(org, "a") # "a" as non exist command
    print("--- NG - Exception hasn't raised")
  except OSError as e:
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
  ErrCheck_NonJpegInput()
  ErrCheck_NonExistCommand()
