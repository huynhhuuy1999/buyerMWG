import { ImageCustom } from 'components';
import { useAppCaller } from 'hooks';
import { CallVideo, Conversation, NotificationTmp, Users } from 'models';
import React from 'react';
interface IHeaderActionChatProps {
	isSearch: boolean;
	setIsSearch: Function;
	conversation: Conversation;
	listUserChat: Users[];
}
const HeaderActionChat: React.FC<IHeaderActionChatProps> = ({
	isSearch,
	setIsSearch,
	conversation,
	listUserChat,
}) => {
	const { useCreateCall } = useAppCaller();
	const { handleCreateCall, handlePushNotification } = useCreateCall();
	const handleOnCall = async (isVideo: boolean) => {
		const model: CallVideo = {
			caller_id: conversation.participate_user_id,
			receiver_id: conversation.participates?.replace('[', '').replace(']', ''),
			is_has_video: isVideo,
		};
		const notification: NotificationTmp = {
			list_token: listUserChat?.[0]?.firebase_tokens,
			type: 'user',
			click_action: 'FLUTTER_NOTIFICATION_CLICK',
			noti_type: 'call',
			data_notification: {
				id: listUserChat?.[0]?.id || '',
				avatar: listUserChat?.[0]?.avatar || '',
				handle: listUserChat?.[0]?.phone || '',
				isVideo: isVideo,
				nameCaller: listUserChat?.[0]?.name || '',
			},
		};
		const id = await handleCreateCall(model);
		await handlePushNotification(notification);
		const newWindow = window.open(
			'/guest-call/' +
				id +
				'?is_has_video=' +
				isVideo +
				'&caller=' +
				conversation.participate_user_id +
				'&ring_ton=' +
				conversation.participates?.replace('[', '').replace(']', ''),
			'_blank',
			'location=yes,height=730,width=1200,scrollbars=yes,status=yes',
		);
		if (newWindow) newWindow.opener = null;
	};

	return (
		<div className='relative flex items-center border-b border-gray-300 p-2'>
			<div className='justify-left flex w-1/4 items-center'>
				<div
					className='ml-2 cursor-pointer font-bold text-white'
					tabIndex={0}
					role='button'
					onClick={() => handleOnCall(false)}
					onKeyPress={() => handleOnCall(false)}
				>
					<ImageCustom
						priority
						className='w-auto'
						width={24}
						height={24}
						src={'/static/svg/fluent_call-20-regular.svg'}
					/>
				</div>
				<div
					className='ml-2 cursor-pointer font-bold text-white'
					tabIndex={0}
					role='button'
					onClick={() => handleOnCall(true)}
					onKeyPress={() => handleOnCall(true)}
				>
					<ImageCustom
						priority
						className='w-auto'
						width={24}
						height={24}
						src={'/static/svg/clarity_video-camera-line.svg'}
					/>
				</div>
			</div>
			<div className='flex w-1/2 items-center justify-center'>
				{isSearch && (
					<input
						type='text'
						placeholder='Search'
						className='block w-full border-none focus:text-gray-700 focus:outline-none'
						name='Search'
						required
					/>
				)}
			</div>
			<div className='flex w-1/4 items-center justify-end'>
				<span
					className='ml-2 block cursor-pointer font-bold text-white'
					tabIndex={0}
					role='menu'
					onKeyPress={() => setIsSearch(!isSearch)}
					onClick={() => setIsSearch(!isSearch)}
				>
					<ImageCustom
						priority
						className='w-auto'
						width={24}
						height={24}
						src={isSearch ? '/static/svg/Close.svg' : '/static/svg/searchicon.svg'}
					/>
				</span>
				<span className='ml-2 block cursor-pointer font-bold text-white'>
					<ImageCustom
						priority
						className='w-auto'
						width={20}
						height={20}
						src={'/static/svg/carbon_overflow-menu-vertical.svg'}
					/>
				</span>
			</div>
		</div>
	);
};
export default HeaderActionChat;
