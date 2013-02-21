// define the handler for the server response
var process_clue_response = function(data) {
  $('form[name=clue]').after('<ol id="clue-results">');
  $.each(data[0].results, function(key, value) {
    console.log(value);
    $('#clue-results').append(
      $('<li>').append(
        $('<a>').attr('href', 'http://wordnik.com/words/'+value).text(value)
      )
    );
  });
};

// bind the clue handler to the form
$('form[name=clue]').submit(function(e){
  e.preventDefault();
  console.log($(this).attr('action') + '?' + $(this).serialize());
  $.ajax({
    url:$(this).attr('action') + '?' + $(this).serialize(),
    dataType:'jsonp',
    success: process_clue_response
  });
});

