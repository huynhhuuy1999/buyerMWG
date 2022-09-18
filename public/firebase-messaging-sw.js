importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-app-compat.js')

importScripts('https://www.gstatic.com/firebasejs/9.9.0/firebase-messaging-compat.js')

const REACT_APP_FIREBASE_API_KEY = 'AIzaSyA-_OM9z0A61glnKcG6QfeQDLdIlUKLIak'
const REACT_APP_FIREBASE_AUTH_DOMAIN = 'vuivuiecom.firebaseapp.com'
const REACT_APP_FIREBASE_PROJECT_ID = 'vuivuiecom'
const REACT_APP_FIREBASE_STORAGE_BUCKET = 'vuivuiecom.appspot.com'
const REACT_APP_FIREBASE_MESSAGING_SENDER_ID = '793439928223'
const REACT_APP_FIREBASE_APP_ID = '1:793439928223:web:eff6a8766141deb69187aa'
// const REACT_APP_FIREBASE_MEASUREMENT_ID = 'G-1XHHZ1VTVM'
// const REACT_APP_FIREBASE_DATABASE_URL = 'https://YOUR-PROJECT-NAME.firebaseio.com'

// const firebaseConfig = {
// 	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
// 	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
// 	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
// 	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
// 	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
// 	appId: process.env.REACT_APP_FIREBASE_APP_ID,
// }

const firebaseConfig = {
	apiKey: REACT_APP_FIREBASE_API_KEY,
	authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: REACT_APP_FIREBASE_APP_ID,
	measurementId: "G-1XHHZ1VTVM"
}

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
 
firebase.messaging(firebaseApp)


// messaging.onBackgroundMessage((payload) => {
// 	console.log('[firebase-messaging-sw.js] Received background message ', payload)
// 	// Customize notification here
// 	const notificationTitle = 'Background Message Title'
// 	// const notificationOptions = {
// 	// 	body: 'Background Message body.',
// 	// 	icon: '/firebase-logo.png',
// 	// 	vibrate: [200, 100, 200, 100, 200, 100, 200],
// 	// 	sound: '/assets/sound/new-notification.wav',
// 	// }

// 	self.registration.showNotification(notificationTitle, notificationOptions)
// })
