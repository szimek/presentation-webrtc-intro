(function () {
  var database = 'presentations',
      presentation = 'webrtc-intro',
      url = 'https://' + database + '.firebaseio.com/' + presentation,
      ref = new Firebase(url),
      params, auth, i, param;

  params = window.location.search.substring(1).split('&').map(function (el) {
    return el.split('=');
  });

  for (i = 0; param = params[i]; ++i) {
    if (param[0].toLowerCase() === 'broadcast') {
      // Authenticate using GitHub unless already authenticated
      auth = new FirebaseSimpleLogin(ref, function(error, user) {
        if (!user) { auth.login('github', { rememberMe: true }); }
      });

      // Listen to slide change event and save slide number to Firebase
      document.addEventListener('slideenter', function (event) {
        ref.set(event.slideNumber);
      });
    } else if (param[0].toLowerCase() === 'follow') {
      // Fetch slide number from Firebase and update the current slide
      ref.on('value', function (snapshot) {
        window.slidedeck.loadSlide(snapshot.val());
      });
    }
  }
})();
