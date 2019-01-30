/* eslint-disable no-undef */

$(function() {
  var editor = new MediumEditor('#post-body', {
    placeholder: {
      text: '',
      hideOnClick: true
    }
  });

  function removeErrors() {
    $('.post-form p.error').remove();
    $('.post-form input, #post-body').removeClass('error');
  }

  // delete ERROR classes from inputs
  $('.post-form input, #post-body').on('focus', function() {
    removeErrors();
  });

  //publish
  $('.publish-button, .save-button').on('click', function(e) {
    e.preventDefault();

    removeErrors();

    var isDraft = $(this).hasClass('save-button');

    var data = {
      title: $('#post-title').val(),
      body: $('#post-body').html(),
      isDraft: isDraft,
      postId: $('#post-id').val()
    };

    $.ajax({
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/post/add'
    }).done(function(data) {
      if (!data.ok) {
        $('.post-form h2').after('<p class="error">' + data.error + '</p>');
        if (data.fields) {
          data.fields.forEach(function(item) {
            $('#post-' + item).addClass('error');
          });
        }
      } else {
        if (isDraft) {
          $(location).attr('href', '/post/edit/' + data.post._id);
        } else {
          $(location).attr('href', '/posts/' + data.post.url);
        }
      }
    });
  });

  //upload
  $('#fileinfo').on('change', function(e) {
    //e.preventDefault();

    var formData = new FormData();
    formData.append('postId', $('#post-id').val());
    formData.append('file', $('#file')[0].files[0]);

    $.ajax({
      type: 'POST',
      url: '/upload/image',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        console.log(data);
        $('#fileinfo').prepend(
          '<div class="img-container"><img src="/uploads' + data.filePath + '" alt=""></div>'
        );
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  //inserting image
  $('.img-container').on('click', function() {
    var txt = $('#post-body');
    var caretPos = txt[0].selectionStart;
    var textAreaTxt = txt.val();
    var txtToAdd = 'stuff';
    txt.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos));
  });
});

/* eslint-enable no-undef */
