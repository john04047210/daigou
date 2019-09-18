# -*- coding: utf-8 -*-

import os

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
POC_SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://{db_user}:{db_pwd}@{db_host}/{db_name}'.format(
    db_user=DB_USER, db_pwd=DB_PASSWORD, db_host=DB_HOST, db_name=DB_NAME)
