$(document).on('ajaxStart', function () {
    $('button').attr("disabled", true);
}).on('ajaxStop', function () {
    $('button').attr("disabled", false);
});

function collapseSidebar() {
    var body = $("body"),
        mainMenu = $(".main-menu"),
        toggleIcon = $(".toggle-icon");

    if ($(body).hasClass("menu-expanded")) {
        body.removeClass("menu-expanded").addClass("menu-collapsed");
        mainMenu.removeClass("expanded");
        mainMenu.find(".sidebar-group-active").removeClass("open").addClass("menu-collapsed-open");
        toggleIcon.removeClass("bx bx-disc").addClass("bx bx-circle");

    } else {
        body.removeClass("menu-collapsed").addClass("menu-expanded");
        mainMenu.find(".sidebar-group-active").addClass("open");
        toggleIcon.removeClass("bx bx-circle").addClass("bx bx-disc");
    }
}

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

function customAlertModal(config) {
    let confirmBtn = $('#custom_alert_modal_confirm_button');
    let cancelBtn = $('#custom_alert_modal_cancel_button');
    let closeBtn = $('#custom_alert_modal_close_button');
    let header = $('#custom_alert_modal .modal-header');
    let title = $('#custom_alert_modal_title').html('');
    let body = $('#custom_alert_modal .modal-body').html('');
    confirmBtn.addClass('d-none').off('click');
    cancelBtn.addClass('d-none').off('click');
    closeBtn.removeClass('d-none').off('click');
    confirmBtn.find('span').html(confirmBtn.attr('data-text'));
    cancelBtn.find('span').html(cancelBtn.attr('data-text'));
    closeBtn.find('span').html(closeBtn.attr('data-text'));

    if (config.title !== undefined) {
        title.html(config.title)
    }
    if (config.text !== undefined) {
        body.html(config.text);
    }

    if (config.type === 'error') {
        header.attr('class', 'modal-header bg-danger white');
    } else if (config.type === 'success') {
        header.attr('class', 'modal-header bg-success white');
    } else if (config.type === 'info') {
        header.attr('class', 'modal-header bg-primary white');
    } else {
        header.attr('class', 'modal-header bg-dark white');
    }


    if (config.showConfirmButton === true) {
        confirmBtn.removeClass('d-none')
    }
    if (config.showCancelButton === true) {
        cancelBtn.removeClass('d-none')
    }
    if (config.showCloseButton === false) {
        cancelBtn.addClass('d-none')
    }

    if (config.confirmButtonText !== undefined) {
        confirmBtn.find('span').html(config.confirmButtonText)
    }
    if (config.cancelButtonText !== undefined) {
        cancelBtn.find('span').html(config.cancelButtonText)
    }
    if (config.closeButtonText !== undefined) {
        cancelBtn.find('span').html(config.closeButtonText)
    }

    if (config.onConfirm !== undefined) {
        confirmBtn.on('click', config.onConfirm)
    }
    if (config.onCancel !== undefined) {
        cancelBtn.on('click', config.onCancel)
    }
    if (config.onClose !== undefined) {
        confirmBtn.on('click', config.onClose)
    }

    $('#custom_alert_modal').modal('show')
}

let successSession = $("meta[name=success]").attr("content");
if (successSession !== undefined && successSession !== '') {
    successToastr(successSession)
}

let errorSession = $("meta[name=error]").attr("content");
if (errorSession !== undefined && errorSession !== '') {
    errorToastr(errorSession)
}
