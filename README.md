# mozjpeg-webui

![Release](https://img.shields.io/github/v/release/aKuad/mozjpeg-webui?label=Latest%20release)
![License](https://img.shields.io/github/license/aKuad/mozjpeg-webui?label=License)

JPEG optimizing web app

![Demo](/imgs/demo-full.gif)

## Features

* Plain HTML/CSS/JavaScript frontend
* Traditional style, and simple
* Multiple files/directories selection

## Usage

"Add files" or "Add a directory" to select files. Also can add by drag&drop files to file list.

![Demo - Add files](imgs/demo-add-files.webp)

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

### 1. Build and install mozjpeg

```sh
# Install required packages for build
sudo apt install cmake nasm

# Get mozjpeg source
## via git
git clone https://github.com/mozilla/mozjpeg.git --depth 1 -b v4.1.1
cd mozjpeg
### === or ===
## via wget
wget -O - https://github.com/mozilla/mozjpeg/archive/refs/tags/v4.1.1.tar.gz | tar -xzv -C ./
cd mozjpeg-4.1.1

# Build and install mozjpeg
cmake -G"Unix Makefiles" -DPNG_SUPPORTED=0 ./
sudo make install
```

Any problems of build? Please see [official reference](https://github.com/mozilla/mozjpeg/blob/master/BUILDING.md).

### 2. Install required python packages

> **Note**
>
> If you need, work in virtual environment.

```sh
pip install fastapi uvicorn jinja2 python-multipart

# via requirements.txt
pip install -r assets/requirements.txt
```

### 3. Run main

```sh
cd src
python3 main.py
```

Now app will be available on: `http://localhost:8000`

## Deployments (for systemd)

Please done [Build and install mozjpeg](#1-build-and-install-mozjpeg) before.

### 1. Run setup script

> **Note**
>
> Python virtual environment will be created automatically.

```sh
# Root permission required
sudo ./systemd-setup.sh
```

### 2. Switch by systemctl

`mozjpeg-webui` service will be available on systemd.

```sh
systemctl start mozjpeg-webui   # Start
systemctl stop mozjpeg-webui    # Stop
systemctl enable mozjpeg-webui  # Set auto start
systemctl disable mozjpeg-webui # Unset auto start
```

## License

[CC0-1.0](LICENSE)
