<?php if($is_ios == "") { ?>

jQuery(document).ready(function($){
window.addEventListener('beforeinstallprompt', function(e) {
  e.userChoice.then(function(choiceResult) {
    console.log(choiceResult.outcome);
    if(choiceResult.outcome == 'dismissed') {
      console.log('User cancelled home screen install');
    }
    else {
      console.log('User added to home screen');
    }
  });
});
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register(url_server+'/service-worker.js', {
//scope: '.' // THIS IS REQUIRED FOR RUNNING A PROGRESSIVE WEB APP FROM A NON_ROOT PATH
}).then(function(registration) {
//console.log('ServiceWorker registration successful with scope: ', registration.scope);
registration.update();
}, function(err) {
//console.log('ServiceWorker registration failed: ', err);
});
}
window.addEventListener('installPromptEvent', function(installPromptEvent) {
installPromptEvent.prompt();
  installPromptEvent.userChoice.then((choice) => {
    if (choice.outcome === 'accepted') {
//console.log('User accepted the A2HS prompt');
    } else {
//console.log('User dismissed the A2HS prompt');
    }
    installPromptEvent = null;
  });
});

});
<?php } ?>
