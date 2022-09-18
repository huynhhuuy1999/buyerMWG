import { MerchantChat } from 'models';
import { useEffect } from 'react';

import { chatAction, stepIframeSelector } from '@/store/reducers/chatSlice';

import { MODULE_CHAT } from '../enums';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export const useAppChat = () => {
	const useDeclareIframe = (iframeId: string, element: string) => {
		const dispatch = useAppDispatch();
		const stepIframe = useAppSelector(stepIframeSelector);

		useEffect(() => {
			const handleCreateAppChat = () => {
				const createIframe = document.getElementById(iframeId) as HTMLIFrameElement;
				const childWindow = createIframe?.contentWindow;
				if (!!childWindow) {
					childWindow.postMessage(
						{ type: MODULE_CHAT.CREATE, data: '' },
						process.env.NEXT_PUBLIC_DOMAIN_URL_CHAT || '',
					);
				}
			};
			const timeOut = setTimeout(() => handleCreateAppChat(), 300);
			return () => {
				clearTimeout(timeOut);
			};
		}, []);

		useEffect(() => {
			const handleReceiveMessage = async (event: any) => {
				if (event.origin === process.env.NEXT_PUBLIC_DOMAIN_URL_CHAT) {
					const { type, data } = event.data;
					if (type === MODULE_CHAT.CLOSE_ALL) {
						dispatch(chatAction.setStepIframe(''));
						const iframeChat = document.getElementById(iframeId) as HTMLIFrameElement;
						iframeChat.classList.add('hidden');
					} else if (type === MODULE_CHAT.CALLING && data) {
						const newWindow = window.open(
							'/guest-call/' +
								data.id +
								'?is_has_video=' +
								data.is_has_video +
								'&caller=' +
								data.caller_id +
								'&ring_ton=' +
								data.receiver_id,
							'_blank',
							'location=yes,height=730,width=1200,scrollbars=yes,status=yes',
						);
						// await onCall(data);
						if (newWindow) {
							newWindow.opener = null;
						}
					} else {
						dispatch(chatAction.setStepIframe(type));
					}
				}
			};
			window.addEventListener('message', handleReceiveMessage);

			return () => {
				window.removeEventListener('message', handleReceiveMessage);
			};
		}, []);

		useEffect(() => {
			if (stepIframe) {
				onChangeIframePosition(stepIframe);
			}
		}, [stepIframe]);

		const onChangeIframePosition = (type: string) => {
			const iframeChat = document.getElementById(iframeId) as HTMLIFrameElement;
			const rightRef = document.getElementById(element);
			switch (type) {
				case MODULE_CHAT.LIST_CONVERSATION:
					if (rightRef) {
						const position = rightRef.getBoundingClientRect();
						if (iframeChat && position) {
							iframeChat.classList.remove('hidden');
							iframeChat.style.width = position.width + 'px';
							iframeChat.style.height = '560px';
							iframeChat.style.left = position.left + 'px';
							iframeChat.style.right = '';
							iframeChat.style.bottom = '';
							iframeChat.style.top = position.top + position.bottom + 'px';
						}
					}
					break;
				case MODULE_CHAT.CHAT_MODULE:
					if (iframeChat) {
						iframeChat.classList.remove('hidden');
						iframeChat.style.width = '320px';
						iframeChat.style.height = '450px';
						iframeChat.style.left = '';
						iframeChat.style.right = '10px';
						iframeChat.style.top = '';
						iframeChat.style.bottom = '10px';
					}
					break;
				default:
					iframeChat.classList.add('hidden');
					break;
			}
		};
	};

	const onHandleOpenChat = (merchantInfo: MerchantChat) => {
		const iframeChat = document.getElementById('vuivui-chat-app') as HTMLIFrameElement;
		const childWindow = iframeChat?.contentWindow;
		if (!!childWindow) {
			childWindow.postMessage(
				{ type: MODULE_CHAT.CHAT_MODULE, data: merchantInfo },
				process.env.NEXT_PUBLIC_DOMAIN_URL_CHAT || '',
			);
		}
	};

	return { useDeclareIframe, onHandleOpenChat };
};
