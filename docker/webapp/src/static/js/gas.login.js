$(function() {
    let form_action = $('#form-action').text();
    $('#btn-submit').on('click', function(e) {
        e.preventDefault();
        let post_email = $('#emailaddress').val();
        let post_pwd = $('#password').val();
        let post_remember_me = $('#checkbox-signin').is(":checked");
        let post_data = {
            'email': post_email,
            'password': md5(post_pwd),
            'remember': post_remember_me
        };
        $.ajax({
            method: 'post',
            url: form_action,
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(post_data),
            success: function(data, textStatus, jqXHR) {
            },
            error: function(jqXHR, textStatus, errorThrown) {
            },
            complete: function(jqXHR, textStatus) {
            }
        });
    });
});