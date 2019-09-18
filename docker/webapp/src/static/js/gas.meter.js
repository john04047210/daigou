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

    $('.wrapper').on('click', '.btn-dev-list', function(e){
        e.preventDefault();
        let dev_id = $(this).data('dev_id');
        // location.href = pro_name + '/index/'+dev_id;
        location.href = pro_name+'/render/device/'+dev_id+'/detail';
    });

    $('.wrapper').on('click', '#btn-refresh', function(e){
        e.preventDefault();
        let dev_id = $('#cur_dev_id').text();
        $('#dev_list').load(pro_name + '/list/' + dev_id);
        $('#meter_history').load(pro_name + '/history/' + dev_id);
    });

    window.setInterval(function() {
        let dev_id = $('#cur_dev_id').text();
        $('#dev_list').load(pro_name + '/render/list/' + dev_id);
        $('#meter_history').load(pro_name + '/render/history/' + dev_id);
    }, 1000 * 60 * 60);
});