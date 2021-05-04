"use strict";

let Playout = function () {
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
                    $('#ad_path').val('');
                });

                this.on("success", function (file, responseText) {
                    $('#ad_path').val(responseText.path)
                });

                this.on("maxfilesexceeded", function (file) {
                    this.removeAllFiles();
                    this.addFile(file);
                });
            }
        });
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
