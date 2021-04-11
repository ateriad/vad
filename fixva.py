import cv2
import numpy as np
from PIL import Image
import subprocess
from matplotlib import pyplot as plt


# ___________Define Main Class for Virtual Advertising _________________________________________
class VA(object):
    def __init__(self, logo_dir, video_dir,o_rtmp_url):#, pts2  output_dir,
        self.logo_dir = logo_dir
        self.video_dir = video_dir
        self.o_rtmp_url=o_rtmp_url
        # self.pts2=pts2

    def add_VA(self):
        # ----------reading video and setting video writer--------------------------
        # rtmp_url = #'rtmp://mirol.broad-band.ir:1935/live/137410'
        # 'rtmp://mirol.broad-band.ir:1935/live/4472b121ee1b8da33284d97977e80606' ***
        cap = cv2.VideoCapture(self.video_dir)
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        command = ['ffmpeg',
                   '-y',
                   '-f', 'rawvideo',
                   '-vcodec', 'rawvideo',
                   '-pix_fmt', 'bgr24',
                   '-s', "{}x{}".format(width, height),
                   '-r', str(fps),
                   '-i', '-',
                   '-c:v', 'libx264',
                   '-pix_fmt', 'yuv420p',
                   '-preset', 'ultrafast',
                   '-f', 'flv',
                   self.o_rtmp_url]
        fps1 = cap.get(cv2.CAP_PROP_FPS)  # frame per second
        # output_dir = 'results/r6'
        # out = cv2.VideoWriter(self.output_dir + '.avi',
        #                       cv2.VideoWriter_fourcc(*'MJPG'),  # *'mp4v'
        #                       fps1, (int(cap.get(3)), int(cap.get(4))))

        p = subprocess.Popen(command, stdin=subprocess.PIPE)
        cap2 = cv2.VideoCapture(self.logo_dir)
        ret2 = cap2.grab()
        ret, logo = cap2.retrieve()
        h1, w1 = logo.shape[:2]
        pts1 = np.float32([[0, 0], [w1, 0], [0, h1], [w1, h1]])
        pts2=np.array([[475,472],[654,467],[481,535],[681,530]])#self.pts2

        # -------Adding Advertise-----------
        # -------Adding Advertise-Step1:detecting players and moving objects-----------
        backSub = cv2.createBackgroundSubtractorMOG2(128, cv2.THRESH_BINARY, 1)
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))

        while True:
            ret, frame = cap.read()
            ret, logo = cap2.read()
            #_____________________________
            # logo = cv2.cvtColor(logo, cv2.COLOR_BGR2RGB)
            # lab = cv2.cvtColor(logo, cv2.COLOR_BGR2LAB)
            # l, a, b = cv2.split(lab)
            # clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
            # cl = clahe.apply(l)
            # limg = cv2.merge((cl, a, b))
            # logo= cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
            #------------------
            height, width = frame.shape[:2]
            fgMask = backSub.apply(frame)
            fgMask = cv2.morphologyEx(fgMask, cv2.MORPH_OPEN, kernel)
            fgMask[fgMask == 127] = 0
            mask_inv = fgMask
            mask = cv2.bitwise_not(mask_inv)
            img_bg = cv2.bitwise_and(frame, frame, mask=mask)
            img_fg = cv2.bitwise_and(frame, frame, mask=mask_inv)
            # -------Adding Advertise-Step2:Warping Advertise-----------
            h, mask = cv2.findHomography(pts1, pts2, cv2.RANSAC, 2)
            logo_w = cv2.warpPerspective(logo, h, (width, height))  # logo2
            #--------------

            #-------------------
            # final2=cv2.addWeighted(logo_w, 0.2,img_bg,1, 0,img_bg)#****
            # final2=cv2.addWeighted(logo_w, 1.7, img_bg, 0.1, 1.6) #good idea
            # final2=cv2.addWeighted(logo_w, 1.7, img_bg, 0.1, 1.6) #good idea
            final2 = cv2.bitwise_and(img_bg,logo_w)#10* #ORIGINAL
            final2 = cv2.add(final2,img_bg)
            res = cv2.add(final2,img_fg)
            #--------------------------------------
            # res= cv2.addWeighted(final2, 0.2,img_fg, 0.8, 0,img_fg)
            #-------------------------------------
            p.stdin.write(res.tobytes())
            # out.write(res)
            # frameS = cv2.resize(frame, (650, 500))
            #
            # resS = cv2.resize(res, (650, 500))
            # cv2.imshow('Original frame', frameS)
            # cv2.imshow('Output frame', resS)
            # k = cv2.waitKey(2)  # 10
            # if k == ord('q') or k == 27:
            #     break

        # cap.release()
        out.release()
        # cv2.destroyAllWindows()



        #vlc:https://mirol.broad-band.ir/live/3dea6b598a16b33/index.m3u8