# coding: UTF-8

from sys import version_info
if version_info.minor < 9:
  from typing import List, Tuple
else:
  List = list
  Tuple = tuple

from concurrent.futures import ThreadPoolExecutor, Future

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
  # Start processes for optimization
  ## for compare with non parallel processing:
  ##   executor = ThreadPoolExecutor(max_workers=1)
  executor = ThreadPoolExecutor()
  results: List[Future] = []
  for file in files:
    results.append(executor.submit(jpeg_opt_uploadfile, file, executable, options))

  # Pack results to zip file
  zipfile = ZipfileMake()
  failed_names: List[str] = []
  for file, result in zip(files, results):
    try:
      file_body = result.result()
      zipfile.add_file(file.filename, file_body)
    except ValueError:
      failed_names.append(file.filename)
    except Exception as e:
      zipfile.export_zip()  # For prevent "Exception ignored - ValueError"
      raise e

  # Return results
  if len(files) != len(failed_names):
    return zipfile.export_zip(), failed_names
  else:
    zipfile.export_zip()  # For prevent "Exception ignored - ValueError"
    raise ValueError("All input files were invalid as JPEG")


def jpeg_opt_uploadfile(file: UploadFile, executable, options) -> bytes:
  """Glue code of ``jpeg_opt``, for input UploadFile
  """
  return jpeg_opt(file.file.read(), executable, options)
