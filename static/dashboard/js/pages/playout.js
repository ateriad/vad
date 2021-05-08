"use strict";

let Playout = function () {

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

    let startBtnElm = $('#start_btn');

    let inputStreamUrlElm = $('#input_stream_url');
    let outputStreamUrlElm = $('#output_stream_url');
    let adPathElm = $('#ad_path');

    $('#input_stream_url, #output_stream_url, #ad_path').on('change', function () {
        let input = inputStreamUrlElm.val();
        let output = outputStreamUrlElm.val();
        let ad_path = adPathElm.val();

        if (input !== '' && output !== '' && ad_path !== '') {
            inputStreamUrlElm.hide();
            outputStreamUrlElm.hide();

            startBtnElm.show();


        } else {
            startBtnElm.hide();
        }

    })

    let _init = function () {

    }

    return {
        init: function () {

            _init();
        }
    }
}();

jQuery(document).ready(function () {
    Playout.init();
});
