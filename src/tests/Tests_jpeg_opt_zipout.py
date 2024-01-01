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
from asyncio import run

# For import top layer module
import sys
from pathlib import Path
sys.path.append(Path(__file__).absolute().parent.parent.__str__())

import unittest

from util.jpeg_opt_zipout import jpeg_opt_zipout

SRC_DIR = Path(__file__).absolute().parent.__str__() + "/"


class Tests_jpeg_opt_zipout(unittest.TestCase):
  def test_NoInvalid(self):
    files = [UploadFile(open(SRC_DIR + "img1.jpg", "rb"), filename="img1.jpg"),
             UploadFile(open(SRC_DIR + "img2.jpg", "rb"), filename="img2.jpg"),
             UploadFile(open(SRC_DIR + "img3.jpg", "rb"), filename="dir/img3.jpg")]
    zipout, failed_names = jpeg_opt_zipout(files)
    run(part_CloseFiles(files))
    part_BinaryFileWrite(SRC_DIR + "zipout-noinvalid.zip", zipout)
    self.assertEqual(len(failed_names), 0)
    print("[CHECK REQUIRE - Is 'zipout-noinvalid.zip' contains 3 jpeg files?] ", end="")


  def test_PartlyInvalid(self):
    files = [UploadFile(open(SRC_DIR + "img1.jpg", "rb"),    filename="img1.jpg"),
             UploadFile(open(SRC_DIR + "img2.jpg", "rb"),    filename="img2.jpg"),
             UploadFile(open(SRC_DIR + "invalid.jpg", "rb"), filename="invalid.jpg")]
    zipout, failed_names = jpeg_opt_zipout(files)
    run(part_CloseFiles(files))
    part_BinaryFileWrite(SRC_DIR + "zipout-partly.zip", zipout)
    self.assertEqual(len(failed_names), 1)
    self.assertEqual(failed_names[0], "invalid.jpg")
    print("[CHECK REQUIRE - Is 'zipout-partly.zip' contains 2 jpeg files?] ", end="")


  def test_HighTuroughput(self):
    files = []
    for i in range(40): # 40 as many (or heavy) files
      files.append(UploadFile(open(SRC_DIR + "img1.jpg", "rb"), filename=f"img{i}.jpg"))
    zipout, _ = jpeg_opt_zipout(files)
    run(part_CloseFiles(files))
    part_BinaryFileWrite(SRC_DIR + "zipout-throughput.zip", zipout)
    print("[CHECK REQUIRE - Was test ended speedy?] ", end="")


  def test_err_AllInvalid(self):
    files = [UploadFile(open(SRC_DIR + "invalid.jpg", "rb"), filename="invalid.jpg"),
             UploadFile(open(SRC_DIR + "invalid.txt", "rb"), filename="invalid.txt")]
    self.assertRaises(ValueError, jpeg_opt_zipout, files)
    run(part_CloseFiles(files))


  def test_err_NonExistCommand(self):
    files = [UploadFile(open(SRC_DIR + "img1.jpg", "rb"), filename="img1.jpg")]
    self.assertRaises(OSError, jpeg_opt_zipout, files, "a") # "a" as non exist command
    run(part_CloseFiles(files))


async def part_CloseFiles(files: list[UploadFile]):
  for file in files:
    await file.close()


def part_BinaryFileWrite(file_name: str, file_body: bytes):
  with open(file_name, "wb") as f:
    f.write(file_body)


if __name__ == "__main__":
  unittest.main(verbosity=2)
