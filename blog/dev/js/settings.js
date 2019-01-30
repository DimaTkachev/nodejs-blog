/* eslint-disable no-undef */

$(function() {
  $('.settings-change').on('click', function() {
    var settingsLine = $(this).closest('.settings-line');

    settingsLine.find('.settings-editor').val('');

    settingsLine.toggleClass('editing');
  });

  $('.form-container').on('submit', function(e) {
    e.preventDefault();
  });

  $('#change-login-ok .icon-ok').on('click', function() {
    var changeBlock = $(this).closest('.settings-change-block');

    var settingsLine = changeBlock.closest('.settings-line');

    var data = {
      newLogin: changeBlock.find('.settings-editor').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/updatelogin'
    }).done(function(data) {
      if (data.ok) {
        $(location).attr('href', '/settings');
      } else {
        console.log(data.error);
      }
    });
  });

  $('.change-pwd-btn').on('click', function() {
    var settingsLine = $(this).closest('.settings-line');

    var data = {
      oldPwd: settingsLine.find('#old-pwd').val(),
      newPwd: settingsLine.find('#new-pwd').val(),
      confirmPwd: settingsLine.find('#confirm-pwd').val()
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/auth/updatepwd'
    }).done(function(data) {
      if (data.of) {
        console.log(data);
      } else {
        console.log(data);
      }
    });
  });
});

/* eslint-enable no-undef */
