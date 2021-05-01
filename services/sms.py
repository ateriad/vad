from suds.client import Client
from os import environ

SMS_CANDOO_WDSL = environ.get('SMS_CANDOO_WDSL')
SMS_CANDOO_USERNAME = environ.get('SMS_CANDOO_USERNAME')
SMS_CANDOO_PASSWORD = environ.get('SMS_CANDOO_PASSWORD')
SMS_CANDOO_SOURCE = environ.get('SMS_CANDOO_SOURCE')
SMS_CANDOO_FLASH = environ.get('SMS_CANDOO_FLASH')


def send_sms(cellphone, text):
    client = Client(SMS_CANDOO_WDSL)

    result = client.service.Send(username=SMS_CANDOO_USERNAME,
                                 password=SMS_CANDOO_PASSWORD,
                                 srcNumber=SMS_CANDOO_SOURCE,
                                 body=text,
                                 destNo=['98' + cellphone[1:]],
                                 flash=SMS_CANDOO_FLASH)

    return result[0].ID
