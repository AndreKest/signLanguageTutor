FROM python:3.10-bullseye

WORKDIR workdir

RUN apt-get update && apt-get install -y ffmpeg libsm6 libxext6

COPY requirements.txt requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt
COPY . .
EXPOSE 5000

CMD ["gunicorn", "--config", "gunicorn_config.py", "main:app"]