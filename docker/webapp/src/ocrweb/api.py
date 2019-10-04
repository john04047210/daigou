# -*- coding: utf-8 -*-

from __future__ import absolute_import, print_function

from .models import DaigouBuyer as DBBuyer


class PocApi:
    @classmethod
    def get_all_buyer(cls):
        """ return all buyer info """
        rst = []
        buyers = DBBuyer.get_all_buyer()
        for buyer in buyers:
            rst.append(buyer.to_dict())
        return rst

    @classmethod
    def new_buyer(cls, **kwargs):
        buyer = DBBuyer(name=kwargs['name'], phone=kwargs['phone'])
        buyer.wx_name = kwargs['wx_name'] if 'wx_name' in kwargs else ''
        buyer.address = kwargs['address'] if 'address' in kwargs else ''
        buyer.post_code = kwargs['post_code'] if 'post_code' in kwargs else ''
        buyer.new_record()
        return buyer.to_dict()

    @classmethod
    def upt_buyer(cls, buyer_id, **kwargs):
        buyer = DBBuyer.get_buyer_by_id(buyer_id=buyer_id)
        buyer.name = kwargs['name'] if 'name' in kwargs else ''
        buyer.phone = kwargs['phone'] if 'phone' in kwargs else ''
        buyer.wx_name = kwargs['wx_name'] if 'wx_name' in kwargs else ''
        buyer.address = kwargs['address'] if 'address' in kwargs else ''
        buyer.post_code = kwargs['post_code'] if 'post_code' in kwargs else ''
        buyer.upt_record()
        return buyer.to_dict()
