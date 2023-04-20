# coding: UTF-8

from sys import version_info
if version_info.minor < 9:
  from typing import List, Tuple
else:
  List = list
  Tuple = tuple

from fastapi import UploadFile

from .jpeg_opt import jpeg_opt
from .ZipfileMake import ZipfileMake


def jpeg_opt_zipout(files: List[UploadFile], executable: str = "jpegtran", options: str = "-optimize -copy all") -> Tuple[bytes, List[str]]:
  """Multiple JPEG files optimizing with exporting to a zip file

  Args:
    files (list[UploadFile]): JPEG files to process
    executable (str): Executable ``jpegtran`` path or command
    options (str): Options to pass executable

  Returns:
    tuple[bytes, list[str]]: Zip file binary conatins optimized JPEG files & File names which failed to process

  Raises:
    OSError: Specified executable or command not found
    ValueError: No files succeeded to optimize

  Author:
    aKuad

  """
  zipfile = ZipfileMake()
  failed_names: List[str] = []

  for file in files:
    try:
      file_opt = jpeg_opt(file.file.read(), executable, options)
      zipfile.add_file(file.filename, file_opt)
    except ValueError:
      failed_names.append(file.filename)

  if len(files) != len(failed_names):
    return zipfile.export_zip(), failed_names
  else:
    raise ValueError("All input files were invalid as JPEG")
