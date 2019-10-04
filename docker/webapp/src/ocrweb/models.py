# -*- coding: utf-8 -*-

from __future__ import absolute_import, print_function

from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import asc, desc

from .database import db


class DataBaseOptMixin(object):
    def new_record(self):
        with db.session.begin_nested():
            db.session.add(self)
        db.session.commit()
        return self

    def upt_record(self):
        with db.session.begin_nested():
            db.session.merge(self)
        db.session.commit()
        return self

    def del_record(self, logic=True):
        with db.session.begin_nested():
            if logic:
                self.status = 'D'
                db.session.merge(self)
            else:
                db.session.remove(self)
        db.session.commit()
        return self


class TimestampMixin(object):
    """Timestamp model mix-in with fractional seconds support."""
    created = db.Column(db.DateTime, nullable=False, default=datetime.now)
    """Creation timestamp."""

    updated = db.Column(db.DateTime, nullable=False, default=datetime.now,
                     onupdate=datetime.now)
    """Updated timestamp."""

    status = db.Column(db.String(1), nullable=False, default='N', onupdate='U')
    """Updated timestamp."""


class DaigouBuyer(db.Model, TimestampMixin, DataBaseOptMixin):
    """ 客户信息 收件地址 """
    __tablename__ = 'daigou_buyer'

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(32), index=True, nullable=False, comment='收件人姓名')
    phone = db.Column(db.String(11), index=True, nullable=False, comment='收件人电话')
    wx_name = db.Column(db.String(32), nullable=True, default='', comment='收件人微信昵称')
    address = db.Column(db.String(254), nullable=False, default='', comment='收件人地址')
    post_code = db.Column(db.String(32), nullable=True, default='', comment='收件人邮编')

    def __init__(self, name=None, phone=None, dev_rate=1.0, dev_rawdata='{}'):
        self.name = name
        self.phone = phone

    def __str__(self):
        return '<user info name:{name}(wx_name) phone:{phone} address:{add}>'.format(
            name=self.name, wx_name=self.wx_name, phone=self.phone, add=self.address)

    __repr__ = __str__

    def to_dict(self):
        return dict(
            id=self.id,
            name=self.name,
            phone=self.phone,
            wx_name=self.wx_name,
            address=self.address,
            post_code=self.post_code
        )

    @classmethod
    def get_all_buyer(cls, **kwargs):
        return cls.query.filter(cls.status.in_(('N', 'U'))).all()

    @classmethod
    def get_buyer_by_id(cls, buyer_id=None, **kwargs):
        assert buyer_id
        return cls.query.filter_by(id=buyer_id).one_or_none()

    @classmethod
    def get_buyer_by_name(cls, buyer_name=None, **kwargs):
        assert buyer_name
        rule = '%'+buyer_name+'%'
        return cls.query.filter(cls.name.like(rule)).all()

    @classmethod
    def get_buyer_by_phone(cls, buyer_phone=None, **kwargs):
        assert buyer_phone
        return cls.query.filter_by(phone=buyer_phone).one_or_none()


class User(db.Model, TimestampMixin, UserMixin):
    __tablename__ = 'user'

    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(32), nullable=False)
    nickname = db.Column(db.String(64), nullable=True, default='')
    portrait = db.Column(db.String(255), nullable=True, default='')
    """head image"""
    active = db.Column(db.Boolean(name='active'), default=False)
    admin = db.Column('admin', db.Boolean(name='admin'), default=False)

    @property
    def is_active(self):
        return True if self.active else False

    @property
    def is_admin(self):
        return True if self.admin else False

    @property
    def name(self):
        return self.nickname if self.nickname else self.email[:self.email.find('@')]

    @classmethod
    def get_user_by_uid(cls, uid):
        if uid:
            sql = cls.query.filter_by(id=uid)
            return sql.one_or_none()
        return None

    @classmethod
    def get_user_by_email(cls, email):
        if email:
            sql = cls.query.filter_by(email=email)
            return sql.one_or_none()
        return None

    def add_new_user(self):
        """
        Add new user info
        :return:
        """
        assert self.email
        assert self.password
        with db.session.begin_nested():
            db.session.add(self)
        db.session.commit()
        return self

    def upt_cur_user(self):
        """
        Update user info
        :return:
        """
        with db.session.begin_nested():
            db.session.merge(self)
        db.session.commit()
        return self

    def del_cur_user(self):
        """
        Update user info
        :return:
        """
        with db.session.begin_nested():
            db.session.delete(self)
        db.session.commit()
        return self
