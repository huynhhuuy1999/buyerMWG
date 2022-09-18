import { useSubscription } from '@apollo/react-hooks';
import { QUERY_MESSAGE_BY_CONVERSATION_ID } from 'graphql/queries/message';
import { useAppDispatch } from 'hooks';
import moment from 'moment';
import React, { Fragment, useRef, useState } from 'react';

import { CHAT_STATUS, CHAT_TYPE } from '@/enums/index';
import { useChat } from '@/hooks/useChat';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { Content, Conversation, MessageChat, MessagePayload, Users } from '@/models/chat';
import { chatAction, sendReactionRequest } from '@/store/reducers/chatSlice';

import MessageBox from './messageBox';
import MessageMedia from './messageMedia';
import ProductMessage from './productMessage';

interface IMessageOrderProps {
	conversation: Conversation;
	messageSent: MessageChat[];
	listUserChat: Users[];
	setReplyTo: React.Dispatch<React.SetStateAction<Content>>;
}

const MessageOrder: React.FC<IMessageOrderProps> = ({
	conversation,
	messageSent,
	setReplyTo,
	listUserChat,
}: IMessageOrderProps) => {
	const [pageSize, setPageSize] = useState<number>(20);
	const [listMessage, setListMessage] = useState<MessageChat[]>([]);

	const prevScrollY = useRef<HTMLDivElement>(null);
	const scrollY = prevScrollY.current;

	const dispatch = useAppDispatch();

	const { seenMessage } = useChat();

	// let isLoadMore: boolean = false;
	const pageTimeOut: { current: NodeJS.Timeout | null } = useRef(null);

	let STEP_PAGE_DATA = 10;

	const resultMessage = useSubscription(QUERY_MESSAGE_BY_CONVERSATION_ID, {
		variables: {
			conversationId: conversation.conversation_id,
			pageSize: pageSize,
		},
	});

	// useEffect(() => {
	// 	if (isLoadMore && scrollY) {
	// 		isLoadMore = false;
	// 		const scrollTop = scrollY?.scrollTop;
	// 		const clientHeight = scrollY.clientHeight;
	// 		const scrollTo = scrollTop + clientHeight;
	// 		scrollY.scrollTo({
	// 			top: scrollTo,
	// 			behavior: 'smooth',
	// 		});
	// 	}
	// }, [pageSize]);

	// useEffect(() => {
	// 	if (pageSize > 20) {
	// 		isLoadMore = false;
	// 	}
	// }, [pageSize]);

	useIsomorphicLayoutEffect(() => {
		if (!resultMessage.loading) {
			const messageData: MessageChat[] = resultMessage?.data?.webchat_chat_message || [];
			if (messageData.length > 0 || messageSent.length > 0) {
				const dataTemp: any = messageSent.reduce(
					(initial: { initialTemp: MessageChat[]; initialValue: MessageChat[] }, currentValue) => {
						if (currentValue.conversation_id === conversation.conversation_id) {
							let findMemo = messageData.find((obj) => obj.message_id === currentValue.message_id);
							if (!findMemo) {
								return { ...initial, initialTemp: initial.initialTemp.concat(currentValue) };
							} else {
								return {
									...initial,
									initialValue: initial.initialValue.filter(
										(x) => x.message_id !== currentValue.message_id,
									),
								};
							}
						}
						return initial;
					},
					{ initialTemp: [], initialValue: messageSent },
				);
				if (dataTemp.initialValue.length !== messageSent.length) {
					dispatch(chatAction.setMessageSent(dataTemp.initialValue));
				}
				setListMessage(dataTemp.initialTemp.concat(messageData));
			} else {
				setListMessage([]);
			}
		}
	}, [resultMessage, messageSent]);

	useIsomorphicLayoutEffect(() => {
		if (conversation && conversation.conversation_id) {
			onSeen();
		}
	}, [listMessage, conversation]);

	const onScroll = () => {
		let currentScrollY = scrollY ? scrollY.scrollHeight + scrollY.scrollTop : 0;
		let clientHeight = scrollY?.clientHeight ? scrollY?.clientHeight : 0;
		if (pageTimeOut.current) {
			clearTimeout(pageTimeOut.current);
		}
		if (currentScrollY - clientHeight <= 0.5 && listMessage.length >= pageSize) {
			pageTimeOut.current = setTimeout(() => {
				scrollY?.scrollTo({
					top: scrollY.scrollTop + clientHeight * 2,
					behavior: 'smooth',
				});
				setPageSize(pageSize + STEP_PAGE_DATA);
			}, 20);
		}
		if (scrollY?.scrollTop === 0 && conversation.conversation_id) {
			onSeen();
		}
	};

	const onSeen = () => {
		const checkFlog = listMessage.filter(
			(item) =>
				item.content?.event_type !== CHAT_TYPE.TYPING &&
				item.sender_id !== conversation.participate_user_id,
		);
		if (
			(listMessage || []).length > 0 &&
			checkFlog.length > 0 &&
			checkFlog?.[0].status !== CHAT_STATUS.SEEN
		) {
			const payload: MessagePayload = {
				conv_id: conversation.conversation_id || '',
				type: CHAT_TYPE.SEEN,
				msg_id: listMessage.filter((item) => item.type !== CHAT_TYPE.TYPING)?.[0]?.message_id,
			};
			seenMessage(payload);
		}
	};

	// re-render scrollbar

	const handleReplyMessage = (content: Content) => {
		setReplyTo(content);
	};

	const onReaction = (content: Content) => {
		if (content) {
			const payload: MessagePayload = {
				type: CHAT_TYPE.REACTION,
				conv_id: content.conv_id || '',
				msg_id: content.msg_id,
			};
			const reactionTemp = listMessage.map((item) => {
				if (item.message_id === content.msg_id) {
					return {
						...item,
						reaction: [
							{
								Name: 'tym',
								Reaction: 'tym',
								UserId: conversation.participate_user_id || '',
							},
						],
					};
				}
				return item;
			});
			setListMessage(reactionTemp);
			dispatch(sendReactionRequest(payload));
		}
	};

	const renderTimeCount = (timeAt?: string) => {
		if (timeAt) {
			const countTime = moment.duration(moment().diff(moment(timeAt)));
			if (countTime.years() > 0 || countTime.months() > 0) {
				const timer = moment(timeAt).format('hh:mm, DD/MM/YYYY');
				return timer;
			} else if (countTime.days() > 1) {
				const timer = moment(timeAt).format('hh:mm, ddd DD MM, YYYY');
				return timer;
			} else if (countTime.hours() > 12) {
				const timer = moment(timeAt).format('HH:mm');
				return timer;
			} else {
				return moment(timeAt).format('HH:mm');
			}
		}
		return null;
	};

	const checkTime = (createAt?: string, prevTime?: string) => {
		const diffTime = moment.duration(moment(createAt).diff(moment(prevTime)));
		if (
			diffTime &&
			(diffTime.minutes() > 30 ||
				diffTime.hours() > 0 ||
				diffTime.days() > 0 ||
				diffTime.months() > 0 ||
				diffTime.years() > 0)
		) {
			return false;
		} else {
			return true;
		}
	};

	const renderAvatar = (message: MessageChat, nextMessage: MessageChat) => {
		const isCheckAvt =
			nextMessage &&
			nextMessage.sender_id === message.sender_id &&
			checkTime(nextMessage.created_at, message.created_at)
				? true
				: false;
		return isCheckAvt;
	};

	const renderMessage = (message: MessageChat, isCheckAvt: boolean, isLastMessage: boolean) => {
		if (message.content) {
			switch (message.content.event_type) {
				case CHAT_TYPE.CONVERSATION:
					break;
				case CHAT_TYPE.MESSAGE:
					return (
						<MessageBox
							message={message?.content}
							listUserChat={listUserChat}
							isCheckAvt={isCheckAvt}
							isLastMessage={isLastMessage}
							handleReplyMessage={handleReplyMessage}
							onReaction={onReaction}
							reaction={message.reaction || []}
							status={message.status === CHAT_STATUS.SENT}
							timeLine={renderTimeCount(message.created_at)}
						/>
					);
				case CHAT_TYPE.MEDIA:
					return (
						<MessageMedia
							title={message.type}
							content={message.content}
							status={message.status === CHAT_STATUS.SENT}
							isCheckAvt={isCheckAvt}
							isLastMessage={isLastMessage}
							listUserChat={listUserChat}
							handleReplyMessage={handleReplyMessage}
							onReaction={onReaction}
							reaction={message.reaction || []}
							timeLine={renderTimeCount(message.created_at)}
						/>
					);
				case CHAT_TYPE.ORDER:
					return <ProductMessage />;
				default:
					return <></>;
			}
		}
		return <></>;
	};

	return (
		<div
			className='relative flex w-full flex-col-reverse overflow-y-auto overscroll-y-contain p-3'
			ref={prevScrollY}
			onScroll={onScroll}
		>
			{listMessage.map((item: MessageChat, index) => {
				const isCheckAvt = renderAvatar(item, listMessage[index + 1]);
				const isLastMessage = renderAvatar(item, listMessage[index - 1]);
				return <Fragment key={index}>{renderMessage(item, isCheckAvt, isLastMessage)}</Fragment>;
			})}
		</div>
	);
};

export default MessageOrder;
