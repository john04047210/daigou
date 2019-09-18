$(function(){
    let pro_name = $('#pro_name').text();
    let dev_update_mode = null;

    $('#btn-lang-en').on('click', function(){
        $.get(pro_name+'/lang/en', function(data){
            console.log('set lang to english: ', data.msg);
            location.reload();
        });
    });
    $('#btn-lang-ja').on('click', function(){
        $.get(pro_name+'/lang/ja', function(data){
            console.log('set lang to japan: ', data.msg);
            location.reload();
        });
    });

    $('.wrapper').on('click', '#btn-refresh', function(e){
        e.preventDefault();
        location.reload();
    });

    $('.wrapper').on('click', '.btn-download', function(e){
        e.preventDefault();
        file_format = $(this).data('file_format');
        range_date = $('#range-date').val();
        dates = range_date.split(' - ');
        date_start = dates[0].split('/');
        date_end = dates[1].split('/');
        $.fileDownload(pro_name+'/api/device/download/?format='+file_format+'&start='+date_start[2]+'-'+date_start[0]+'-'+date_start[1]+' 00:00:00&end='+date_end[2]+'-'+date_end[0]+'-'+date_end[1]+' 23:59:59');
    });

    $('.wrapper').on('click', '.btn-device-new', function(e){
        e.preventDefault();
        dev_update_mode = 'new';
        $('.modal-body .form-control').each(function() {
            $(this).val('');
        });
        $('#input-devid').attr('readonly', false);
        $('#input-devrate').attr('readonly', false);
        $('#input-devtype').val('1001');
        $('.modal-title').text('追加設備');
        $('#info-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('.wrapper').on('click', '.btn-device-edit', function(e){
        e.preventDefault();
        dev_update_mode = 'edit';
        let dev_id = $(this).data('devid');
        $('#input-devid').val(dev_id);
        $('#input-devid').attr('readonly', true);
        $('#info-modal .modal-body .form-control').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                if ('dev_postcode' == post_key) {
                    let postcode = $('#'+post_key+'_'+dev_id).text();
                    if (postcode.length > 0) {
                        $('#input-devpostcode').val(postcode.substring(0, 3));
                        $('#input-devpostcode-next').val(postcode.substring(4, 8));
                    }
                } else {
                    $(this).val($('#'+post_key+'_'+dev_id).text());
                }
            }
        });
        $('.modal-title').text('編集設備');
        $('#info-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('#btn-modal-device-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let post_data = {};
        $('#info-modal .modal-body .form-control').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                if (post_data.hasOwnProperty(post_key)) {
                    let append = $(this).data('append');
                    if (append.length > 0) {
                        post_data[post_key] = post_data[post_key] + append + $(this).val();
                    } else {
                        post_data[post_key] = $(this).val();
                    }
                } else {
                    post_data[post_key] = $(this).val();
                }
            }
        });
        let http_method = 'edit' === dev_update_mode ? 'PUT' : 'POST';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#info-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#info-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('.wrapper').on('click', '.btn-device-edit-ocr', function(e){
        e.preventDefault();
        let dev_id = $(this).data('devid');
        $('#input-devid').val(dev_id);
        $('#ocr-param-modal .modal-body .form-control').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                $(this).val($('#'+post_key+'_'+dev_id).text());
            }
        });
        $('.modal-title').text('OCRパラメータ');
        $('#ocr-param-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('#btn-modal-device-ocr-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let post_data = {};
        $('#ocr-param-modal .modal-body .form-control').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                if (post_data.hasOwnProperty(post_key)) {
                    let append = $(this).data('append');
                    if (append.length > 0) {
                        post_data[post_key] = post_data[post_key] + append + $(this).val();
                    } else {
                        post_data[post_key] = $(this).val();
                    }
                } else {
                    post_data[post_key] = $(this).val();
                }
            }
        });
        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id+'/ocr_param',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#ocr-param-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#ocr-param-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('.wrapper').on('click', '.btn-device-edit-host', function(e){
        e.preventDefault();
        let dev_id = $(this).data('devid');
        $('#input-devid').val(dev_id);
        $('.modal-title').text('host setting');
        $('#host-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('#btn-modal-host-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let post_data = {};
        $('#host-modal .modal-body .form-control-host').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                if (post_data.hasOwnProperty(post_key)) {
                    let append = $(this).data('append');
                    if (append.length > 0) {
                        post_data[post_key] = post_data[post_key] + append + $(this).val();
                    } else {
                        post_data[post_key] = $(this).val();
                    }
                } else {
                    post_data[post_key] = $(this).val();
                }
            }
        });
        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/v1.0.0/device/'+dev_id+'/setting/server_host',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#ocr-param-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#ocr-param-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('#btn-camera-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let post_data = {};
        $('#host-modal .modal-body .form-control-camera').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                if (post_data.hasOwnProperty(post_key)) {
                    let append = $(this).data('append');
                    if (append.length > 0) {
                        post_data[post_key] = post_data[post_key] + append + $(this).val();
                    } else {
                        post_data[post_key] = $(this).val();
                    }
                } else {
                    post_data[post_key] = $(this).val();
                }
            }
        });
        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id+'/set_camera',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#ocr-param-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#ocr-param-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('#btn-thd-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let post_data = {};
        $('#host-modal .modal-body .form-control-ocr-thd').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                if (post_data.hasOwnProperty(post_key)) {
                    let append = $(this).data('append');
                    if (append.length > 0) {
                        post_data[post_key] = post_data[post_key] + append + $(this).val();
                    } else {
                        post_data[post_key] = $(this).val();
                    }
                } else {
                    post_data[post_key] = $(this).val();
                }
            }
        });
        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id+'/ocr_param_thd',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#ocr-param-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#ocr-param-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('#btn-ocr-mode-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let post_data = {};
        $('#host-modal .modal-body .form-control-ocr-mode').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                if (post_data.hasOwnProperty(post_key)) {
                    let append = $(this).data('append');
                    if (append.length > 0) {
                        post_data[post_key] = post_data[post_key] + append + $(this).val();
                    } else {
                        post_data[post_key] = $(this).val();
                    }
                } else {
                    post_data[post_key] = $(this).val();
                }
            }
        });
        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id+'/ocr_param_mode',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#ocr-param-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#ocr-param-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('#btn-compress-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let rtc_level = $('input[type="radio"][name="config-compress-rtc"]:checked').val();
        let proof_level = $('input[type="radio"][name="config-compress-proof"]:checked').val();
        let failed_level = $('input[type="radio"][name="config-compress-failed"]:checked').val();
        let post_data = [];
        if(rtc_level) {
            post_data.push({
                'target': 'rtc',
                'level': rtc_level
            });
        }
        if(proof_level) {
            post_data.push({
                'target': 'proof',
                'level': proof_level
            });
        }
        if(failed_level) {
            post_data.push({
                'target': 'failed',
                'level': failed_level
            });
        }
        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/v1.0.0/device/'+dev_id+'/setting/compress_image_level',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#ocr-param-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#ocr-param-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('.wrapper').on('click', '.btn-device-edit-ctrl', function(e){
        e.preventDefault();
        let dev_id = $(this).data('devid');
        $('#input-devid').val(dev_id);
        $('.modal-title').text('ctrl setting');
        $('#ctrl-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('#btn-modal-ctrl-submit').on('click', function(e){
        e.preventDefault();
        let dev_id = $('#input-devid').val();
        let post_data = {};
        let isChecked = $('#input-config-control-lock-on').attr('checked');
        post_data['config_control_lock'] = isChecked ? 1 : 0;
        isChecked = $('#input-config-control-sendimage-on').attr('checked');
        post_data['config_control_sendimage'] = isChecked ? 1 : 0;
        isChecked = $('#input-config-control-ota-on').attr('checked');
        post_data['config_control_ota'] = isChecked ? 1 : 0;
        isChecked = $('#input-config-control-log-save-on').attr('checked');
        post_data['config_control_log_save'] = isChecked ? 1 : 0;
        isChecked = $('#input-config-control-passive-send-on').attr('checked');
        post_data['config_control_passive_send'] = isChecked ? 1 : 0;
        let log_level = $('input[type="radio"][name="config_control_log_level"]:checked').val();
        if(log_level == 1) {
            post_data['config_control_log_debug'] = 1;
            post_data['config_control_log_info'] = 0;
            post_data['config_control_log_warn'] = 0;
            post_data['config_control_log_error'] = 0;
        }
        if(log_level == 2) {
            post_data['config_control_log_debug'] = 0;
            post_data['config_control_log_info'] = 0;
            post_data['config_control_log_warn'] = 1;
            post_data['config_control_log_error'] = 0;
        }
        if(log_level == 3) {
            post_data['config_control_log_debug'] = 0;
            post_data['config_control_log_info'] = 1;
            post_data['config_control_log_warn'] = 0;
            post_data['config_control_log_error'] = 0;
        }
        if(log_level == 4) {
            post_data['config_control_log_debug'] = 0;
            post_data['config_control_log_info'] = 0;
            post_data['config_control_log_warn'] = 0;
            post_data['config_control_log_error'] = 1;
        }
        let http_method = 'PUT';
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id+'/control',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $('#ocr-param-modal').modal('hide');
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#ocr-param-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });

    $('.wrapper').on('click', '.btn-device-detail', function(e){
        e.preventDefault();
        let dev_id = $(this).data('devid');
        location.href = pro_name+'/render/device/'+dev_id+'/detail';
    });

    $('.wrapper').on('click', '.btn-device-proof', function(e){
        e.preventDefault();
        let dev_id = $(this).data('devid');
        location.href = pro_name+'/render/device/'+dev_id+'/proof';
    });

    $('.wrapper').on('click', '.btn-device-remove', function(e){
        e.preventDefault();
        let dev_id = $(this).data('devid');
        $.ajax({
            method: 'DELETE',
            url: pro_name+'/api/device/'+dev_id,
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    location.reload(true);
                } else {
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#info-modal').modal('hide');
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            }
        });
    });
});