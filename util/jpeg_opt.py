# coding: UTF-8

from subprocess import run


def jpeg_opt(jpeg_in: bytes, executable: str = "jpegtran", options: str = "-optimize") -> bytes:
  """JPEG optimizing by external command

  Args:
    jpeg_in (bytes): Target JPEG binary
    executable (str): Executable `jpegtran` path or command
    options (str): Options to pass executable

  Returns:
    bytes: Optimized JPEG binary

  Raises:
    OSError: Specified executable or command not found
    ValueError: Input was invalid JPEG binary

  Note:
    It requires `jpegtran` executable.
    Put executable into $PATH directory as ``jpegtran``
      or specify executable path to argument.

  Author:
    aKuad

  """
  res = run(f"{executable} {options}", shell=True,
                                       capture_output=True,
                                       input=jpeg_in,
                                       text=False)

  if res.returncode == 127:
    raise OSError("Specified executable or command not found")
  elif res.returncode == 1:
    raise ValueError("Input was invalid JPEG binary")

  return res.stdout
