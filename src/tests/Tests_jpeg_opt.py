# coding: UTF-8
"""Tests for ``jpeg_opt.py`` module

Test cases:
  * Can optimize a JPEG file
  * Raise exception when invalid JPEG input
  * Raise exception when invalid executable specified

Test steps:
  1. Create any JPEG file as ``img1.jpg``
  2. Execute this program
  3. Check console output and follow checking instructions

Author:
  aKuad

"""

# For import top layer module
import sys
from pathlib import Path
sys.path.append(Path(__file__).resolve().parent.parent.__str__())

import unittest

from util.jpeg_opt import jpeg_opt

SRC_DIR = Path(__file__).absolute().parent.__str__() + "/"


class Tests_jpeg_opt(unittest.TestCase):
  def test_JpegOptimizing(self):
    org = part_BinaryFileRead(SRC_DIR + "img1.jpg")
    opt = jpeg_opt(org)
    part_BinaryFileWrite(SRC_DIR + "out.jpg", opt)
    print("CHECK REQUIRE - Can out.jpg open ", end="")


  def test_err_NonJpegInput(self):
    self.assertRaises(ValueError, jpeg_opt, b"a") # b"a" as non jpeg input


  def test_err_NonExistCommand(self):
    org = part_BinaryFileRead(SRC_DIR + "img1.jpg")
    self.assertRaises(OSError, jpeg_opt, org, "a")  # "a" as non exist command


def part_BinaryFileRead(file_name: str):
  with open(file_name, "rb") as f:
    return f.read()


def part_BinaryFileWrite(file_name: str, file_body: bytes):
  with open(file_name, "wb") as f:
    f.write(file_body)


if __name__ == "__main__":
  unittest.main(verbosity=2)
