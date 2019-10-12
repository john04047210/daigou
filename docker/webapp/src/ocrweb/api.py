# -*- coding: utf-8 -*-

from __future__ import absolute_import, print_function

from datetime import datetime

from .models import DaigouBuyer as DBBuyer
from .models import BookStroke, OrderHistory


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

    @classmethod
    def del_buyer(cls, buyer_id):
        buyer = DBBuyer.get_buyer_by_id(buyer_id=buyer_id)
        if buyer:
            buyer.del_record(logic=False)

    @classmethod
    def new_stroke(cls, stroke_name):
        stroke_info = BookStroke(stroke_name)
        stroke_info.new_record()
        return stroke_info.to_dict()

    @classmethod
    def get_stroke_list(cls):
        rst = []
        strokes = BookStroke.get_all_list()
        for stroke in strokes:
            rst.append(stroke.to_dict())
        return rst

    @classmethod
    def get_stroke_name(cls, stroke_id):
        stroke_info = BookStroke.get_stroke_by_id(stroke_id)
        if stroke_info:
            return stroke_info.stroke_name
        return None

    @classmethod
    def upt_stroke(cls, stroke_id, **kwargs):
        stroke_info = BookStroke.get_stroke_by_id(stroke_id)
        stroke_info.stroke_name = kwargs['stroke_name'] if 'stroke_name' in kwargs else ''
        if 'tracking_number' in kwargs:
            stroke_info.tracking_number = kwargs['tracking_number']
            stroke_info.tracking_date = kwargs['tracking_date'] if 'tracking_date' in kwargs else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        stroke_info.upt_record()
        return stroke_info.to_dict()

    @classmethod
    def get_order_list(cls, stroke_id):
        rst = []
        orders = OrderHistory.get_order_list(stroke_id)
        for order in orders:
            addresses = DBBuyer.get_buyer_by_name(order.book_name)
            _address = []
            for address in addresses:
                _address.append({
                    'id': address.id,
                    'name': address.name,
                    'phone': address.phone,
                    'address': address.address
                })
            _item = {
                'id': order.id,
                'book_name': order.book_name,
                'book_goods': order.book_goods,
                'address': order.address,
                'addresses': _address
            }
            rst.append(_item)
        return rst

    @classmethod
    def get_order_list_for_download(cls, stroke_id):
        rst = []
        orders = OrderHistory.get_order_list(stroke_id)
        for order in orders:
            _item = {
                'book_name': order.book_name,
                'book_goods': order.book_goods,
                'address': order.address
            }
            rst.append(_item)
        return rst

    @classmethod
    def new_order(cls, stroke_id, book_name, book_goods):
        order = OrderHistory.get_order_by_book_name(stroke_id, book_name)
        if order:
            order.book_goods = order.book_goods + '+' + book_goods
            order.upt_record()
        else:
            order = OrderHistory()
            order.stroke_id = stroke_id
            order.book_name = book_name
            order.book_goods = book_goods
            addresses = DBBuyer.get_buyer_by_name(order.book_name)
            if addresses and len(addresses) == 1:
                address = addresses[0]
                order.address = '\n'.join((address.name+' '+address.phone, address.address))
            order.new_record()
        return order.id

    @classmethod
    def upt_order(cls, order_id, book_name, book_goods, address=None):
        order = OrderHistory.get_order_by_order_id(order_id)
        order.book_name = book_name
        order.book_goods = book_goods
        if address:
            order.address = address
        order.upt_record()
        return order.id

    @classmethod
    def upt_order_address(cls, order_id, address_id):
        order = OrderHistory.get_order_by_order_id(order_id)
        address = DBBuyer.get_buyer_by_id(address_id)
        if order and address:
            order.address = '\n'.join((address.name, address.phone, address.address))
            order.upt_record()
        return order.address
