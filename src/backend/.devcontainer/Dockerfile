FROM python:3.10-bullseye

WORKDIR workdir

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip &&\
    pip install -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

CMD ["bin/bash"]