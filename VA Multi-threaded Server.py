from fixva import VA
import socket
from _thread import *
import requests
import json

# print_lock = threading.Lock()
def threaded(c):#c=connection
    while True:
        # data received from client
        data = c.recv(2048)
        if not data:
            print('Bye')
            # lock released on exit
            # print_lock.release()
            break

        data=data.decode('utf-8')
        data=data.split(",")
        #----------------------------
        parameters1 = {"password": data[1], "username":data[2]}
        response1 = requests.post('https://mirol.ir/api/servers/login', params=parameters1)
        print(response1.status_code)
        obj = response1.json()
        text = json.dumps(obj, sort_keys=True, indent=4)  # .loads()
        dict1 = json.loads(text)
        access_token = dict1['access_token']
        parameters2 = {"username": "takhtkeshha1"}  # '09900046642'
        url2 = 'https://mirol.ir/api/servers/get_ads_stream_info?token=' + access_token
        response2 = requests.post(url2, params=parameters2)
        text2 = json.dumps(response2.json(), sort_keys=True, indent=4)  # .loads()
        dict2 = json.loads(text2)
        stream_url_output= dict2['stream_url'] + '/' + dict2['stream_key']
        print(stream_url_output)
        #-----------input stream--------------
        url3 = 'https://mirol.ir/api/servers/get_users_info?token=' + access_token
        response3 = requests.get(url3, params=parameters2)  #
        text3 = json.dumps(response3.json(), sort_keys=True, indent=4)  # .loads()
        dict3 = json.loads(text3)
        info = dict3['info']
        num_thread = len(info)
        thread1 = dict(info[0])
        thread1_url = thread1['hls_link']

        # stream_url_output = dict2['stream_url'] + '/' + str(dict2['user_id'])#input
        #------------------------
        print(thread1_url)
        VA_ins = VA(data[0],thread1_url,stream_url_output)#**
        # servr_data=VA_ins.add_VA()
        print('Done')#
        # c.sendall(str.encode(servr_data))
        # connection closed
    c.close()


def Main():
    host = ""
    # reverse a port on your computer
    # in our case it is 12345 but it
    # can be anything
    port = 12345
    ThreadCount = 0
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((host, port))
    print("socket binded to port", port)
    # put the socket into listening mode
    s.listen(5)
    print("socket is listening")
    # a forever loop until client wants to exit
    while True:
        # establish connection with client
        c, addr = s.accept()#Client, address
        # lock acquired by client
        # print_lock.acquire()
        print('Connected to :', addr[0], ':', addr[1])

        # Start a new thread and return its identifier
        start_new_thread(threaded, (c,))
        ThreadCount += 1
        print('Thread Number: ' + str(ThreadCount))
    s.close()


if __name__ == '__main__':
    Main()