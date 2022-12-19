# coding: UTF-8

from subprocess import run


def jpeg_opt(data_org: bytes, executable: str = "jpegtran") -> bytes:
  """JPEG optimizing by external command

  Args:
    executable (str): Executable `jpegtran` path or command
    jpeg_in (bytes): Target JPEG binary

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
  res = run(f"{executable} -optimize", shell=True,
                                       capture_output=True,
                                       input=data_org,
                                       text=False)

  if res.returncode == 127:
    raise OSError("Specified executable or command not found")
  elif res.returncode == 1:
    raise ValueError("Input was invalid JPEG binary")

  return res.stdout
