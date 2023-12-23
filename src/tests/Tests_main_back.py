# coding: UTF-8
"""Tests for ``main.py``

Test cases:
  * Can return optimized JPEG from single JPEG
  * Can return optimized JPEG files packed ZIP from multiple JPEG
  * Can return JPEG file names which failed to process in ``failed-names`` header
  * Return error when non JPEG binary input
  * Return error when invalid JPEG binary (or binaries) input
  * Return error when no name (empty string) file input

Test steps:
  1. Set current to this ``tests`` directory
  2. Create jpeg files ``img1.jpg``, ``img2.jpg``, ``img3.jpg``
  3. Create any files (non jpeg) ``invalid.txt`` ``invalid.jpg``
  4. Execute ``main.py``
  5. Execute this program in other console
  6. Check console output and follow checking instructions

Author:
  aKuad

"""

from json import loads as json_loads
import requests

import unittest
from pathlib import Path

SRC_DIR = Path(__file__).absolute().parent.__str__() + "/"


API_URL = "http://localhost:8000/api/jpegs-opt"


class Tests_main_back(unittest.TestCase):
  def test_SingleProcess(self):
    files = [("files", ("img1.jpg", open(SRC_DIR + "img1.jpg", "rb"), "image/jpeg"))]
    res = requests.post(API_URL, files=files)

    self.assertEqual(res.status_code // 100, 2, res.content)
    part_BinaryFileWrite(SRC_DIR + "res.jpg", res.content)
    print("[CHECK REQUIRE - Was res.jpg created and can open] ", end="")


  def test_MultipleProcess(self):
    files = [("files", ("img1.jpg", open(SRC_DIR + "img1.jpg", "rb"), "image/jpeg")),
             ("files", ("img2.jpg", open(SRC_DIR + "img2.jpg", "rb"), "image/jpeg")),
             ("files", ("img3.jpg", open(SRC_DIR + "img3.jpg", "rb"), "image/jpeg"))]
    res = requests.post(API_URL, files=files)

    self.assertEqual(res.status_code // 100, 2, res.content)
    part_BinaryFileWrite(SRC_DIR + "res.zip", res.content)
    print("[CHECK REQUIRE - Can open res.zip and contains 3 jpeg files] ", end="")


  def test_MultipleProcessIncludingInvalid(self):
    files = [("files", ("img1.jpg", open(SRC_DIR + "img1.jpg", "rb"), "image/jpeg")),
             ("files", ("img2.jpg", open(SRC_DIR + "img2.jpg", "rb"), "image/jpeg")),
             ("files", ("invalid.jpg", open(SRC_DIR + "invalid.jpg", "rb"), "image/jpeg"))]
    res = requests.post(API_URL, files=files)

    self.assertEqual(res.status_code // 100, 2, res.content)

    failed_names = res.headers.get("failed-names").split("\n")
    self.assertEqual(["invalid.jpg"], failed_names)
    part_BinaryFileWrite(SRC_DIR + "res-inv.zip", res.content)
    print("[CHECK REQUIRE - Can open res-inv.zip and contains 2 jpeg files] ", end="")


  def test_err_NonJpeg(self):
    files = [("files", ("invalid.txt", open(SRC_DIR + "invalid.txt", "rb"), "text/plain"))]
    res = requests.post(API_URL, files=files)

    self.assertEqual(res.status_code // 100, 4, "Client error wasn's occured")

    res_dict = json_loads(res.content.decode("utf-8"))
    self.assertEqual(res_dict["detail"], "Non jpeg input", res.content)


  def test_err_InvalidJpeg(self):
    files = [("files", ("invalid.jpg", open(SRC_DIR + "invalid.jpg", "rb"), "image/jpeg"))]
    res = requests.post(API_URL, files=files)

    self.assertEqual(res.status_code // 100, 4, "Client error wasn's occured")

    res_dict = json_loads(res.content.decode("utf-8"))
    self.assertEqual(res_dict["detail"], "Invalid jpeg input (may be broken)", res.content)


  def test_err_InvalidJpegMultiple(self):
    files = [("files", ("invalid1.jpg", open(SRC_DIR + "invalid.jpg", "rb"), "image/jpeg")),
             ("files", ("invalid2.jpg", open(SRC_DIR + "invalid.jpg", "rb"), "image/jpeg"))]
    res = requests.post(API_URL, files=files)

    self.assertEqual(res.status_code // 100, 4, "Client error wasn's occured")

    res_dict = json_loads(res.content.decode("utf-8"))
    self.assertEqual(res_dict["detail"], "No files could be processed (may be broken)", res.content)


  def test_err_NoNameFile(self):
    files = [("files", ("", open(SRC_DIR + "img1.jpg", "rb"), "image/jpeg"))]
    res = requests.post(API_URL, files=files)

    self.assertEqual(res.status_code // 100, 4, "Client error wasn's occured")

    res_dict = json_loads(res.content.decode("utf-8"))
    self.assertEqual(res_dict["detail"], "Empty filename detected", res.content)


def part_BinaryFileWrite(file_name: str, file_body: bytes):
  with open(file_name, "wb") as f:
    f.write(file_body)


if __name__ == "__main__":
  unittest.main(verbosity=2)
