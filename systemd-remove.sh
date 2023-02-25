#!/bin/sh

SRC_DIR="/opt/mozjpeg-webui/"
SERVICE_FILE="/etc/systemd/system/mozjpeg-webui.service"

# Requirements checking section
## Is root user
if [ `whoami` != "root" ]; then
  echo "Root permission required." > /dev/stderr
  exit 1
fi


# Removing section
## Systemd service stopp and remove
if [ -e "$SERVICE_FILE" ]; then
  systemctl stop mozjpeg-webui
  systemctl disable mozjpeg-webui
  rm $SERVICE_FILE
  systemctl daemon-reload
else
  echo "\033[0;31mNo service file.\033[0m"
fi

## Source remove
if [ -e "$SRC_DIR" ]; then
  rm -r /opt/mozjpeg-webui/
else
  echo "\033[0;31mNo source file.\033[0m"
fi


# Finish section
echo "\033[37;42;1mSuccess to remove.\033[0m"
