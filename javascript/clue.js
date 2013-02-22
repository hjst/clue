// define the handler for the server response
var process_clue_response = function(data) {
  $.each(data[0].results, function(key, value) {
    console.log(value);
    $('#clue-results ol').append(
      $('<li>').append(
        $('<a>').attr('href', 'http://wordnik.com/words/'+value).text(value)
      )
    );
  });
  // we're finished, so reset the button
  $('#clue-status').html('');
  $('form[name=clue]').children(':submit')
    .val('Find')
    .removeAttr('disabled');

};

// bind the clue handler to the form
$('form[name=clue]').submit(function(e){
  e.preventDefault();
  console.log($(this).attr('action') + '?' + $(this).serialize());
  // clear out any previous results and prep the list
  $('#clue-results').empty();
  $('#clue-results').append($('<ol>'));
  // disable the submit button and display the loading text
  $(this).children(':submit')
    .val('Finding...')
    .attr('disabled', true);
  $('#clue-status').html('Searching for '+ $('input[name=pattern]').val());

  // make the jsonp call
  $.ajax({
    url:$(this).attr('action') + '?' + $(this).serialize(),
    dataType:'jsonp',
    success: process_clue_response
  });
});

