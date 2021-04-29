from suds.client import Client
from os import environ, path
from dotenv import load_dotenv

basedir = path.abspath(path.dirname(__file__) + "/..")
load_dotenv(path.join(basedir, '.env'))

SMS_CANDOO_WDSL = str(environ.get('SMS_CANDOO_WDSL'))
SMS_CANDOO_USERNAME = str(environ.get('SMS_CANDOO_USERNAME'))
SMS_CANDOO_PASSWORD = str(environ.get('SMS_CANDOO_PASSWORD'))
SMS_CANDOO_SOURCE = str(environ.get('SMS_CANDOO_SOURCE'))
SMS_CANDOO_FLASH = str(environ.get('SMS_CANDOO_FLASH'))


def send_sms(cellphone, text):
    cell = '98' + cellphone[1:]
    client = Client(SMS_CANDOO_WDSL)

    print(SMS_CANDOO_USERNAME, SMS_CANDOO_PASSWORD, SMS_CANDOO_PASSWORD, text, cellphone, SMS_CANDOO_FLASH)

    result = client.service.Send(username=SMS_CANDOO_USERNAME,
                                 password=SMS_CANDOO_PASSWORD,
                                 srcNumber=SMS_CANDOO_PASSWORD,
                                 body=text,
                                 destNo=cell,
                                 flash=SMS_CANDOO_FLASH)

    print(1111111111111111, result, result[0])
    return True
