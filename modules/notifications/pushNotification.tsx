// import { getApps } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import React, { Fragment, useEffect } from 'react';
import { firebaseCloudMessaging } from 'utils/firebase';

import Notification from '@/components/Notification';
import { useAuth } from '@/hooks/useAuth';

const PushNotification: React.FC = () => {
	const { currentUser } = useAuth();
	useEffect(() => {
		if (currentUser && currentUser.id) {
			setToken(currentUser.id);
		}
		async function setToken(userId: string) {
			try {
				const token = await firebaseCloudMessaging.init(userId);
				if (token) {
					getMessage();
				}
			} catch (error) {
				console.log('error token', error);
			}
		}
	}, [currentUser]);

	const getMessage = () => {
		const messaging = getMessaging();
		onMessage(messaging, (message) => {
			if (message.notification) {
				Notification.Coming.show({
					message: message.notification.body,
					titleHeade: message.notification.title,
					isOpen: true,
					timeout: 3000,
					icon: message.notification.image,
				});
			}
		});
	};
	return <Fragment></Fragment>;
};

export default PushNotification;
