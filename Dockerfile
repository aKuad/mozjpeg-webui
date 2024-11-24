# mozjpeg building stage
FROM buildpack-deps AS build

WORKDIR /home/build
RUN apt update
RUN apt install -y wget cmake nasm
RUN wget -O - https://github.com/mozilla/mozjpeg/archive/refs/tags/v4.1.1.tar.gz | tar -xz -C ./

WORKDIR /home/build/mozjpeg-4.1.1
RUN cmake -G"Unix Makefiles" -DPNG_SUPPORTED=0 ./
RUN make -j5 jpegtran-static
# Only jpegtran is necessary, then static linked executable is easy to setup


# Production deployment stage
FROM python:3.13-slim

WORKDIR /home/mozjpeg-webui
COPY --from=build /home/build/mozjpeg-4.1.1/jpegtran-static /opt/mozjpeg/bin/jpegtran
COPY assets/requirements.txt /home/mozjpeg-webui/requirements.txt
COPY src /home/mozjpeg-webui/src
RUN pip install -r requirements.txt

WORKDIR /home/mozjpeg-webui/src
CMD ["python3", "main.py"]
