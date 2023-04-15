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
sys.path.append("../")

from util.ZipfileMake import ZipfileMake


def Test_CreateZip_Default():
  print("-- Test_CreateZip_Default")
  zipfilemake = ZipfileMake()
  zipfilemake.add_file("hello.txt", "world")
  zipfilemake.add_file("log/hoge.log", "hoge")
  with open("default.zip", "wb") as f:
    f.write(zipfilemake.export_zip())
  print("--- CHECK - Can 'default.zip' open and containe 2 files")

def Test_CreateZip_Stored():
  print("-- Test_CreateZip_Stored")
  zipfilemake = ZipfileMake("stored")
  zipfilemake.add_file("hello.txt", "world")
  zipfilemake.add_file("log/hoge.log", "hoge")
  with open("stored.zip", "wb") as f:
    f.write(zipfilemake.export_zip())
  print("--- CHECK - Can 'stored.zip' open and containe 2 files")


def Test_CreateZip_Deflated_Level0():
  print("-- Test_CreateZip_Deflated_Level0")
  zipfilemake = ZipfileMake("deflated", 0)
  zipfilemake.add_file("hello.txt", "world")
  zipfilemake.add_file("hoge.log", "hoge")
  with open("deflated-0.zip", "wb") as f:
    f.write(zipfilemake.export_zip())
  print("--- CHECK - Can 'deflated-0.zip' open and containe 2 files")


def Test_CreateZip_Deflated_Level9():
  print("-- Test_CreateZip_Deflated_Level9")
  zipfilemake = ZipfileMake("deflated", 9)
  zipfilemake.add_file("hello.txt", "world")
  zipfilemake.add_file("hoge.log", "hoge")
  with open("deflated-9.zip", "wb") as f:
    f.write(zipfilemake.export_zip())
  print("--- CHECK - Can 'deflated-9.zip' open and containe 2 files")


def Test_CreateZip_Bzip2_Level1():
  print("-- Test_CreateZip_Bzip2_Level1")
  zipfilemake = ZipfileMake("bzip2", 1)
  zipfilemake.add_file("hello.txt", "world")
  zipfilemake.add_file("hoge.log", "hoge")
  with open("bzip2-0.zip", "wb") as f:
    f.write(zipfilemake.export_zip())
  print("--- CHECK - Can 'bzip2-0.zip' open and containe 2 files")


def Test_CreateZip_Bzip2_Level9():
  print("-- Test_CreateZip_Bzip2_Level9")
  zipfilemake = ZipfileMake("bzip2", 9)
  zipfilemake.add_file("hello.txt", "world")
  zipfilemake.add_file("hoge.log", "hoge")
  with open("bzip2-9.zip", "wb") as f:
    f.write(zipfilemake.export_zip())
  print("--- CHECK - Can 'bzip2-9.zip' open and containe 2 files")


def Test_CreateZip_Lzma():
  print("-- Test_CreateZip_Lzma")
  zipfilemake = ZipfileMake("lzma")
  zipfilemake.add_file("hello.txt", "world")
  zipfilemake.add_file("hoge.log", "hoge")
  with open("lzma.zip", "wb") as f:
    f.write(zipfilemake.export_zip())
  print("--- CHECK - Can 'lzma.zip' open and containe 2 files")


def ErrCheck_InvalidCompmode():
  print("-- ErrCheck_InvalidCompmode")
  try:
    zipfilemake = ZipfileMake("hoge")
    print("--- NG - Exception hasn't raised")
  except ValueError as e:
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


def ErrCheck_InvalidComplevelDeflated():
  print("-- ErrCheck_InvalidComplevelDeflated")
  try:
    zipfilemake = ZipfileMake("deflated", 10)
    print("--- NG - Exception hasn't raised")
  except ValueError as e:
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


def ErrCheck_InvalidComplevelBzip2():
  print("-- ErrCheck_InvalidComplevelBzip2")
  try:
    zipfilemake = ZipfileMake("bzip2", 10)
    print("--- NG - Exception hasn't raised")
  except ValueError as e:
    print("--- OK")
  except BaseException as e:
    print(e)
    print("--- NG - Un expected exception raised")


if __name__ == "__main__":
  Test_CreateZip_Default()
  Test_CreateZip_Stored()
  Test_CreateZip_Deflated_Level0()
  Test_CreateZip_Deflated_Level9()
  Test_CreateZip_Bzip2_Level1()
  Test_CreateZip_Bzip2_Level9()
  Test_CreateZip_Lzma()
  ErrCheck_InvalidCompmode()
  ErrCheck_InvalidComplevelDeflated()
  ErrCheck_InvalidComplevelBzip2()
