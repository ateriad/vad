import socket

def Main():
    # local host IP '127.0.0.1'
    host = '127.0.0.1'
    # Define the port on which you want to connect
    port = 12345

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    print('Waiting for connection to server')
    try:
        # connect to server on local computer
        s.connect((host, port))
    except socket.error as e:
        print(str(e))

    # message you send to server
    logo_message ='F:/webm/machine.webm'
    # video_message="F:/tennis.mp4"
    password="hGk8WUy6hP"
    username="n.takhtkeshha@ateriad.ir"
    client_message=logo_message + ',' + password+',' +username
    # client_message = logo_message + ',' + video_message + ',' + output_message
    while True:

        # message sent to server
        s.send(str.encode(client_message))
        # s.send(str.encode(logo_message))
        # messaga received from server
        # res=s.recv(1024)
        # print('serever response:output directory:',res.decode('utf-8'))
        # ask the client whether he wants to continue
        ans = input('\nDo you want to continue(y/n) :')
        if ans == 'y':
            continue
        else:
            break
    # close the connection
    s.close()


if __name__ == '__main__':
    Main()