#!/bin/sh

SRC_DIR="/opt/mozjpeg-webui/"
SERVICE_DIR="/etc/systemd/system/"

# Requirements checking section
if [ `whoami` != "root" ]; then
  echo "Root permission required." > /dev/stderr
  exit 1
fi

is_installable=1

systemctl --version 1>/dev/null 2>/dev/null
if [ "$?" != 0 ]; then
  echo "systemd is unavailable in this system." > /dev/stderr
  is_installable=0
fi

/opt/mozjpeg/bin/jpegtran -version 1>/dev/null 2>/dev/null
if [ "$?" != 0 ]; then
  echo "mozjpeg is unavailable in this system." > /dev/stderr
  is_installable=0
fi

python3 -V 1>/dev/null 2>/dev/null
if [ "$?" != 0 ]; then
  echo "python3 is unavailable in this system." > /dev/stderr
  is_installable=0
fi

if [ "$is_installable" != 1 ]; then
  exit 1
fi


# Setup section
## Is already installed
if [ -e $SRC_DIR ]; then
  echo "Mozjpeg-webui already installed."
  echo -n "Will you reinstall? [Y/n]: "
  read uin
  if [ `echo -n $uin | tr 'A-Z' 'a-z'` != "y" ]; then   # Converting lowercase
    echo "Aborting" > /dev/stderr
    exit 1
  fi
  # Overwriting install
  rm -r $SRC_DIR
  rm -f "$SERVICE_DIR/mozjpeg-webui.service"
fi

## Try to create python environment
mkdir $SRC_DIR
echo "Creating python virtual environment..."
python3 -m venv "$SRC_DIR/.venv/"
if [ "$?"!= 0 ]; then
  echo "\033[0;31mFailed to create python virtual environment.\033[0m" > /dev/stderr  # Red color
  rm -rf $SRC_DIR
  exit 1
fi
$SRC_DIR/.venv/bin/pip install -r requirements.txt

## Extract python minor version
py_ver=`python3 -V 2>/dev/null`
py_ver=${py_ver%.*}
py_ver=${py_ver##*.}

## Copy sources
cp -r src/pages $SRC_DIR
cp -r src/static $SRC_DIR
cp -r src/util $SRC_DIR
if [ "$py_ver" -lt 9 ]; then
  cp src/main_3-8.py $SRC_DIR
  cat mozjpeg-webui.service | sed -e "s/main_3-9.py/main_3-8.py/" > $SERVICE_DIR/mozjpeg-webui.service
else
  cp src/main_3-9.py $SRC_DIR
  cp mozjpeg-webui.service $SERVICE_DIR/
fi

## Setup systemd
systemctl daemon-reload


# Finish section
echo "\033[37;42;1mSuccess to setup.\033[0m"  # Green color
cat << EOF
Now you can start sevice with:
  sudo systemctl start mozjpeg-webui

App will be available on: http://localhost:8000/

If you want enable auto start:
  sudo systemctl enable mozjpeg-webui
EOF
