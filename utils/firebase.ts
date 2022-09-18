import { getApps, initializeApp } from 'firebase/app';
import { deleteToken, getMessaging, getToken, Messaging } from 'firebase/messaging';
import localforage from 'localforage';
import { putFirebaseTokenAPI } from 'services';

import { FirebaseToken } from '@/models/auth';
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	// measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

const handleFirebase = async (messaging: Messaging, userId: string) => {
	const permission = await Notification.requestPermission();
	if (permission && permission === 'granted') {
		const currentToken = await getToken(messaging, {
			vapidKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_KEY,
		}).catch((error) => console.error('error get Token firebase', error));
		if (currentToken) {
			if (currentToken) {
				const deviceInfo = {
					tokens: [
						{
							platform: navigator.platform,
							device: userId,
							token: currentToken,
							typeToken: 'firebase',
							language: navigator.language,
						},
					],
				};
				localforage.setItem('fcm_vuivui_token', deviceInfo.tokens[0]);
				putFirebaseTokenAPI(deviceInfo).catch((errors: any) => {
					console.error('errors push token', errors);
				});
				return currentToken;
			}
		}
	}
};

export const firebaseCloudMessaging = {
	init: async (userId: string) => {
		const messaging = getMessaging(firebaseApp);
		if (getApps().length <= 1) {
			try {
				const tokenInLocalForage: FirebaseToken | null = await localforage.getItem(
					'fcm_vuivui_token',
				);
				if (tokenInLocalForage && tokenInLocalForage.token) {
					if (tokenInLocalForage.device === userId) {
						return tokenInLocalForage.token;
					} else {
						deleteToken(messaging)
							.then(async () => {
								await localforage.removeItem('fcm_vuivui_token');
								const currentToken = await handleFirebase(messaging, userId);
								return currentToken;
							})
							.catch((error) => {
								console.error('errors delete token', error);
								return null;
							});
					}
				} else {
					const currentToken = await handleFirebase(messaging, userId);
					return currentToken;
				}
			} catch (error) {
				localforage.removeItem('fcm_vuivui_token');
				console.error('error get Token firebase', error);
				return null;
			}
		}
		return null;
	},
};
