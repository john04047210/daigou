$(function(){
    let pro_name = $('#pro_name').text();
    let dev_id = $('#cur_device_id').text();
    let canvasId = null;

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

    $('.wrapper').on('click', '.meter-img', function(e){
        e.preventDefault();
        let img_url = $(this).data('img-url');
        $('#modal-img').attr('src', img_url);
        $('#info-modal').modal({
            'show': true
        });
    });

    $('.wrapper').on('click', '#btn-ota-model', function(e){
        e.preventDefault();
        $('.modal-title').text('OTA Model');
        $('#ota-model-modal').modal({
            'show': true
        });
    });

    $('#btn-modal-ota-model-submit').on('click', function(e){
        e.preventDefault();
        let http_method = 'PUT';
        let file_name = $('#input-ota-model-file-name').val();
        let model_ver = $('#input-ota-model-file-version').val();
        let ota_model_json = {
            'file_name': file_name,
            'model_ver': model_ver
        };
        $.ajax({
            method: http_method,
            url: pro_name+'/api/device/'+dev_id+'/ota_model',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(ota_model_json),
            success: function(data, textStatus, jqXHR) {
                if(data.code == 0) {
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "success");
                    $('#ota-model-modal').modal('hide');
                } else {
                    $.NotificationApp.send("Info!", data.msg, "bottom-right", "rgba(0,0,0,0.2)", "error");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $.NotificationApp.send("ServerError!", textStatus, "bottom-right", "rgba(0,0,0,0.2)", "error");
            },
            complete: function(jqXHR, textStatus) {

            }
        });
    });
    $('.wrapper').on('click', '#btn-refresh', function(e){
        e.preventDefault();
        range_date = $('#range-date').val();
        dates = range_date.split(' - ');
        date_start = dates[0].split('/');
        date_end = dates[1].split('/');
        location.href = pro_name+'/render/device/'+dev_id+'/detail?start='+date_start[2]+'-'+date_start[0]+'-'+date_start[1]+' 00:00:00&end='+date_end[2]+'-'+date_end[0]+'-'+date_end[1]+' 23:59:59';
        // location.reload();
    });
    $('.wrapper').on('click', '#btn-back', function(e){
        e.preventDefault();
        location.href = pro_name+'/render/devices';
    });
    $('.wrapper').on('click', '.btn-download', function(e){
        e.preventDefault();
        file_format = $(this).data('file_format');
        range_date = $('#range-date').val();
        dates = range_date.split(' - ');
        date_start = dates[0].split('/');
        date_end = dates[1].split('/');
        $.fileDownload(pro_name+'/api/device/download/'+dev_id+'format='+file_format+'&start='+date_start[2]+'-'+date_start[0]+'-'+date_start[1]+' 00:00:00&end='+date_end[2]+'-'+date_end[0]+'-'+date_end[1]+' 23:59:59');
    });

    function charts() {
        $.get(pro_name+'/api/device/'+dev_id+'/meter?limit=30&dtfmt=%H:%M&order_by=desc', function(data) {
            if (data.code == 0) {
                let meter_data = data.data;
                if (meter_data.length > 0) {
                    let chart_data = [];
                    let min_val = -1;
                    let max_val = -1;
                    meter_data.forEach(function(ele) {
                        if (min_val == -1) {
                            min_val = ele.value;
                            max_val = ele.value;
                        }
                        min_val = ele.value < min_val ? ele.value : min_val;
                        max_val = ele.value > max_val ? ele.value : max_val;
                        let chartMap = new Map();
                        chartMap.set(ele.date, ele.value);
                        chart_data.push(chartMap);
                    });
                    let step = 5;
                    if ((max_val - min_val) > 5) {
                        let range = max_val - min_val;
                        step = Math.round(range / 5);
                    }
                    if (canvasId) {
                        chartjs.areaCharts('mixed-'+dev_id, chart_data, '', '', true, canvasId, step);
                    } else {
                        canvasId = chartjs.areaCharts('mixed-'+dev_id, chart_data, '', '', false, null, step);
                    }
                }
            }
        });
    }
    charts();
    setInterval(function() {
        $.get(pro_name+'/render/device/'+dev_id+'/detail_meters', function(data) {
            $('.device_meter_list').html(data);
        });
    }, 1000 * 10);
});