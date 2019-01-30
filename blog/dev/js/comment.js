/* eslint-disable no-undef */

$(function() {
  var commentForm;
  var parentId;

  function form(isNew, comment) {
    $('.reply').show();

    if (commentForm) {
      commentForm.remove();
    }

    parentId = null;

    commentForm = $('form.comment').clone(true, true);

    if (isNew) {
      commentForm.find('.cancel').hide();
      commentForm.appendTo('.comment-list').fadeIn();
    } else {
      var parentComment = $(this).parent();
      parentId = parentComment.attr('id');
      $(comment).after(commentForm);
    }

    commentForm.css({ display: 'flex' });
  }

  // load
  form(true);

  //focus and blur events of textarea
  $('form.comment textarea')
    .focus(function() {
      $(this).removeAttr('placeholder');
    })
    .blur(function() {
      $(this).attr('placeholder', 'Написать комментарий...');
    });

  //add form
  $('.reply').on('click', function() {
    form(false, this);
    $(this).hide();
  });

  $('form.comment .cancel').on('click', function(e) {
    e.preventDefault();
    commentForm.fadeOut(100, function() {
      $(this).remove();
      // load
      form(true);
    });
  });

  $('form.comment .send').on('click', function(e) {
    e.preventDefault();

    //removeErrors();

    var data = {
      post: $('.comments').attr('data-postid'),
      body: commentForm.find('textarea').val(),
      parent: parentId
    };

    $.ajax({
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/comment/add'
    }).done(function(data) {
      if (!data.ok) {
        if (data.error === undefined) data.error = 'Неизвестная ошибка!';
        $(commentForm).prepend('<p class="error">' + data.error + '</p>');
      } else {
        var newComment =
          '<ul><li style="background-color: #ffffe0"><div class="head"><a href="/users/' +
          data.login +
          '">' +
          data.login +
          '</a><span class="date">Только что</span></div>' +
          data.body +
          '</li></ul>';

        $(commentForm).after(newComment);
        form(true);
      }
    });
  });
});

/* eslint-enable no-undef */
