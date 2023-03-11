# mozjpeg-webui

![Release](https://img.shields.io/github/v/release/aKuad/mozjpeg-webui?label=Latest%20release)
![License](https://img.shields.io/github/license/aKuad/mozjpeg-webui?label=License)

JPEG optimizing web app

![Screen shot](/imgs/screen.webp)

## Features

* Plain HTML/CSS/JavaScript frontend
* Traditional style, and simple
* Multiple files/directories selection

## Useage

"Add files" or "Add a directory" to select files. (or drag&drop files here)

![Demo - Add files](imgs/demo-add-files.webp)

![Demo - Add a directory](imgs/demo-add-adir.webp)

"Process" to execute optimizing.

![Demo - Process](imgs/demo-process.webp)

File saving dialog will open, and save processed file.

## Requirements

* Python3 (2 or lower is unsupported)
* Python pip
* mozjpeg
* Python venv (for systemd)
* systemd (for systemd)

## Deployments (for Debian/Ubuntu)

### Build and install mozjpeg

```sh
# Install required packages for build
sudo apt install cmake nasm

# Get mozjpeg source
## Throwgh git
git clone https://github.com/mozilla/mozjpeg.git
cd mozjpeg
git checkout v4.1.1
### === or ===
## Throwgh wget
wget -O - https://github.com/mozilla/mozjpeg/archive/refs/tags/v4.1.1.tar.gz | tar -xzv -C ./
cd mozjpeg-4.1.1

# Build and install mozjpeg
cmake -G"Unix Makefiles" -DPNG_SUPPORTED=0 ./
sudo make install
```

Any problems of build? Please see [official reference](https://github.com/mozilla/mozjpeg/blob/master/BUILDING.md).

### Install required python packages

> **Note**
>
> If you need, work in virtual environment.

```sh
pip install fastapi uvicorn jinja2 python-multipart
```

### Run main

```sh
# You can check your python3 version by:
python3 -V

# For python 3.8.x or previous
cd src/
python3 main_3-8.py

# For python 3.9 or later
cd src/
python3 main_3-9.py
```

### Access from browser

Now app will be available on: `http://localhost:8000`

## Deployments (for systemd)

Please done [Build and install mozjpeg](#build-and-install-mozjpeg) before.

### Run setup script

> **Note**
>
> Python virtual environment will be created automatically.

```sh
# Root permission required
sudo ./systemd-setup.sh
```

### Switch by systemctl

`mozjpeg-webui` service will be available on systemd.

```sh
systemctl start mozjpeg-webui   # Start
systemctl stop mozjpeg-webui    # Stop
systemctl enable mozjpeg-webui  # Set auto start
systemctl disable mozjpeg-webui # Unset auto start
```

## About difference between 3.8 - 3.9

This is a difference of type annotation.

```py
# On 3.8 or previous
from typing import List

def func(arg: List[str]):
```

```py
# On 3.9 or later
def func(arg: list[str]):
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
