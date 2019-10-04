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

    $('.wrapper').on('click', '.btn-buyer-new', function(e){
        e.preventDefault();
        dev_update_mode = 'new';
        $('.modal-body .form-control').each(function() {
            $(this).val('');
        });
        $('#input-buyer-id').attr('readonly', true);
        $('.modal-title').text('添加收件人信息');
        $('#info-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('.wrapper').on('click', '.btn-buyer-edit', function(e){
        e.preventDefault();
        dev_update_mode = 'edit';
        let buyerid = $(this).data('buyerid');
        $('#input-buyer-id').val(buyerid);
        $('#input-buyer-id').attr('readonly', true);
        $('#info-modal .modal-body .form-control').each(function() {
            let post_key = $(this).data('post_key');
            if (post_key.length > 0) {
                $(this).val($('#'+post_key+'_'+dev_id).text());
            }
        });
        $('.modal-title').text('編集收件人信息');
        $('#info-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('#btn-modal-submit').on('click', function(e){
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
});