FROM python:3.6

RUN mkdir -p /code
WORKDIR /code
COPY ./src /code

RUN pip install flask uwsgi \
    && pip install Flask-gzip pymysql \
    && pip install -e .

CMD ["uwsgi", "--ini", "/code/uwsgi.ini"]
