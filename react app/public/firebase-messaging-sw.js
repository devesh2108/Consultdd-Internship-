importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.7.0/firebase-messaging.js');

let config = {
    apiKey: "AIzaSyAC1MXLjIIDnLhYLKdUWoGx3tKrox1pA9I",
    authDomain: "consultadd-timesheet.firebaseapp.com",
    databaseURL: "https://consultadd-timesheet.firebaseio.com/",
    projectId: "consultadd-timesheet",
    storageBucket: "consultadd-timesheet.appspot.com",
    messagingSenderId: "678828580856",
    appId: "1:678828580856:web:2aca5346b74d5551b3800d",
    measurementId: "G-GWXE2R0L85"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(payload => {
    const title = payload.notification.title;
    console.log('payload', payload.notification.icon);
    const options = {
        body: payload.notification.body,
        actions: [{
            action: 'https://log1.app', //payload.notification.action if it is an object
        }]
    }
    return self.registration.showNotification(title, options);
})

self.addEventListener("notificationclick", function (event) {
    const clickedNotification = event.notification;

    console.log("-----on click notification------",clickedNotification);

    clickedNotification.close();

    event.waitUntil(clients.openWindow(event.notification.action));

    // const promiseChain = clients
    //     .matchAll({
    //         type: "window",
    //         includeUncontrolled: true
    //     })
    //     .then(windowClients => {
    //         let matchingClient = null;
    //         for (let i = 0; i < windowClients.length; i++) {
    //             const windowClient = windowClients[i];
    //             if (windowClient.action === feClickAction) {
    //                 matchingClient = windowClient;
    //                 break;
    //             }
    //         }
    //         if (matchingClient) {
    //             return matchingClient.focus();
    //         } else {
    //             return clients.openWindow(feClickAction).then((windowClients) =>
    //                 window.open(
    //                     "https://www.google.com", "_blank"))
    //
    //         }
    //
    //     })
    // ;
    // event.waitUntil(promiseChain);
});

