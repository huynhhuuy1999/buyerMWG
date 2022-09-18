import { useSubscription } from '@apollo/react-hooks';
import { ImageCustom } from 'components';
import { CHAT_TYPE } from 'enums';
import { QUERY_MESSAGE_BY_MESSAGE_ID } from 'graphql/queries/message';
import { useAuth } from 'hooks';
import { Content, MessageChat, Users } from 'models';
import React, { Fragment } from 'react';

import { EmptyImage, REGEX_IMAGE, REGEX_VIDEO } from '@/constants/index';
import { checkTypeMedia } from '@/utils/convertTime';
interface IMessageAnswerProps {
	messageId: string;
	senderId: string;
	listUserChat: Users[];
}
const MessageAnswer: React.FC<IMessageAnswerProps> = ({
	messageId,
	senderId,
	listUserChat,
}: IMessageAnswerProps) => {
	const replyResult = useSubscription(QUERY_MESSAGE_BY_MESSAGE_ID, {
		variables: {
			messageId: messageId,
		},
	});
	const replyTo: MessageChat =
		replyResult.data && !replyResult.error && !replyResult.loading
			? replyResult.data.webchat_chat_message?.[0]
			: {};
	const answerTo = listUserChat.find((item) => item.id === replyTo?.sender_id);
	const { currentUser } = useAuth();
	const renderReplyMessage = (message: Content) => {
		switch (message.event_type) {
			case CHAT_TYPE.MESSAGE:
				return (
					<div className='break-all p-2 text-justify text-12 font-normal not-italic leading-normal tracking-0.0025em opacity-80'>
						{message.content}
					</div>
				);
			case CHAT_TYPE.MEDIA:
				const renderMediaFile = (urlMedia: string) => {
					const type = checkTypeMedia(urlMedia);
					switch (type.split('/')[0]) {
						case 'video':
							return (
								<video controls className='max-h-[284px] max-w-[284px] rounded-lg border'>
									<source
										className='max-h-[280px] max-w-[284px] px-6'
										src={urlMedia && REGEX_VIDEO.test(urlMedia) ? urlMedia : EmptyImage}
										type={type}
									/>
									<track src='' kind='captions' label='english_captions'></track>
								</video>
							);
						case 'image':
							return (
								<ImageCustom
									width={urlMedia.length > 2 ? 126 : 378 / urlMedia.length}
									height={urlMedia.length > 2 ? 126 : 378 / urlMedia.length}
									src={urlMedia && REGEX_IMAGE.test(urlMedia) ? urlMedia : EmptyImage}
								/>
							);
						case 'application':
							return <>'File Office'</>;
						default:
							return <>temp</>;
					}
				};
				return (
					<Fragment>
						{message.media_url && message.media_url?.length > 0 ? (
							message.media_url.map((media_url) => renderMediaFile(media_url))
						) : (
							<></>
						)}
					</Fragment>
				);
			case CHAT_TYPE.ORDER:
			default:
				return <></>;
		}
	};

	return (
		<div className='px-1'>
			<div className='flex w-max items-center space-x-2'>
				{answerTo && answerTo.id ? (
					<Fragment>
						<ImageCustom
							className='h-4 w-4 rounded-full border border-gray-300 bg-gray-300 lg:h-6 lg:w-6'
							width={16}
							height={16}
							src={
								answerTo?.avatar && REGEX_IMAGE.test(answerTo?.avatar)
									? answerTo?.avatar
									: EmptyImage
							}
						/>
						<span className='text-sm font-semibold not-italic leading-normal tracking-0.0025em text-black'>
							{answerTo?.name}
						</span>
					</Fragment>
				) : (
					<Fragment>
						<span className='text-sm font-semibold not-italic leading-normal tracking-0.0025em text-black'>
							{senderId === currentUser?.id ? 'Đã trả lời chính mình' : 'Đã trả lời bạn'}
						</span>
					</Fragment>
				)}
			</div>
			{renderReplyMessage(replyTo.content || {})}
		</div>
	);
};

export default MessageAnswer;
