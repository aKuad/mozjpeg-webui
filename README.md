# mozjpeg-webui

JPEG optimizing web app

![Screen shot](/imgs/screen.webp)

## Features

* Written with only plain HTML/CSS/JavaScript frontend
* Multiple files/directories selection

## Useage

Click "Add files" to select files. (or drag&drop files here)

![Demo - Add files](imgs/demo-1.webp)

Click "Process" to execute optimizing.

![Demo - Process](imgs/demo-2.webp)

File saving dialog will open, and save processed file.

## Deployments

This is a procedure for linux (Debian/Ubuntu) system.

### Build and install mozjpeg

Install required packages for build.

```sh
sudo apt install cmake nasm
```

Get mozjpeg source.

```sh
# Throwgh git
git clone https://github.com/mozilla/mozjpeg.git
cd mozjpeg

# Throwgh wget
wget -O - https://github.com/mozilla/mozjpeg/archive/refs/tags/v4.1.1.tar.gz | tar -xzv -C ./
cd mozjpeg-4.1.1
```

Build and install mozjpeg.

```sh
cmake -G"Unix Makefiles" -DPNG_SUPPORTED=0 ./
sudo make install/local
```

### Install required python packages

> **Note**
> If you need, work in virtual environment.

```sh
pip install fastapi uvicorn jinja2 aiofiles python-multipart
```

### Run main

```sh
# Python 3.8.x or previous
python3 main_3-8.py

# Python 3.9 or later
python3 main_3-9.py
```

You can check your python3 version by:

```sh
python3 -V
```

## About difference between 3.8 - 3.9

On Python 3.8 or previous, list element type annotation supported by `typing.List`.

```py
from typing import List

def func(arg: List[str])
```

Python 3.9 or later, it supported as buildin (Generic Alias Type), and `typing.List` will be deprecated.

```py
def func(arg: list[str])
```

So main source divided `main_3-8.py` and `main_3-9.py` because of that reason.

### Why annotation necessary?

In fast api, data type cheking works with type annotation.

An api `/api/jpegs-opt` requires file input (can be multiple).
And type checking supplied by FastAPI.

```py
@app.post("/api/jpegs-opt")
async def jpegs_opt(files: list[UploadFile] = File(...)):
```

So annotation support is necessary.

## License

[CC0-1.0](LICENSE)
