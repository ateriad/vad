"use strict";

let Settings = function () {
    let _init = function () {

        $(".remove-channel").on('click', function (e) {
            e.preventDefault();

            let href = $(this).attr('href');

            Swal.fire({
                title: 'آیا کانال حذف شود',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'بله حذف شود!',
                cancelButtonText: 'انصراف',
            }).then((result) => {
                if (result) {
                    $.ajax({
                        type: "DELETE",
                        url: href,
                        success: function (data) {
                            window.location.reload();
                        },
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
                }
            })
        });

        $(".create_channel_form").submit(function (e) {
            e.preventDefault();

            let form = $(this);

            $.ajax({
                type: "POST",
                url: form.attr('action'),
                data: form.serialize(),
                success: function (data) {
                    window.location.reload();
                },
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
    }

    return {
        init: function () {
            _init();
        }
    }
}();

jQuery(document).ready(function () {
    Settings.init();
});
