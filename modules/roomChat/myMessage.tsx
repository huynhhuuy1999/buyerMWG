import { useSubscription } from '@apollo/react-hooks';
import { ImageCustom } from 'components';
import { CHAT_TYPE } from 'enums';
import { getMessageByMessageId } from 'graphql/queries/message';
import { Content, MessageChat, Reaction } from 'models';
import React, { useEffect, useState } from 'react';

import MediaMessage from './mediaMessage';
interface IMyMessageProps {
	content?: Content;
	status?: number;
	timeLine?: string;
	reaction?: Reaction[];
	isCheckAvt?: boolean;
	handleReplyMessage: (replyTo?: Content) => void;
	onReaction: (content?: Content) => void;
}
const MyMessage: React.FC<IMyMessageProps> = ({
	content,
	status,
	reaction,
	timeLine,
	isCheckAvt,
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
		if (contentReply && contentReply.data) {
			const contentRep: MessageChat = contentReply.data.webchat_chat_message?.[0];
			if (contentRep) {
				setMessageReply(contentRep);
			}
		}
	}, [contentReply]);
	return (
		<div className='flex w-full flex-col items-end justify-center py-2'>
			{messageReply && messageReply.id && (
				<div className='flex items-center space-x-2'>
					<ImageCustom width={14} height={14} src={'/static/svg/share_comment.svg'} />
					<div className='text-sm font-light'>
						Đã trả lời {messageReply.sender_id === content?.sender ? 'chính mình' : 'khách'}
					</div>
				</div>
			)}
			{messageReply && messageReply.content?.event_type === CHAT_TYPE.MESSAGE && (
				<div className='max-w-[80%] rounded-md bg-gray-200 px-[6px] pb-4 pt-2 opacity-50 shadow'>
					<span className='block text-sm opacity-90'>{messageReply.content?.content}</span>
				</div>
			)}
			{messageReply && messageReply.content?.event_type === CHAT_TYPE.MEDIA && (
				<MediaMessage
					media={messageReply.content.media_url ? messageReply.content.media_url : []}
					className='max-w-[80%] opacity-50'
				/>
			)}
			<div className='-mt-4 flex w-full content-center items-center justify-end'>
				<div className='relative flex w-full flex-col items-end'>
					{content?.content && (
						<div
							className='flex w-full items-center justify-end'
							role='none'
							tabIndex={0}
							onMouseLeave={() => setIsHoverAction(false)}
							onMouseEnter={() => setIsHoverAction(true)}
						>
							{status === 0 ? (
								<ImageCustom width={18} height={18} src={'/static/svg/chat_received.svg'} />
							) : (
								isHoverAction && (
									<div className='flex items-center space-x-2'>
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
								)
							)}
							<div
								className='relative max-w-[80%] rounded bg-[#F05A94] px-[6px] py-2 text-sm text-white shadow'
								title={timeLine}
							>
								<span className='block'>{content?.content}</span>
								{!isCheckAvt && timeLine && (
									<span className='-mb-2 flex items-end justify-start text-[10px] opacity-50'>
										{timeLine}
									</span>
								)}
							</div>
						</div>
					)}
					{content?.media_url && content.media_url.length > 0 && (
						<div
							className='flex w-full items-center justify-end'
							role='none'
							tabIndex={0}
							onMouseLeave={() => setIsHoverAction(false)}
							onMouseEnter={() => setIsHoverAction(true)}
						>
							{status === 0 ? (
								<ImageCustom width={18} height={18} src={'/static/svg/chat_received.svg'} />
							) : (
								isHoverAction && (
									<div className='flex items-center space-x-2'>
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
								)
							)}
							<MediaMessage
								media={content.media_url}
								className='max-w-[80%]'
								title={timeLine}
								clss={'ml-[5px] mt-1'}
							/>
							{!isCheckAvt && timeLine && (
								<span className='-mb-2 flex items-end justify-start text-[10px] opacity-50'>
									{timeLine}
								</span>
							)}
						</div>
					)}
					{reaction && reaction.length > 0 && (
						<div className='-mt-2 mr-1 h-4'>
							<ImageCustom width={16} height={16} src='/static/svg/heart-red.svg' />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
export default MyMessage;
