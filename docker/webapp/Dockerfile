FROM python:3.6
ENV TZ=Asia/Tokyo

RUN mkdir -p /code
WORKDIR /code
COPY ./src /code

RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
    && localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8 \
    && pip install flask uwsgi \
    && pip install Flask-gzip pymysql \
    && pip install -e .
ENV LANG=ja_JP.utf8

CMD ["uwsgi", "--ini", "/code/uwsgi.ini"]
