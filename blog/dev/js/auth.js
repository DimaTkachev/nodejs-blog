/* eslint-disable no-undef */

$(function() {
  //remove errors
  function removeErrors() {
    $('form.login p.error, form.register p.error').remove();
    $('form.login input, form.register input').removeClass('error');
  }

  var flag = true;

  $('.switch-button').on('click', function(e) {
    e.preventDefault();

    $('input').val('');
    removeErrors();

    if (flag) {
      flag = false;
      $('.register').fadeIn('slow');
      $('.login').hide();
    } else {
      flag = true;
      $('.login').fadeIn('slow');
      $('.register').hide();
    }
  });

  // delete ERROR classes from inputs
  $('form.login input, form.register input').on('focus', function() {
    removeErrors();
  });

  //register
  $('.register-button').on('click', function(e) {
    e.preventDefault();

    removeErrors();

    var data = {
      login: $('#register-login').val(),
      password: $('#register-password').val(),
      passwordConfirm: $('#register-password-confirm').val()
    };

    $('.register .form-group input').val('');

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/register'
    }).done(function(data) {
      if (!data.ok) {
        $('.register h2').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      } else {
        $(location).attr('href', '/');
      }
    });
  });

  // login
  $('.login-button').on('click', function(e) {
    e.preventDefault();

    removeErrors();

    var data = {
      login: $('#login-login').val(),
      password: $('#login-password').val()
    };

    $('.login .form-group input').val('');

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/login'
    }).done(function(data) {
      if (!data.ok) {
        $('.login h2').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach(function(item) {
            $('input[name=' + item + ']').addClass('error');
          });
        }
      } else {
        $(location).attr('href', '/');
      }
    });
  });
});

/* eslint-enable no-undef */
