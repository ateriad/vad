"use strict";

let Settings = function () {
    let _init = function () {
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
