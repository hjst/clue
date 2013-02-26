function wordnik_api_lookup(search_result) {
  // search_result is a jQuery object reference for the DOM node of the search result
  console.log("word: ", $(search_result).text());

  $.ajax({
    url:'http://api.wordnik.com/v4/word.json/'+ $(search_result).text() +'/definitions',
    dataType:'jsonp',
    data: {
      api_key: 'e60b288bc3c06fdc220080d9f7a07a21d14a31af52b8ad97c',
    },
    success: function(wordnik_response) {
      var defs = [];
      $.each(wordnik_response, function(key, value) {
        defs.push($('<li>').html(value.text));
        console.log('wordnik_response: ', value.text);
      });
      $(search_result).parent().append(
        $('<ul>').append(defs));
    },
    timeout: 10000
  }).complete( function() {
    // things to do whether the request succeeds OR fails
  }).fail( function(jqxhr_obj, textStatus, error) {
    // try to output something in the event of complete failure      
  });
}
