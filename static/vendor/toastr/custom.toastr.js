function successToastr(title = '', text = '') {
    toastr.success(text, title, {
        rtl: true,
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-bottom-left',
    });
}

function infoToastr(title = '', text = '') {
    toastr.info(text, title, {
        rtl: true,
        closeButton: true,
        positionClass: 'toast-bottom-left',
    });
}

function warningToastr(title = '', text = '') {
    toastr.warning(text, title, {
        rtl: true,
        closeButton: true,
        positionClass: 'toast-bottom-left',
    });
}

function errorToastr(title = '', text = '') {
    toastr.error(text, title, {
        rtl: true,
        closeButton: true,
        positionClass: 'toast-bottom-left',
    });
}
