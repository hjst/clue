function wordnik_api_lookup(search_result) {
  // search_result is a jQuery object reference for the DOM node of the search result
  $(search_result).append(
    $('<div id="loader">').append(
      $('<div id="bowl_ringG">').append(
        $('<div class="ball_holderG">').append(
          $('<div class="ballG">')
        )
      )
    )
  );
  $.ajax({
    url:'http://api.wordnik.com/v4/word.json/'+ $(search_result).text() +'/definitions',
    dataType:'jsonp',
    data: {
      api_key: 'e60b288bc3c06fdc220080d9f7a07a21d14a31af52b8ad97c',
    },
    success: function(wordnik_response) {
      var defs = [];
      $.each(wordnik_response, function(key, value) {
        var definition_html = '<em class="def-part">'+ value.partOfSpeech +'</em> '
          +'<span class="def-text">'+ value.text +'</span>'
          +' <span class="def-attrib">'+ value.attributionText +'</span>';
        defs.push($('<li>').html(definition_html));
      });
      if (defs.length > 0) {
        $(search_result).parent().append($('<ol>').append(defs));
      } else {
        // no definitions
        $(search_result).parent().append(
          '<p class="wordnik-msg">No definitions found.</p>'
        );
      }
    },
    timeout: 10000
  }).complete( function() {
    // things to do whether the request succeeds OR fails
    $('div#loader').remove(); // kill the loader animation
  }).fail( function(jqxhr_obj, textStatus, error) {
    // try to output something in the event of complete failure      
    $(search_result).parent().append(
      '<p class="wordnik-msg">No response from Wordnik API.</p>'
    );
  });
}
