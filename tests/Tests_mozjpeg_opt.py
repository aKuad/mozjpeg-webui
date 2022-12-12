# coding: UTF-8
"""Tests for ``mozjpeg_opt.py`` module

Test cases:
  * Can optimize a JPEG file
  * Raise exception when invalid JPEG input
  * Raise exception when invalid executable specified

Test steps:
  1. Set current to this ``tests`` directory
  2. Create any JPEG file as ``img.jpg``
  3. Execute this ``Tests_mozjpeg_opt.py`` with python3 interpreter
  4. Check generated JPEG file ``out.jpg`` size has been smaller
  5. Check generated JPEG file ``out.jpg`` can open by other software

"""

# For import top layer module
import sys
sys.path.append("../")

from util.mozjpeg_opt import mozjpeg_opt


def Test_JpegOptimizing():
  print("-- Test_JpegOptimizing")
  with open("img.jpg", "rb") as f:
    org = f.read()
  opt = mozjpeg_opt(org)
  with open("out.jpg", "wb") as f:
    f.write(opt)
  print("--- OK")


def Test_ErrCheck_NonJpegInput():
  print("-- Test_ErrCheck_NonJpegInput")
  try:
    mozjpeg_opt(b"h")
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
    with open("img.jpg", "rb") as f:
      org = f.read()
    mozjpeg_opt(org, "a") # "a" as non exist command
    print("--- NG - Exception hasn't raised")
  except OSError as e:
    print(e)
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


if __name__ == "__main__":
  Test_JpegOptimizing()
  Test_ErrCheck_NonJpegInput()
  Test_ErrCheck_NonExistCommand()
