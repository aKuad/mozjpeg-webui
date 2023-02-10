# mozjpeg-webui

![Release](https://img.shields.io/github/v/release/akuad/mozjpeg-webui?label=Latest%20release)
![License](https://img.shields.io/github/license/aKuad/mozjpeg-webui?label=License)

JPEG optimizing web app

![Screen shot](/imgs/screen.webp)

## Features

* Written with only plain HTML/CSS/JavaScript frontend
* Traditional style, and simple
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

```sh
# Install required packages for build
sudo apt install cmake nasm

# Get mozjpeg source
## Throwgh git
git clone https://github.com/mozilla/mozjpeg.git
cd mozjpeg
### or ###
## Throwgh wget
wget -O - https://github.com/mozilla/mozjpeg/archive/refs/tags/v4.1.1.tar.gz | tar -xzv -C ./
cd mozjpeg-4.1.1

# Build and install mozjpeg
cmake -G"Unix Makefiles" -DPNG_SUPPORTED=0 ./
sudo make install/local
```

Any problem to build? Please see [official reference](https://github.com/mozilla/mozjpeg/blob/master/BUILDING.md).

### Install required python packages

> **Note**
>
> If you need, work in virtual environment.

```sh
pip install fastapi uvicorn jinja2 aiofiles python-multipart
```

### Run main

```sh
# You can check your python3 version by:
python3 -V

# For python 3.8.x or previous
python3 main_3-8.py

# For python 3.9 or later
python3 main_3-9.py
```

## About difference between 3.8 - 3.9

There are difference of type annotation.

```py
# On 3.8 or previous
from typing import List

def func(arg: List[str])
```

```py
# On 3.9 or later
def func(arg: list[str])
## It supported as builtin,
##   and `typing.List` will be deprecated in future releases
```

In fast api, data type cheking works with type annotation.
And an api `/api/jpegs-opt` using it.

```py
@app.post("/api/jpegs-opt")
async def jpegs_opt(files: list[UploadFile] = File(...)):
```

So annotation support is necessary, and main source divided `main_3-8.py` and `main_3-9.py`.

## License

[CC0-1.0](LICENSE)
