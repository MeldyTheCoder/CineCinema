FROM python:latest

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV WAIT_VERSION 2.7.2
ENV C_FORCE_ROOT=1


WORKDIR /usr/src/code

COPY ./ /usr/src/code/
RUN python -m pip --timeout=1000 install -r requirements.txt

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait