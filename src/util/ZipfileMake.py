# coding: UTF-8

from tempfile import TemporaryFile
from zipfile import ZipFile, ZIP_STORED, ZIP_DEFLATED, ZIP_BZIP2, ZIP_LZMA


class ZipfileMake:
  """Create a zip archive without saving files to disk

  Attributes:
    __zip_compmode (int): Archive compression mode
    __zip_complevel (int): Archive compression level
    __fil_hanfle (IO[bytes]): Temporary file (for zip file) handle
    __zip_handle (ZipFile): Zip file handle

  Author:
    aKuad

  """

  __ZIP_COMP_DICT = {"stored": ZIP_STORED,
                     "deflated": ZIP_DEFLATED,
                     "bzip2": ZIP_BZIP2,
                     "lzma": ZIP_LZMA}
  '''dict: For convert specified compmode str to int'''


  def __init__(self, zip_compmode: str = "stored", zip_complevel: int | None = None):
    """Constructor

    Args:
      zip_compmode (str): It can select from stored (no-compression), deflated, bzip2 or lzma
      zip_complevel (int): Complession level (on deflated: between 0 and 9, on bzip2: between 1 and 9)

    Raises:
      ValueError: Invalid compression mode or level has specified

    """
    # Check is compression mode valid
    if self.__ZIP_COMP_DICT.get(zip_compmode) == None:
      raise ValueError("Invalid compression mode specified")

    # Check is compression level valid
    if zip_complevel == None:
      pass
    elif zip_compmode == "deflated" and (zip_complevel < 0 or zip_complevel > 9):
      raise ValueError("On deflated mode, complession level must be between 0 and 9")
    elif zip_compmode == "bzip2" and (zip_complevel < 1 or zip_complevel > 9):
      raise ValueError("On bzip2 mode, complession level must be between 1 and 9")

    self.__zip_compmode = self.__ZIP_COMP_DICT[zip_compmode]
    self.__zip_complevel = zip_complevel
    self.__fil_handle = TemporaryFile("wb+")
    self.__zip_handle = ZipFile(self.__fil_handle, "w", self.__zip_compmode, compresslevel=self.__zip_complevel)


  def add_file(self, name: str, data: str | bytes) -> None:
    """Add a file to archive from binary

    Args:
      name (str): File name to archive
      data (bytes): File data in binary

    """
    self.__zip_handle.writestr(name, data)
    return


  def export_zip(self) -> bytes:
    """Export current zip archive binary

    Returns:
      bytes: Created zip archive binary

    Note:
      After call this, no files can add more.

    """
    self.__zip_handle.close()   # confirm file binary
    self.__fil_handle.seek(0)
    return self.__fil_handle.read()


  def __del__(self):
    """Destructor

    Release all handles

    """
    self.__zip_handle.close()
    self.__fil_handle.close()
