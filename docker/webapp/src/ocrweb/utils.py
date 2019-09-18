# -*- coding: utf-8 -*-

import os
import zipfile
from datetime import datetime

from .api import PocApi


class Utils(object):
    @classmethod
    def create_txt(cls, dev_id=0, meters=None):
        if meters:
            base_path = os.getcwd()
            zip_filename = 'meter_data_{0}_{1}.zip'.format(
                dev_id if dev_id else 'all', datetime.now().strftime('%Y%m%d%H%M%S'))
            meter_txt = {'1001': [], '1002': [], '1003': [], '1004': []}
            zip_filepath = os.path.join(base_path, 'tmp', zip_filename)
            with zipfile.ZipFile(zip_filepath, mode='w') as zf:
                for _meter in meters:
                    dev_detail = PocApi.get_record_detail(dev_id=_meter.get('dev_id'))
                    if dev_detail:
                        img_list = [(meter.get('img_url'), os.path.join(
                            base_path, 'static',
                            meter.get('img_url'))) for meter in _meter.get('meters') if meter.get('img_url')]
                        for name in img_list:
                            # current_app.logger.debug('add arching: {}'.format(name[0]))
                            zf.write(name[1], name[0], compress_type=zipfile.ZIP_DEFLATED)
                        meter_txt[str(dev_detail[0].get('dev_type'))].extend(
                            [' '.join([str(round(meter.get('value'))),
                                       meter.get('img_url')]) for meter in _meter.get('meters') if meter.get('img_url')]
                        )
                if meter_txt['1001']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1001'])
                    zf.writestr('meter_data_electric.txt', m_txt, compress_type=zipfile.ZIP_DEFLATED)
                if meter_txt['1002']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1002'])
                    zf.writestr('meter_data_water.txt', m_txt, compress_type=zipfile.ZIP_DEFLATED)
                if meter_txt['1003']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1003'])
                    zf.writestr('meter_data_gas.txt', m_txt, compress_type=zipfile.ZIP_DEFLATED)
                if meter_txt['1004']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1004'])
                    zf.writestr('meter_data_electric_digit.txt', m_txt, compress_type=zipfile.ZIP_DEFLATED)
            return zip_filepath, zip_filename
        return None, None

    @classmethod
    def create_csv(cls, dev_id=0, meters=None):
        if meters:
            base_path = os.getcwd()
            zip_filename = 'meter_data_{0}_{1}.zip'.format(
                dev_id if dev_id else 'all', datetime.now().strftime('%Y%m%d%H%M%S'))
            meter_txt = {'1001': [], '1002': [], '1003': [], '1004': []}
            zip_filepath = os.path.join(base_path, 'tmp', zip_filename)
            with zipfile.ZipFile(zip_filepath, mode='w') as zf:
                for _meter in meters:
                    dev_detail = PocApi.get_record_detail(dev_id=_meter.get('dev_id'))
                    if dev_detail:
                        img_list = [(meter.get('img_url'), os.path.join(
                            base_path, 'static',
                            meter.get('img_url'))) for meter in _meter.get('meters') if meter.get('img_url')]
                        for name in img_list:
                            # current_app.logger.debug('add arching: {}'.format(name[0]))
                            zf.write(name[1], name[0], compress_type=zipfile.ZIP_DEFLATED)
                        meter_txt[str(dev_detail[0].get('dev_type'))].extend(
                            [','.join([str(_meter.get('dev_id')), str(meter.get('se_id')), meter.get('date'),
                                       str(round(meter.get('value'))), str(meter['rawdata']['SP']),
                                       str(meter['rawdata']['SNR']), str(meter['rawdata']['RSRQ']),
                                       str(meter['rawdata']['FCN']), meter.get('img_url')
                                       ]) for meter in _meter.get('meters') if meter.get('img_url')]
                        )
                m_header = 'DevId,Se,Date,Value,SignalPower,SNR,RSRQ,EARFCN,Image\r\n'
                if meter_txt['1001']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1001'])
                    zf.writestr('meter_data_electric.csv', m_header + m_txt, compress_type=zipfile.ZIP_DEFLATED)
                if meter_txt['1002']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1002'])
                    zf.writestr('meter_data_water.csv', m_header + m_txt, compress_type=zipfile.ZIP_DEFLATED)
                if meter_txt['1003']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1003'])
                    zf.writestr('meter_data_gas.csv', m_header + m_txt, compress_type=zipfile.ZIP_DEFLATED)
                if meter_txt['1004']:
                    m_txt = '\r\n'.join(meter for meter in meter_txt['1004'])
                    zf.writestr('meter_data_electric_digit.csv', m_header + m_txt, compress_type=zipfile.ZIP_DEFLATED)
            return zip_filepath, zip_filename
        return None, None

    @classmethod
    def create_xlsx(cls, dev_id=0, meters=None):
        if meters:
            from openpyxl import Workbook
            from openpyxl.drawing.image import Image
            base_path = os.getcwd()
            zip_filename = 'meter_data_{0}_{1}.zip'.format(
                dev_id if dev_id else 'all', datetime.now().strftime('%Y%m%d%H%M%S'))
            xls_filename = 'meter_data_{0}_{1}.xlsx'.format(
                dev_id if dev_id else 'all', datetime.now().strftime('%Y%m%d%H%M%S'))
            meter_wb = Workbook()
            ws_header = ['DevId', 'Se', 'Date', 'Value', 'SignalPower', 'SNR', 'RSRQ', 'EARFCN', 'Image']
            cur_ws = meter_wb.active
            cur_ws.title = 'electric'
            cur_ws.column_dimensions['C'].width = 18
            cur_ws.column_dimensions['I'].width = 40
            cur_ws.append(ws_header)
            meter_ws_title = {'1001': 'electric', '1002': 'water', '1003': 'gas', '1004': 'electric_digit'}
            zip_filepath = os.path.join(base_path, 'tmp', zip_filename)
            xls_filepath = os.path.join(base_path, 'tmp', xls_filename)
            with zipfile.ZipFile(zip_filepath, mode='w') as zf:
                for _meter in meters:
                    dev_detail = PocApi.get_record_detail(dev_id=_meter.get('dev_id'))
                    if not dev_detail:
                        continue
                    cur_ws_title = meter_ws_title.get(str(dev_detail[0].get('dev_type')))
                    cur_ws = meter_wb[cur_ws_title] if cur_ws_title in meter_wb else None
                    if cur_ws is None:
                        cur_ws = meter_wb.create_sheet(cur_ws_title)
                        cur_ws.column_dimensions['C'].width = 18
                        cur_ws.column_dimensions['I'].width = 40
                        cur_ws.append(ws_header)
                    row_idx = 1
                    for meter in _meter.get('meters'):
                        if meter.get('img_url'):
                            img_path = os.path.join(base_path, 'static', meter.get('img_url'))
                            if not os.path.exists(img_path):
                                continue
                            row_idx = row_idx + 1
                            img = Image(img_path)
                            cur_ws.cell(row=row_idx, column=1, value=str(_meter.get('dev_id')))
                            cur_ws.cell(row=row_idx, column=2, value=str(meter.get('se_id')))
                            cur_ws.cell(row=row_idx, column=3, value=meter.get('date'))
                            cur_ws.cell(row=row_idx, column=4, value=round(meter.get('value')))
                            cur_ws.cell(row=row_idx, column=5, value=str(meter['rawdata']['SP']))
                            cur_ws.cell(row=row_idx, column=6, value=str(meter['rawdata']['SNR']))
                            cur_ws.cell(row=row_idx, column=7, value=str(meter['rawdata']['RSRQ']))
                            cur_ws.cell(row=row_idx, column=8, value=str(meter['rawdata']['FCN']))
                            cur_ws.add_image(img, 'I'+str(row_idx))
                            cur_ws.row_dimensions[row_idx].height = 82
                meter_wb.save(xls_filepath)
                zf.write(xls_filepath, xls_filename, compress_type=zipfile.ZIP_DEFLATED)
            os.remove(xls_filepath)
            return zip_filepath, zip_filename
        return None, None
