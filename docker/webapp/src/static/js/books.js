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
        let file_format = $(this).data('file_format');
        let stroke_id = $('#stroke_list').val();
        $.fileDownload(pro_name+'/api/download/orders?format='+file_format+'&stroke_id='+stroke_id);
    });

    $('.wrapper').on('click', '.btn-stroke-add', function(e){
        e.preventDefault();
        $('.stroke-list').addClass('d-none');
        $('.stroke-new').removeClass('d-none');
        $('.btn-stroke-add').addClass('d-none');
        $('.btn-stroke-edit').addClass('d-none');
        $('.btn-stroke-submit').removeClass('d-none');
    });

    $('.wrapper').on('click', '.btn-stroke-submit', function(e){
        e.preventDefault();
        let post_url = pro_name+'/api/stroke';
        let post_data = {
            'name': $('#input-stroke-name').val()
        }
        $.ajax({
            method: 'POST',
            url: post_url,
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

    $('.wrapper').on('click', '.btn-goods-new', function(e){
        e.preventDefault();
        dev_update_mode = 'new';
        $('.modal-body .form-control').each(function() {
            $(this).val('');
        });
        $('#input-book-id').attr('readonly', true);
        $('.modal-title').text('添加新订单');
        $('#info-modal').modal({
            'backdrop': 'static',
            'keyboard': false,
            'show': true
        });
    });

    $('.wrapper').on('click', '.btn-goods-delete', function(e){
        e.preventDefault();
        let goodsid = $(this).data('goodsid');
        let post_url = pro_name+'/api/order/'+goodsid;
        $.ajax({
            method: 'DELETE',
            url: post_url,
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

    $('.wrapper').on('click', '.btn-goods-edit', function(e){
        e.preventDefault();
        let goodsid = $(this).data('goodsid');
        $('#book_name_'+goodsid).addClass('d-none');
        $('#book_goods_'+goodsid).addClass('d-none');
        $('#input-book_name_'+goodsid).val($('#book_name_'+goodsid).text());
        $('#input-book_goods_'+goodsid).val($('#book_goods_'+goodsid).text());
        $('.edit-book-'+goodsid).removeClass('d-none');
        $('.btn-goods-edit-'+goodsid).addClass('d-none');
        $('.btn-goods-edit-ok-'+goodsid).removeClass('d-none');
        $('.btn-goods-edit-cancel-'+goodsid).removeClass('d-none');
    });

    $('.wrapper').on('click', '.btn-goods-edit-cancel', function(e){
        e.preventDefault();
        let goodsid = $(this).data('goodsid');
        $('#book_name_'+goodsid).removeClass('d-none');
        $('#book_goods_'+goodsid).removeClass('d-none');
        $('#input-book_name_'+goodsid).val('');
        $('#input-book_goods_'+goodsid).val('');
        $('.edit-book-'+goodsid).addClass('d-none');
        $('.btn-goods-edit-'+goodsid).removeClass('d-none');
        $('.btn-goods-edit-ok-'+goodsid).addClass('d-none');
        $('.btn-goods-edit-cancel-'+goodsid).addClass('d-none');
    });

    $('.wrapper').on('change', "input[type='radio']", function(e){
        let address_id = $(this).val();
        let goodsid = $(this).data('goodsid');
        let get_url = pro_name+'/api/order/'+goodsid+'/address/'+address_id;
        $.get(get_url, function(data){
            $('#book_address_'+goodsid).text(data.data);
        });
    });

    $('#btn-modal-submit').on('click', function(e){
        e.preventDefault();
        let post_data = {};
        post_data['stroke_id'] = $('#stroke_list').val();
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
        let http_method = 'POST';
        let post_url = pro_name+'/api/order';
        $.ajax({
            method: http_method,
            url: post_url,
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

    $('.btn-goods-edit-ok').on('click', function(e){
        e.preventDefault();
        let post_data = {};
        let goodsid = $(this).data('goodsid');
        post_data['stroke_id'] = $('#stroke_list').val();
        post_data['book_name'] = $('#input-book_name_'+goodsid).val();
        post_data['book_goods'] = $('#input-book_goods_'+goodsid).val();
        let http_method = 'PUT';
        let post_url = pro_name+'/api/order/'+goodsid;
        $.ajax({
            method: http_method,
            url: post_url,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    $('#book_name_'+goodsid).removeClass('d-none');
                    $('#book_goods_'+goodsid).removeClass('d-none');
                    $('#book_name_'+goodsid).text($('#input-book_name_'+goodsid).val());
                    $('#book_goods_'+goodsid).text($('#input-book_goods_'+goodsid).val());
                    $('#input-book_name_'+goodsid).val('');
                    $('#input-book_goods_'+goodsid).val('');
                    $('.edit-book-'+goodsid).addClass('d-none');
                    $('.btn-goods-edit-'+goodsid).removeClass('d-none');
                    $('.btn-goods-edit-ok-'+goodsid).addClass('d-none');
                    $('.btn-goods-edit-cancel-'+goodsid).addClass('d-none');
                    $.NotificationApp.send("Info!", "更新成功", "bottom-right", "rgba(0,0,0,0.2)", "success");
                } else {
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {
                dev_update_mode = null;
            }
        });
    });
});