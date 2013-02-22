// define the handler for the server response
var process_clue_response = function(data) {
  // build an ordered list from the search results
  $.each(data[0].results, function(key, value) {
    $('#clue-results ol').append(
      $('<li>').append(
        $('<a>').attr('href', 'http://wordnik.com/words/'+value).text(value)
      )
    );
  });
  // we're finished, so reset the button
  $('#clue-status').html(data[0].message);
  $('form[name=clue]').children(':submit')
    .val('Find')
    .removeAttr('disabled');
  // stash the sanitised pattern in the URL so users can link to the results
  window.location.hash = '#'+ data[0].pattern;
  // call the blur event on the input to trigger keyboard hiding on touchscreen devices
  $('#pattern').blur();
};

$(document).ready( function() {
  // bind the clue handler to the form
  $('form[name=clue]').submit(function(e){
    e.preventDefault();
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
  // check for a pattern in the URL, auto-submit if found
  if (window.location.hash) {
    $('#pattern').val(window.location.hash.substr(1));
    $('form[name=clue]').submit();
  }
});

