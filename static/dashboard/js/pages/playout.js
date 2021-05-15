"use strict";

let Playout = function () {
    let submitBtnElm = $('#submit_btn');

    let inputRtmpUrlElm = $('#input_rtmp_url');
    let inputHlsUrlElm = $('#input_hls_url');
    let outputRtmpUrlElm = $('#output_stream_url');
    let outputHlsUrlElm = $('#output_hls_url');

    let inputVideoElm = $('#input_video');
    let outputVideoElm = $('#output_video');
    let inputCanvasElm = $('#input_canvas');

    let adPathElm = $('#ad_path');

    let _init = function () {
        new Dropzone("#dropzone", {
            url: $('#dropzone').data('action'),
            method: 'post',
            headers: {
                'X-CSRF-Token': $('meta[name=csrf-token]').attr('content')
            },
            paramName: "file",
            maxFiles: 1,
            timeout: 1000 * 10000,
            acceptedFiles: 'video/*,image/*',
            dictInvalidFileType: 'فایل قابل قبول نمیباشد.',
            thumbnailMethod: 'contain',
            addRemoveLinks: true,
            dictRemoveFile: '✘',
            init: function () {
                this.on('addedfile', function (file) {
                    let videosExt = ['mp4', 'avi', 'flv', 'mov', 'wmv']
                    let ext = file.name.split('.').pop();
                    if (videosExt.includes(ext) === true) {
                        $(file.previewElement).find(".dz-image img").attr("src", window.location.origin + "/static/dashboard/images/extensions/video.png");
                    }
                });

                this.on("removedfile", function (file) {
                    $('#ad_path').val('');
                    submitBtnElm.hide();
                });

                this.on("success", function (file, responseText) {
                    $('#ad_path').val(responseText.path).trigger("change");
                });

                this.on("maxfilesexceeded", function (file) {
                    this.removeAllFiles();
                    this.addFile(file);
                });
            }
        });

        $(".touchspin-vertical").TouchSpin({
            min: 0,
            max: 1000000000,
        });
    }

    let _action = function () {
        drawRect();

        function updateCoordinates(arr) {
            console.log(arr)
        }

        function drawRect() {
            let clicks = 0;
            let lastClick = [0, 0];
            let coordinates = [];

            document.getElementById('input_canvas').addEventListener('click', drawLine, false);

            function getOffsetLeft(elem) {
                let offsetLeft = 0;
                do {
                    if (!isNaN(elem.offsetLeft)) {
                        offsetLeft += elem.offsetLeft;
                    }
                } while (elem = elem.offsetParent);
                return offsetLeft;
            }

            function getOffsetTop(elem) {
                let offsetTop = 0;
                do {
                    if (!isNaN(elem.offsetTop)) {
                        offsetTop += elem.offsetTop;
                    }
                } while (elem = elem.offsetParent);
                return offsetTop;
            }

            function getCursorPosition(e) {
                let x;
                let y;

                if (e.pageX !== undefined && e.pageY !== undefined) {
                    x = e.pageX;
                    y = e.pageY;
                } else {
                    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }

                return [x, y];
            }

            function drawLine(e) {
                let context = this.getContext('2d');

                let x = getCursorPosition(e)[0] - getOffsetLeft(this);
                let y = getCursorPosition(e)[1] - getOffsetTop(this);

                if (clicks === 0) {
                    clicks++;
                    coordinates = [];
                    context.clearRect(0, 0, this.width, this.height);

                } else if (clicks === 3) {
                    context.beginPath();
                    context.moveTo(lastClick[0], lastClick[1]);
                    context.lineTo(x, y);
                    context.lineTo(coordinates[0][0], coordinates[0][1]);
                    context.strokeStyle = '#01052a';
                    context.lineWidth = 4;
                    context.stroke();

                    clicks = 0;
                } else {
                    context.beginPath();
                    context.moveTo(lastClick[0], lastClick[1]);
                    context.lineTo(x, y);
                    context.strokeStyle = '#01052a';
                    context.lineWidth = 4;
                    context.stroke();

                    clicks++;
                }

                lastClick = [x, y];
                coordinates.push(lastClick)

                if (clicks === 0) {
                    updateCoordinates(coordinates)
                }
            }
        }

        function isOdd(num) {
            return num % 2;
        }

        function showInputVideo(inputHls) {
            inputVideoElm.css('display', 'block')

            let player = videojs('input_video', {autoplay: 'any', muted: true});

            // player.src({
            //     src: inputHls,
            //     type: 'application/x-mpegURL',
            //     withCredentials: false
            // });

            player.src({
                src: 'https://dragbox.ir/storage/2/tennis_30.mp4',
            });

            player.on('loadeddata', function () {
                inputCanvasElm.show()

                const my_video = document.getElementById('input_video').getElementsByTagName('video')[0];
                const canvas = window.canvas = document.querySelector('#input_canvas');

                let style = window.getComputedStyle(canvas.parentElement, null);
                let parentWidth = canvas.parentElement.offsetWidth
                    - parseInt(style.getPropertyValue("padding-left"))
                    - parseInt(style.getPropertyValue("padding-right"));

                canvas.width = isOdd(parentWidth) ? parentWidth + 1 : parentWidth;
                canvas.height = (my_video.videoHeight * canvas.width) / my_video.videoWidth;

                // (function loop() {
                //     if (!my_video.paused && !my_video.ended) {
                //         canvas.getContext('2d').drawImage(my_video, 0, 0, canvas.width, canvas.height);
                //
                //         setTimeout(loop, 1000 / 30); // drawing at 30fps
                //     }
                // })();
            });
        }

        inputHlsUrlElm.on('change', function () {
            let inputHls = inputHlsUrlElm.val();

            if (inputHls !== '') {
                showInputVideo(inputHls)
            }
        })


        $('#form').on('submit', function (e) {
            let inputRtmp = inputRtmpUrlElm.val();
            let inputHls = inputHlsUrlElm.val();
            let outputRtmp = outputRtmpUrlElm.val();
            let outputHls = outputHlsUrlElm.val();
            let ad_path = adPathElm.val();

            e.preventDefault();

            let form = $(this);
            let url = form.attr('action');

            $.ajax({
                type: "POST",
                url: url,
                data: form.serialize(),
                success: function (data) {
                    console.log(data);
                }
            });
        });
    }

    return {
        init: function () {
            _init();
            _action();
        }
    }
}();

jQuery(document).ready(function () {
    Playout.init();
});
