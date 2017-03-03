if (!Foundation) {
    throw 'Foundation not present';
}

Foundation.Abide.defaults.patterns['password'] = /^(\w{3,30})$/;
Foundation.Abide.defaults.patterns['username'] = /^(\w{3,30})$/;

$(document).ready(function() {

    var crumb = $('meta[name=crumb]').attr("content");

    var control = $('#show-password');
    var field = $('#form-password');

    control.bind('click', function() {
        if (control.is(':checked')) {
            field.attr('type', 'text');
        } else {
            field.attr('type', 'password');
        }
    });

    $('#login-form')
        .on('formvalid.zf.abide', function() {

            // enable submit button if form is valid
            $('#submit').attr('disabled', false);

        })
        .on('forminvalid.zf.abide', function() {

            // disable submit button if form is valid
            $('#submit').attr('disabled', true);

        })
        .on('submit', function(event) {

            // prevent default browser behaviour
            event.preventDefault();

            // disable form submit button to prevent
            $('#submit').attr('disabled', false);

            // ajax post form
            var param = $("#login-form").serialize();
            $.ajax({
                type: 'POST',
                url: '/login',
                timeout: 5000,
                data: param,
                beforeSend: function(request) {
                    request.setRequestHeader('x-csrf-token', crumb);
                },
                success: function(data) {

                    console.log('user account data:', JSON.stringify(data));
                    window.location.href = '/home';
                },
                error: function(request, error) {

                    var errorMessage;

                    // response is boom
                    if (request.status !== 0) {
                        errorMessage = 'Invalid username or password';
                    } else {

                        if (error === 'timeout') {
                            errorMessage = 'Request timed out';
                        } else {
                            errorMessage = 'Could not connect to the server';
                        }

                    }

                    $('#error-message').text(errorMessage);
                    $('#form-error').css('display', 'block').addClass('alert');
                }
            });

        });

    // Validate form everytime a field changes
    $('#form-username, #form-password').on('change', function() {
        $('#login-form').foundation('validateForm');
    });

});
