#!/bin/sh

SRC_DIR="/opt/mozjpeg-webui/"
SERVICE_DIR="/etc/systemd/system/"

# Requirements checking section
## Is root user
if [ `whoami` != "root" ]; then
  echo "Root permission required." > /dev/stderr
  exit 1
fi

## Is systemd available
systemctl --version 1>/dev/null 2>/dev/null
stat=$?
if [ "$stat" != 0 ]; then
  echo "'systemd' is unavailable in this system." > /dev/stderr
  exit 1
fi

## Is mozjpeg installed
/opt/mozjpeg/bin/jpegtran -version 1>/dev/null 2>/dev/null
stat=$?
if [ "$stat" != 0 ]; then
  echo "'mozjpeg' is not installed in this system." > /dev/stderr
  exit 1
fi

## Is python3 available
py_ver=`python3 -V 2>/dev/null`
stat=$?
if [ "$stat" != 0 ]; then
  echo "'python3' is unavailable in this system." > /dev/stderr
  exit 1
fi

## Extract python version
py_ver=${py_ver#* }
py_ver=${py_ver%.*}
py_ver_maj=${py_ver%.*}
py_ver_min=${py_ver#*.}


# Setup section
## Is already installed
if [ -e $SRC_DIR ]; then
  echo "Mozjpeg-webui already installed."
  echo -n "Will you reinstall? [Y/n]: "
  # Overwriting install or abort
  read uin
  uin=`echo -n $uin | tr 'A-Z' 'a-z'` # Convert to lowercase
  if [ $uin != "y" ] && [ $uin != "yes" ]; then
    echo "Aborting" > /dev/stderr
    exit 1
  fi
  rm -r $SRC_DIR
  rm -f "$SERVICE_DIR/mozjpeg-webui.service"
fi

## Try to create python environment
mkdir /opt/mozjpeg-webui
python3 -m venv "$SRC_DIR/.venv/"
stat=$?
if [ "$stat"!= 0 ]; then
  # Red color message for fatal errors
  echo "\033[0;31mFailed to create python virtual environment.\033[0m" > /dev/stderr
  exit 1
fi
$SRC_DIR/.venv/bin/pip install -r requirements.txt

## Copy sources
cp -r src/pages $SRC_DIR
cp -r src/static $SRC_DIR
cp -r src/util $SRC_DIR
if [ "$py_ver_min" -lt 9 ]; then
  cp src/main_3-8.py $SRC_DIR
  cat mozjpeg-webui.service | sed -e "s/main_3-9.py/main_3-8.py/" > $SERVICE_DIR/mozjpeg-webui.service
else
  cp src/main_3-9.py $SRC_DIR
  cp mozjpeg-webui.service $SERVICE_DIR/
fi

## Setup systemd
systemctl daemon-reload


# Finish section
echo "\033[37;42;1mSuccess to setup.\033[0m"
cat << EOF
Now you can start sevice with:
  sudo systemctl start mozjpeg-webui

  and access to http://localhost:8000/

If you want enable auto start:
  sudo systemctl enable mozjpeg-webui
EOF
