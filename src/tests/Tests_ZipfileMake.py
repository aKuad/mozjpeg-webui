# coding: UTF-8
"""Tests for ``ZipfileMake.py`` module

Test cases:
  * Can create zip files by supported compression mode
    * Default (No specified argument)
    * Stored
    * Deflated (compression level 0)
    * Deflated (compression level 9)
    * Bzip2 (compression level 1)
    * Bzip2 (compression level 9)
    * LZMA
  * Can open the created zip files by other software
  * Raise exception when invalid compression mode has specified
  * Raise exception when invalid compression level has specified

Test steps:
  1. Set current to this ``tests`` directory
  2. Execute this program
  3. Check console output and follow checking instructions

Author:
  aKuad

"""

# For import top layer module
import sys
from pathlib import Path
sys.path.append(Path(__file__).absolute().parent.parent.__str__())

import unittest

from util.ZipfileMake import ZipfileMake

SRC_DIR = Path(__file__).absolute().parent.__str__() + "/"


class Tests_ZipfileMake(unittest.TestCase):
  def test_CreateZip_Default(self):
    zipfilemake = ZipfileMake()
    zipfilemake.add_file(SRC_DIR + "hello.txt", "world")
    zipfilemake.add_file(SRC_DIR + "log/hoge.log", "hoge")
    part_BinaryFileWrite(SRC_DIR + "default.zip", zipfilemake.export_zip())
    print("[CHECK REQUIRE - Can 'default.zip' open and containe 2 files] ", end="")


  def test_CreateZip_Stored(self):
    zipfilemake = ZipfileMake("stored")
    zipfilemake.add_file(SRC_DIR + "hello.txt", "world")
    zipfilemake.add_file(SRC_DIR + "log/hoge.log", "hoge")
    part_BinaryFileWrite(SRC_DIR + "stored.zip", zipfilemake.export_zip())
    print("[CHECK REQUIRE - Can 'stored.zip' open and containe 2 files] ", end="")


  def test_CreateZip_Deflated_Level0(self):
    zipfilemake = ZipfileMake("deflated", 0)
    zipfilemake.add_file(SRC_DIR + "hello.txt", "world")
    zipfilemake.add_file(SRC_DIR + "hoge.log", "hoge")
    part_BinaryFileWrite(SRC_DIR + "deflated-0.zip", zipfilemake.export_zip())
    print("[CHECK REQUIRE - Can 'deflated-0.zip' open and containe 2 files] ", end="")


  def test_CreateZip_Deflated_Level9(self):
    zipfilemake = ZipfileMake("deflated", 9)
    zipfilemake.add_file(SRC_DIR + "hello.txt", "world")
    zipfilemake.add_file(SRC_DIR + "hoge.log", "hoge")
    part_BinaryFileWrite(SRC_DIR + "deflated-9.zip", zipfilemake.export_zip())
    print("[CHECK REQUIRE - Can 'deflated-9.zip' open and containe 2 files] ", end="")


  def test_CreateZip_Bzip2_Level1(self):
    zipfilemake = ZipfileMake("bzip2", 1)
    zipfilemake.add_file(SRC_DIR + "hello.txt", "world")
    zipfilemake.add_file(SRC_DIR + "hoge.log", "hoge")
    part_BinaryFileWrite(SRC_DIR + "bzip2-0.zip", zipfilemake.export_zip())
    print("[CHECK REQUIRE - Can 'bzip2-0.zip' open and containe 2 files] ", end="")


  def test_CreateZip_Bzip2_Level9(self):
    zipfilemake = ZipfileMake("bzip2", 9)
    zipfilemake.add_file(SRC_DIR + "hello.txt", "world")
    zipfilemake.add_file(SRC_DIR + "hoge.log", "hoge")
    part_BinaryFileWrite(SRC_DIR + "bzip2-9.zip", zipfilemake.export_zip())
    print("[CHECK REQUIRE - Can 'bzip2-9.zip' open and containe 2 files] ", end="")


  def test_CreateZip_Lzma(self):
    zipfilemake = ZipfileMake("lzma")
    zipfilemake.add_file(SRC_DIR + "hello.txt", "world")
    zipfilemake.add_file(SRC_DIR + "hoge.log", "hoge")
    part_BinaryFileWrite(SRC_DIR + "lzma.zip", zipfilemake.export_zip())
    print("[CHECK REQUIRE - Can 'lzma.zip' open and containe 2 files] ", end="")


  def test_err_InvalidCompmode(self):
    self.assertRaises(ValueError, ZipfileMake, "hoge")


  def test_err_InvalidComplevelDeflated(self):
    self.assertRaises(ValueError, ZipfileMake, "deflated", 10)


  def test_err_InvalidComplevelBzip2(self):
    self.assertRaises(ValueError, ZipfileMake, "bzip2", 10)


def part_BinaryFileWrite(file_name: str, file_body: bytes):
  with open(file_name, "wb") as f:
    f.write(file_body)


if __name__ == "__main__":
  unittest.main(verbosity=2)
