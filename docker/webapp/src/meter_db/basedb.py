# -*- coding: utf-8 -*-

from __future__ import absolute_import, print_function

from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, String, Integer


class TimestampMixin(object):
    """Timestamp model mix-in with fractional seconds support."""
    created = Column(DateTime, nullable=False, default=datetime.now)
    """Creation timestamp."""

    updated = Column(DateTime, nullable=False, default=datetime.now,
                     onupdate=datetime.now)
    """Updated timestamp."""

    status = Column(String(1), nullable=False, default='N', onupdate='U')
    """Updated timestamp."""


class DaigouBuyer(TimestampMixin):
    """ 客户信息 收件地址 """
    __tablename__ = 'daigou_buyer'

    id = Column(Integer(), primary_key=True)
    name = Column(String(32), index=True, nullable=False, comment='收件人姓名')
    phone = Column(String(11), index=True, nullable=False, comment='收件人电话')
    wx_name = Column(String(32), nullable=True, default='', comment='收件人微信昵称')
    address = Column(String(254), nullable=False, default='', comment='收件人地址')
    post_code = Column(String(32), nullable=True, default='', comment='收件人邮编')

    def __init__(self, name=None, phone=None, dev_rate=1.0, dev_rawdata='{}'):
        self.name = name
        self.phone = phone


class User(TimestampMixin):
    __tablename__ = 'user'

    id = Column(Integer(), primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(32), nullable=False)
    nickname = Column(String(64), nullable=True, default='')
    portrait = Column(String(255), nullable=True, default='')
    """head image"""
    active = Column(Boolean(name='active'), default=False)
    admin = Column('admin', Boolean(name='admin'), default=False)
