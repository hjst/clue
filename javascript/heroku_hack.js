// HACK: this is a complete hack and not necessary outside of the free Heroku service
// 
// When Heroku apps only have 1 web process (i.e. the free usage tier) they drop out
// of memory if they're not accessed for a set time. The effect is that the next time
// a user accesses the app there is a delay while it's loaded into memory and run.
// Subsequent requests are processed quickly until the app drops out of memory again.
// One way around this is to make a pointless query to the heroku app on page load and
// discard the results. This "wakes up" the app and the subsequent "real" requests
// will return results much quicker.
$(document).ready( function() {
    $.ajax({
      url:$('form[name=clue]').attr('action') + '?pattern=herokuhack',
      timeout: 10000
    });
});
