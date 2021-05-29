"use strict";

let Playout = function () {
    let submitBtnElm = $('#submit_btn');
    let stopBtnElm = $('#stop_btn');

    let inputRtmpUrlElm = $('#input_rtmp_url');
    let inputHlsUrlElm = $('#input_hls_url');
    let outputRtmpUrlElm = $('#output_rtmp_url');
    let outputHlsUrlElm = $('#output_hls_url');

    let inputVideoElm = $('#input_video');
    let outputVideoElm = $('#output_video');
    let inputCanvasElm = $('#input_canvas');

    let cTlXElm = $('#coordinate_tl_x');
    let cTlYElm = $('#coordinate_tl_y');

    let cBlXElm = $('#coordinate_bl_x');
    let cBlYElm = $('#coordinate_bl_y');

    let cTrXElm = $('#coordinate_tr_x');
    let cTrYElm = $('#coordinate_tr_y');

    let cBrXElm = $('#coordinate_br_x');
    let cBrYElm = $('#coordinate_br_y');

    let factor = 1;

    let adPathElm = $('#ad_path');

    let _init = function () {
        let myDropzone = new Dropzone("#dropzone", {
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
                    this.removeAllFiles();
                    $('#ad_path').val('');
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

        if (default_image !== '') {
            let mockFile = {
                name: default_image,
                size: 0
            };

            myDropzone.options.addedfile.call(myDropzone, mockFile);
            myDropzone.files.push(mockFile);
            myDropzone.options.thumbnail.call(myDropzone, mockFile,
                window.location.protocol + "//" + window.location.host + '/static/files/' + default_image);
            myDropzone.emit("complete", mockFile);
            // myDropzone.options.maxFiles = myDropzone.options.maxFiles - 1;
        }

        $(".touchspin-vertical").TouchSpin({
            min: 0,
            max: 1000000000,
        });


        $('.set_input_channel').on('click', function () {
            let rtmp = $(this).attr('data-rtmp');
            let hls = $(this).attr('data-hls');

            inputRtmpUrlElm.val(rtmp)
            inputHlsUrlElm.val(hls).trigger('change')
        })

        $('.set_output_channel').on('click', function () {
            let rtmp = $(this).attr('data-rtmp');
            let hls = $(this).attr('data-hls');

            outputRtmpUrlElm.val(rtmp)
            outputHlsUrlElm.val(hls).trigger('change')
        })

    }

    let _action = function () {
        drawRect();

        function updateCoordinates(arr) {
            arr.sort(function (a, b) {
                return a[0] - b[0];
            });

            let l1 = arr[0]
            let l2 = arr[1]
            let r1 = arr[2]
            let r2 = arr[3]

            if (l1[1] < l2[1]) {
                cTlXElm.val(Math.round(l1[0] * factor))
                cTlYElm.val(Math.round(l1[1] * factor))

                cBlXElm.val(Math.round(l2[0] * factor))
                cBlYElm.val(Math.round(l2[1] * factor))
            } else {
                cTlXElm.val(Math.round(l2[0] * factor))
                cTlYElm.val(Math.round(l2[1] * factor))

                cBlXElm.val(Math.round(l1[0] * factor))
                cBlYElm.val(Math.round(l1[1] * factor))
            }

            if (r1[1] < r2[1]) {
                cTrXElm.val(Math.round(r1[0] * factor))
                cTrYElm.val(Math.round(r1[1] * factor))

                cBrXElm.val(Math.round(r2[0] * factor))
                cBrYElm.val(Math.round(r2[1] * factor))
            } else {
                cTrXElm.val(Math.round(r2[0] * factor))
                cTrYElm.val(Math.round(r2[1] * factor))

                cBrXElm.val(Math.round(r1[0] * factor))
                cBrYElm.val(Math.round(r1[1] * factor))
            }

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

        $('#coordinate_tl_x, #coordinate_tl_y, #coordinate_bl_x, #coordinate_bl_y, #coordinate_tr_x, #coordinate_tr_y, #coordinate_br_x, #coordinate_br_y').on('change', function () {

            let tlxC = cTlXElm.val();
            let tlyC = cTlYElm.val();

            let blxC = cBlXElm.val();
            let blyC = cBlYElm.val();

            let trxC = cTrXElm.val();
            let tryC = cTrYElm.val();

            let brxC = cBrXElm.val();
            let bryC = cBrYElm.val();

            if (tlxC !== '' && tlyC !== '' && blxC !== '' && blyC !== ''
                && trxC !== '' && tryC !== '' && brxC !== '' && bryC !== '') {

                let canvas = document.getElementById('input_canvas');
                let context = canvas.getContext('2d');

                context.clearRect(0, 0, canvas.width, canvas.height);

                context.beginPath();
                context.moveTo(Math.round(tlxC / factor), Math.round(tlyC / factor));
                context.lineTo(Math.round(blxC / factor), Math.round(blyC / factor));
                context.lineTo(Math.round(brxC / factor), Math.round(bryC / factor));
                context.lineTo(Math.round(trxC / factor), Math.round(tryC / factor));
                context.lineTo(Math.round(tlxC / factor), Math.round(tlyC / factor));
                context.strokeStyle = '#01052a';
                context.lineWidth = 4;
                context.stroke();
            }
        })

        function isOdd(num) {
            return num % 2;
        }

        function showInputVideo(inputHls) {
            inputVideoElm.css('display', 'block')

            let inputPlayer = videojs('input_video', {autoplay: 'any', muted: true});

            inputPlayer.src({
                src: inputHls,
                type: 'application/x-mpegURL',
                withCredentials: false
            });

            // inputPlayer.src({
            //     src: 'https://dragbox.ir/storage/2/tennis_30.mp4',
            // });

            inputPlayer.on('loadeddata', function () {
                inputCanvasElm.show()

                const my_video = document.getElementById('input_video').getElementsByTagName('video')[0];
                const canvas = window.canvas = document.querySelector('#input_canvas');

                let style = window.getComputedStyle(canvas.parentElement, null);
                let parentWidth = canvas.parentElement.offsetWidth
                    - parseInt(style.getPropertyValue("padding-left"))
                    - parseInt(style.getPropertyValue("padding-right"));

                canvas.width = isOdd(parentWidth) ? parentWidth + 1 : parentWidth;
                factor = my_video.videoWidth / canvas.width;

                canvas.height = my_video.videoHeight / factor;
            });
        }

        inputHlsUrlElm.on('change', function () {
            let value = this.value;

            if (value !== '') {
                showInputVideo(value)
            }
        }).trigger('change')

        function showOutputVideo(outputHls) {
            outputVideoElm.css('display', 'block')

            let outputPlayer = videojs('output_video', {autoplay: 'any', muted: true});

            outputPlayer.src({
                src: outputHls,
                type: 'application/x-mpegURL',
                withCredentials: false
            });

            // outputPlayer.src({
            //     src: 'https://dragbox.ir/storage/2/tennis_30.mp4',
            // });
        }

        outputHlsUrlElm.on('change', function () {
            let value = this.value;

            if (value !== '') {
                showOutputVideo(value)
            }
        }).trigger('change')


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
                    submitBtnElm.hide();
                    stopBtnElm.show();
                    successToastr(data['message']);
                }
            }).fail(e => {
                if (e.status === 422) {
                    let errors = e['responseJSON']['errors'];
                    for (let i in errors) {
                        errorToastr(errors[i])
                    }
                } else {
                    errorToastr(e['responseJSON']['message'])
                }
            });
        });

        stopBtnElm.on('click', function () {
              $.ajax({
                type: "POST",
                url: stopStreamUrl,
                success: function (data) {
                   window.location.reload()
                }
            }).fail(e => {
                if (e.status === 422) {
                    let errors = e['responseJSON']['errors'];
                    for (let i in errors) {
                        errorToastr(errors[i])
                    }
                } else {
                    errorToastr(e['responseJSON']['message'])
                }
            });
        })
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
