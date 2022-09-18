import { useAppSelector } from 'hooks';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import { CHAT_TYPE } from '@/enums/index';
import { useAuth } from '@/hooks/useAuth';
import { Content, Conversation, Users } from '@/models/chat';
import { ShopInterface } from '@/models/shop';
import { getUserChatAPI } from '@/services/chat';
import { listConversationSelector, messageSentSelector } from '@/store/reducers/chatSlice';

import InputChat from './inputChat';
import MessageOrder from './messageOrder';

// import MessageOrder from './messageOrder';
interface IChatOrdersProps {
	merchant: ShopInterface;
}

const ChatOrders: React.FC<IChatOrdersProps> = ({ merchant }: IChatOrdersProps) => {
	const [iconPicker, setIconPicker] = useState<boolean>(false);
	const [conversation, setConversation] = useState<Conversation>({});
	const [replyTo, setReplyTo] = useState<Content>({});
	const listConversation = useAppSelector(listConversationSelector);
	const messageSent = useAppSelector(messageSentSelector);
	const [listUserChat, setListUserChat] = useState<Users[]>([]);

	const emojiRef = useRef<HTMLDivElement>(null);
	const pickerRef = useRef<HTMLDivElement>(null);
	const { currentUser } = useAuth();

	useEffect(() => {
		const onHandleClickOutside = (event: any) => {
			if (
				emojiRef.current &&
				!emojiRef.current.contains(event.target) &&
				pickerRef.current &&
				!pickerRef.current.contains(event.target) &&
				iconPicker
			) {
				setIconPicker(false);
			}
		};

		document.addEventListener('click', onHandleClickOutside);

		return () => document.removeEventListener('click', onHandleClickOutside);
	}, [iconPicker, pickerRef]);

	useEffect(() => {
		const getConversation = listConversation.find(
			(item) => item.participates === `[${merchant.userId}]`,
		);
		if (!conversation?.conversation_id) {
			if (getConversation) {
				setConversation(getConversation);
			} else {
				setConversation({
					last_message: {},
					participate_user_id: currentUser?.id,
					participates: `[${merchant?.userId}]`,
					status: true,
					name: merchant?.name,
					conversation_type: '',
					type: CHAT_TYPE.CONVERSATION,
					avatar: merchant?.avatarImage,
				});
			}
		}
	}, [listConversation]);

	useEffect(() => {
		if (conversation) {
			if (conversation.participates && conversation.conversation_type !== 'individual') {
				conversation.participates
					.replace('[', '')
					.replace(']', '')
					.split(',')
					.forEach((item: string) => {
						if (item) {
							getUserChatAPI(item).then((response) => {
								if (!response.isError && response.data) {
									setListUserChat((list) => list.concat(response.data));
								}
							});
						}
					});
			} else {
				const userTmp: Users = {
					id: merchant?.userId,
					name: merchant?.name,
					avatar: merchant?.avatarImage,
					is_chat_accepted: true,
				};
				setListUserChat([userTmp]);
			}
		}
	}, [conversation]);

	return (
		<Fragment>
			<div className='relative max-h-[500px] rounded'>
				<div className='flex max-h-[450px] flex-col justify-end rounded-t-lg bg-[#f0f0f0]'>
					{conversation && conversation.conversation_id && (
						<MessageOrder
							conversation={conversation}
							messageSent={messageSent}
							listUserChat={listUserChat}
							setReplyTo={setReplyTo}
						/>
					)}
					<div className='bottom-0 w-full bg-white'>
						<InputChat
							conversation={conversation}
							replyTo={replyTo}
							setReplyTo={setReplyTo}
							messageSent={messageSent}
							listConversation={listConversation}
							merchant={listUserChat[0]}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ChatOrders;
