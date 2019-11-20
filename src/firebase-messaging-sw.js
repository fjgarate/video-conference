// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    'messagingSenderId': 'AAAA6MMjf0Q:APA91bHQ4vi2hwhHIvrSgLe7MiMgnF-kOtikQT-3iOi7tIlecpMS7sWhdlUGLg4mTEd7cF-7WuaCcjt6Wegv5lfYT6vtSwzJObzMFUq0H2vcQOEOjnS6K6boeSZcu8ojOnGMeYO2J4MX'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();