import { useSubscription } from '@apollo/react-hooks';
import { ImageCustom } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import { CHAT_TYPE } from 'enums';
import { getMessageByMessageId } from 'graphql/queries/message';
import { Content, MessageChat, Reaction } from 'models';
import React, { useEffect, useState } from 'react';

import MediaMessage from './mediaMessage';
interface IFriendMessageProps {
	isCheckAvt: boolean;
	content?: Content;
	status?: number;
	avatar?: string;
	timeLine?: string;
	reaction?: Reaction[];
	handleReplyMessage: (replyto?: Content) => void;
	onReaction: (conten?: Content) => void;
}
const FriendMessage: React.FC<IFriendMessageProps> = ({
	isCheckAvt,
	content,
	status,
	avatar,
	timeLine,
	reaction,
	handleReplyMessage,
	onReaction,
}) => {
	const [isHoverAction, setIsHoverAction] = useState<boolean>(false);
	const [messageReply, setMessageReply] = useState<MessageChat>({});
	const contentReply = useSubscription(
		getMessageByMessageId(
			content?.reply_to && content?.reply_to !== '00000000-0000-0000-0000-000000000000'
				? content?.reply_to
				: undefined,
		),
	);
	useEffect(() => {
		const contentRep: MessageChat = contentReply?.data?.webchat_chat_message?.[0];
		setMessageReply(contentRep);
	}, [contentReply]);
	return (
		<div className='flex w-full flex-col items-start justify-center py-2'>
			{messageReply && messageReply.id && (
				<div className='ml-7 flex items-center space-x-2'>
					<ImageCustom width={14} height={14} src={'/static/svg/share_comment.svg'} />
					<div className='text-sm font-light'>Đã trả lời</div>
				</div>
			)}
			{messageReply && messageReply.content?.event_type === CHAT_TYPE.MESSAGE && (
				<div className='ml-7 max-w-[80%] rounded-md bg-white px-[6px] pb-4 pt-2 opacity-50 shadow'>
					<span className='block text-sm opacity-90'>{messageReply.content?.content}</span>
				</div>
			)}
			{messageReply && messageReply.content?.event_type === CHAT_TYPE.MEDIA && (
				<MediaMessage
					media={messageReply.content.media_url ? messageReply.content.media_url : []}
					className='ml-7 max-w-[80%] opacity-50'
				/>
			)}
			<div className='-mt-4 flex h-auto w-full content-start items-start justify-start'>
				{!isCheckAvt ? (
					<ImageCustom
						priority
						className='rounded-full object-cover'
						width={32}
						height={32}
						src={avatar && REGEX_IMAGE.test(avatar) ? avatar : EmptyImage}
						alt={content?.conv_name}
						title={content?.conv_name}
					/>
				) : (
					<div className='w-8'></div>
				)}
				<div className='flex w-full flex-col items-start'>
					{content?.content && (
						<div
							className='flex w-full items-center space-x-1'
							role='none'
							tabIndex={0}
							onMouseLeave={() => setIsHoverAction(false)}
							onMouseEnter={() => setIsHoverAction(true)}
						>
							<div
								className='relative max-w-[80%] rounded-md bg-white px-[6px] py-2 text-sm text-gray-900 shadow'
								title={timeLine}
							>
								<span className='block'>{content?.content}</span>
								{!isCheckAvt && timeLine && (
									<span className='-mb-2 flex items-end justify-end text-[10px] opacity-50'>
										{timeLine}
									</span>
								)}
							</div>
							{status === 0 && (
								<ImageCustom width={18} height={18} src={'/static/svg/chat_received.svg'} />
							)}
							{status !== 0 && isHoverAction && (
								<div className='flex items-center'>
									<ImageCustom
										width={16}
										height={16}
										onClick={() => handleReplyMessage(content)}
										src={'/static/svg/share_comment.svg'}
										className='cursor-pointer'
									/>
									<ImageCustom
										width={18}
										height={18}
										onClick={() => onReaction(content)}
										src={'/static/svg/heart.svg'}
										className='cursor-pointer'
									/>
								</div>
							)}
						</div>
					)}
					{content?.media_url && content.media_url.length > 0 && (
						<div
							className='flex w-full items-center justify-start space-x-1'
							role='none'
							tabIndex={0}
							onMouseLeave={() => setIsHoverAction(false)}
							onMouseEnter={() => setIsHoverAction(true)}
						>
							<MediaMessage media={content.media_url} className='max-w-[83%]' title={timeLine} />
							{!isCheckAvt && timeLine && (
								<span className='-mb-2 flex items-end justify-end text-[10px] opacity-50'>
									{timeLine}
								</span>
							)}
							{status === 0 && (
								<ImageCustom width={18} height={18} src={'/static/svg/chat_received.svg'} />
							)}
							{status !== 0 && isHoverAction && (
								<div className='flex items-center'>
									<ImageCustom
										width={16}
										height={16}
										onClick={() => handleReplyMessage(content)}
										src={'/static/svg/share_comment.svg'}
										className='cursor-pointer'
									/>
									<ImageCustom
										width={18}
										height={18}
										onClick={() => onReaction(content)}
										src={'/static/svg/heart.svg'}
										className='cursor-pointer'
									/>
								</div>
							)}
						</div>
					)}
					{reaction && reaction?.length > 0 && (
						<div className='-mt-2 h-4'>
							<ImageCustom width={16} height={16} src='/static/svg/heart-red.svg' />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default FriendMessage;
