$(document).ready( function() {
  // bind the clue handler to the form
  $('form[name=clue]').submit(function(e){
    e.preventDefault();
    // clear out any previous results and prep the list
    $('#clue-results').empty().append($('<ol>'));
    // disable the submit button and display the loading text
    $(this).children(':submit')
      .val('Finding...')
      .attr('disabled', true);
    $('#clue-status').removeClass('error').html('');
    // make the jsonp call
    $.ajax({
      url:$(this).attr('action') + '?' + $(this).serialize(),
      dataType:'jsonp',
      success: process_clue_response,
      timeout: 10000
    }).complete( function() {
      // reset the button, no matter how the request ends
      $('form[name=clue]').children(':submit').val('Find').removeAttr('disabled');
    }).fail( function(jqxhr_obj, textStatus, error) {
      // try to output something in the event of complete failure      
      $('#clue-status').html(
        "ERROR: "+ textStatus
      ).addClass('error');
    });
  });
  // check for a pattern in the URL hash, auto-submit if found
  if (window.location.hash) {
    $('#pattern').val(window.location.hash.substr(1));
    $('form[name=clue]').submit();
  }
});

// define the handler for the server response
var process_clue_response = function(data) {
  // build an ordered list from the search results
  $.each(data[0].results, function(key, value) {
    $('#clue-results ol').append(
      $('<li>').append(
        $('<a>', {
          text: value,
          href: 'http://wordnik.com/words/'+value,
          click: function(e) {
            if ($(e.target).data('wordnik_fetched')) {
              // if the wordnik API lookup has already been done,
              // use the event default and follow the anchor href
              return true;
            } else {
              e.preventDefault();
              wordnik_api_lookup($(this));
              $(this).data('wordnik_fetched', true);
            }
          }
        })
      )
    );
  });
  // display the server message/error
  $('#clue-status').html(data[0].message);
  if (data[0].status == 'error') {
    $('#clue-status').addClass('error');
  } 
  // stash the sanitised pattern in the URL so users can link to the results
  window.location.hash = '#'+ data[0].pattern;
  // call the blur event on the input to trigger keyboard hiding on touchscreen devices
  $('#pattern').blur();
};

// handle the back/forward nav hash changes
// see issue #15 https://github.com/hjst/clue/issues/15
$(document).ready( function() {
  if ("onhashchange" in window) {
    window.onhashchange = hash_changed;
  }
});
function hash_changed() {
  var hash_pattern = location.hash.substr(1);
  var form_pattern = $('#pattern').val().replace(/[^a-zA-Z]/g, "_");
  if (hash_pattern === form_pattern) {
    // the hashchange event has fired as part of the results page load
    // do nothing
  } else {
    // the hashchange event has fired due to browser back/forward nav
    // reload the results
    $('#pattern').val(window.location.hash.substr(1));
    $('form[name=clue]').submit();
  }
}
